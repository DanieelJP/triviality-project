<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    // Lista de servidores alternativos de LibreTranslate
    private $servers = [
        'https://translate.argosopentech.com',
        'https://translate.terraprint.co',
        'https://lt.vern.cc'
    ];
    private $targetLang = 'es';
    private $timeout = 3; // 3 seconds timeout

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

        // Check cache first
        $cacheKey = 'translation_' . md5($decodedText . $this->targetLang);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Try each server until we get a successful translation
        foreach ($this->servers as $baseUrl) {
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
                        Cache::put($cacheKey, $translatedText, now()->addHours(24));
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
}
