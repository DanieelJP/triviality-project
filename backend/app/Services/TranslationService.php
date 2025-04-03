<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    // Lista de servidores de traducción, con el local como primera opción
    private $servers = [
        'http://localhost:5000', // Servidor local (Docker)
        'https://translate.argosopentech.com',
        'https://translate.terraprint.co',
        'https://lt.vern.cc'
    ];
    private $targetLang = 'es';
    private $timeout = 5; // 5 seconds timeout para servidores externos, más bajo para el local

    // Traducciones fijas para términos comunes (evita llamadas a API)
    private $fixedTranslations = [
        // Dificultades
        'easy' => 'fácil',
        'medium' => 'medio',
        'hard' => 'difícil',
        
        // Categorías comunes
        'General Knowledge' => 'Conocimiento General',
        'Entertainment: Books' => 'Entretenimiento: Libros',
        'Entertainment: Film' => 'Entretenimiento: Películas',
        'Entertainment: Music' => 'Entretenimiento: Música',
        'Entertainment: Television' => 'Entretenimiento: Televisión',
        'Entertainment: Video Games' => 'Entretenimiento: Videojuegos',
        'Entertainment: Board Games' => 'Entretenimiento: Juegos de Mesa',
        'Science & Nature' => 'Ciencia y Naturaleza',
        'Science: Computers' => 'Ciencia: Informática',
        'Science: Mathematics' => 'Ciencia: Matemáticas',
        'Mythology' => 'Mitología',
        'Sports' => 'Deportes',
        'Geography' => 'Geografía',
        'History' => 'Historia',
        'Politics' => 'Política',
        'Art' => 'Arte',
        'Celebrities' => 'Celebridades',
        'Animals' => 'Animales',
        'Vehicles' => 'Vehículos',
        
        // Respuestas comunes
        'True' => 'Verdadero',
        'False' => 'Falso',
        'Yes' => 'Sí',
        'No' => 'No',
    ];

    private function decodeHtmlEntities($text)
    {
        return html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    public function translate($text)
    {
        if (empty($text)) {
            return $text;
        }

        // Decode HTML entities before translation
        $decodedText = $this->decodeHtmlEntities($text);

        // Traducciones fijas (para términos comunes)
        if (isset($this->fixedTranslations[$decodedText])) {
            return $this->fixedTranslations[$decodedText];
        }

        // Check cache first
        $cacheKey = 'translation_' . md5($decodedText . $this->targetLang);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Intentar primero con el servidor local (debe ser más rápido)
        $localServer = $this->servers[0];
        try {
            // Timeout más corto para servidor local
            $response = Http::timeout(2)
                ->post($localServer . '/translate', [
                    'q' => $decodedText,
                    'source' => 'en',
                    'target' => $this->targetLang,
                    'format' => 'text',
                ]);

            if ($response->successful()) {
                $translatedText = $response->json()['translatedText'] ?? null;
                if ($translatedText) {
                    Cache::put($cacheKey, $translatedText, now()->addDays(7));
                    Log::info("Translation successful using local server");
                    return $translatedText;
                }
            }
        } catch (\Exception $e) {
            Log::warning("Local translation server failed: " . $e->getMessage());
            // Continuar con servidores externos si el local falla
        }

        // Si el servidor local falló, intentar con servidores remotos
        foreach (array_slice($this->servers, 1) as $baseUrl) {
            try {
                $response = Http::timeout($this->timeout)
                    ->retry(1, 100)
                    ->post($baseUrl . '/translate', [
                        'q' => $decodedText,
                        'source' => 'en',
                        'target' => $this->targetLang,
                        'format' => 'text',
                    ]);

                if ($response->successful()) {
                    $translatedText = $response->json()['translatedText'] ?? null;
                    if ($translatedText) {
                        Cache::put($cacheKey, $translatedText, now()->addDays(7));
                        Log::info("Translation successful using server: " . $baseUrl);
                        return $translatedText;
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Translation failed with server {$baseUrl}: " . $e->getMessage());
                continue; // Try next server
            }
        }

        Log::error('All translation servers failed for text: ' . substr($decodedText, 0, 100));
        return $decodedText; // Return decoded original if all servers fail
    }

    public function translateArray($items)
    {
        if (!is_array($items)) {
            return $items;
        }
        return array_map(function ($item) {
            return $this->translate($item);
        }, $items);
    }

    public function translateQuestion($question)
    {
        if (!is_array($question)) {
            return $question;
        }
        
        return [
            'category' => $this->translate($question['category'] ?? ''),
            'type' => $question['type'] ?? '',
            'difficulty' => $this->translate($question['difficulty'] ?? ''),
            'question' => $this->translate($question['question'] ?? ''),
            'correct_answer' => $this->translate($question['correct_answer'] ?? ''),
            'incorrect_answers' => $this->translateArray($question['incorrect_answers'] ?? [])
        ];
    }
    
    /**
     * Traduce preguntas de forma optimizada para mejor rendimiento
     */
    public function translateQuestionsOptimized($questions)
    {
        if (!is_array($questions) || empty($questions)) {
            return $questions;
        }
        
        // Paso 1: Identificar y traducir categorías únicas (son pocas)
        $categories = array_unique(array_column($questions, 'category'));
        $translatedCategories = [];
        foreach ($categories as $category) {
            $translatedCategories[$category] = $this->translate($category);
        }
        
        // Paso 2: Identificar y traducir dificultades únicas (solo 3: easy, medium, hard)
        $difficulties = array_unique(array_column($questions, 'difficulty'));
        $translatedDifficulties = [];
        foreach ($difficulties as $difficulty) {
            $translatedDifficulties[$difficulty] = $this->translate($difficulty);
        }
        
        // Paso 3: Extraer y traducir preguntas y respuestas únicas
        $uniqueTexts = [];
        
        // Recopilar todos los textos únicos
        foreach ($questions as $question) {
            // Preguntas
            if (!empty($question['question'])) {
                $uniqueTexts[$question['question']] = true;
            }
            
            // Respuesta correcta
            if (!empty($question['correct_answer'])) {
                $uniqueTexts[$question['correct_answer']] = true;
            }
            
            // Respuestas incorrectas
            if (isset($question['incorrect_answers']) && is_array($question['incorrect_answers'])) {
                foreach ($question['incorrect_answers'] as $answer) {
                    if (!empty($answer)) {
                        $uniqueTexts[$answer] = true;
                    }
                }
            }
        }
        
        // Traducir todos los textos únicos de una vez
        $translations = [];
        foreach (array_keys($uniqueTexts) as $text) {
            $translations[$text] = $this->translate($text);
        }
        
        // Construir el resultado con las traducciones
        $result = [];
        foreach ($questions as $index => $question) {
            $translatedQuestion = $question;
            
            // Usar las traducciones almacenadas
            if (isset($question['category'])) {
                $translatedQuestion['category'] = $translatedCategories[$question['category']] ?? $question['category'];
            }
            
            if (isset($question['difficulty'])) {
                $translatedQuestion['difficulty'] = $translatedDifficulties[$question['difficulty']] ?? $question['difficulty'];
            }
            
            if (isset($question['question'])) {
                $translatedQuestion['question'] = $translations[$question['question']] ?? $question['question'];
            }
            
            if (isset($question['correct_answer'])) {
                $translatedQuestion['correct_answer'] = $translations[$question['correct_answer']] ?? $question['correct_answer'];
            }
            
            if (isset($question['incorrect_answers']) && is_array($question['incorrect_answers'])) {
                $translatedIncorrect = [];
                foreach ($question['incorrect_answers'] as $answer) {
                    $translatedIncorrect[] = $translations[$answer] ?? $answer;
                }
                $translatedQuestion['incorrect_answers'] = $translatedIncorrect;
            }
            
            $result[$index] = $translatedQuestion;
        }
        
        return $result;
    }
}
