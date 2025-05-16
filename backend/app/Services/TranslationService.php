<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    private array $servers = [
        'http://localhost:5000',
        'https://translate.argosopentech.com',
        'https://translate.terraprint.co',
        'https://lt.vern.cc',
    ];

    private string $targetLang = 'es';
    private int $timeout = 5;

    public function setTargetLang(string $lang): void
    {
        $this->targetLang = $lang;
    }

    public function translate(string $text): string
    {
        if (empty($text)) return $text;

        $decodedText = $this->decodeHtmlEntities($text);

        if ($this->isProperName($decodedText)) {
            Log::info("Skipping translation for proper name: $decodedText");
            return $decodedText;
        }

        $cacheKey = 'translation_' . md5($decodedText . $this->targetLang);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Intentar con servidor local
        if ($translated = $this->tryTranslateWithServer($this->servers[0], $decodedText, 2)) {
            Cache::put($cacheKey, $translated, now()->addDays(7));
            Log::info("Translation successful using local server");
            return $translated;
        }

        // Intentar con servidores remotos
        foreach (array_slice($this->servers, 1) as $server) {
            if ($translated = $this->tryTranslateWithServer($server, $decodedText, $this->timeout)) {
                Cache::put($cacheKey, $translated, now()->addDays(7));
                Log::info("Translation successful using server: $server");
                return $translated;
            }
        }

        Log::error("All translation servers failed for text: " . substr($decodedText, 0, 100));
        return $decodedText;
    }

    private function tryTranslateWithServer(string $server, string $text, int $timeout): ?string
    {
        try {
            $response = Http::timeout($timeout)
                ->retry(1, 100)
                ->post($server . '/translate', [
                    'q' => $text,
                    'source' => 'en',
                    'target' => $this->targetLang,
                    'format' => 'text',
                ]);

            if ($response->successful()) {
                $translated = $response->json()['translatedText'] ?? null;
                return $translated ? $this->cleanTranslatedText($translated) : null;
            }
        } catch (\Exception $e) {
            Log::warning("Translation failed with $server: " . $e->getMessage());
        }

        return null;
    }

    public function translateArray(array $items): array
    {
        return array_map([$this, 'translate'], $items);
    }

    public function translateQuestion(array $question): array
    {
        return [
            'category' => $this->translate($question['category'] ?? ''),
            'type' => $question['type'] ?? '',
            'difficulty' => $this->translate($question['difficulty'] ?? ''),
            'question' => $this->translate($question['question'] ?? ''),
            'correct_answer' => $this->translate($question['correct_answer'] ?? ''),
            'incorrect_answers' => $this->translateArray($question['incorrect_answers'] ?? []),
        ];
    }

    public function translateQuestionsOptimized(array $questions): array
    {
        if (empty($questions)) return [];

        // Agrupar textos únicos a traducir
        $uniqueTexts = [];
        $categories = [];
        $difficulties = [];

        foreach ($questions as $q) {
            if (isset($q['category'])) $categories[$q['category']] = true;
            if (isset($q['difficulty'])) $difficulties[$q['difficulty']] = true;
            if (isset($q['question'])) $uniqueTexts[$q['question']] = true;
            if (isset($q['correct_answer'])) $uniqueTexts[$q['correct_answer']] = true;
            if (isset($q['incorrect_answers'])) {
                foreach ((array)$q['incorrect_answers'] as $ans) {
                    $uniqueTexts[$ans] = true;
                }
            }
        }

        // Traducir los textos únicos
        $translatedTexts = [];
        foreach (array_keys($uniqueTexts) as $text) {
            $translatedTexts[$text] = $this->translate($text);
        }

        // Traducir categorías y dificultades
        $translatedCategories = [];
        foreach (array_keys($categories) as $cat) {
            $translatedCategories[$cat] = $this->translate($cat);
        }

        $translatedDifficulties = [];
        foreach (array_keys($difficulties) as $dif) {
            $translatedDifficulties[$dif] = $this->translate($dif);
        }

        // Armar resultado
        $result = [];

        foreach ($questions as $q) {
            $result[] = [
                'category' => $this->cleanTranslatedText($translatedCategories[$q['category']] ?? $q['category']),
                'type' => $q['type'] ?? '',
                'difficulty' => $this->cleanTranslatedText($translatedDifficulties[$q['difficulty']] ?? $q['difficulty']),
                'question' => $this->cleanTranslatedText($translatedTexts[$q['question']] ?? $q['question']),
                'correct_answer' => $this->cleanTranslatedText($translatedTexts[$q['correct_answer']] ?? $q['correct_answer']),
                'incorrect_answers' => array_map(fn($ans) => $this->cleanTranslatedText($translatedTexts[$ans] ?? $ans), $q['incorrect_answers'] ?? []),
            ];
        }

        return $result;
    }

    public function cleanText(string $text): string
    {
        return $this->cleanTranslatedText($text);
    }

    private function decodeHtmlEntities(string $text): string
    {
        return html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    private function isProperName(string $text): bool
    {
        // Ejemplo básico: palabra con primera letra mayúscula y sin puntuación
        return preg_match('/^[A-Z][a-z]+$/', $text) === 1;
    }

    private function cleanTranslatedText(string $text): string
    {
        return strip_tags(trim($text));
    }
}
