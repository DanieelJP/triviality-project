<?php

namespace App\Services;

use App\Interfaces\TranslationInterface;
use Illuminate\Support\Facades\Log;

class TranslationService implements TranslationInterface
{
    /**
     * @var TextCleanerService
     */
    private TextCleanerService $textCleaner;

    /**
     * @var TranslationServerService
     */
    private TranslationServerService $serverService;

    /**
     * @var TranslationCacheService
     */
    private TranslationCacheService $cacheService;

    /**
     * @var string
     */
    private string $targetLang = 'es';

    /**
     * Constructor
     *
     * @param TextCleanerService $textCleaner
     * @param TranslationServerService $serverService
     * @param TranslationCacheService $cacheService
     */
    public function __construct(
        TextCleanerService $textCleaner,
        TranslationServerService $serverService,
        TranslationCacheService $cacheService
    ) {
        $this->textCleaner = $textCleaner;
        $this->serverService = $serverService;
        $this->cacheService = $cacheService;
    }

    /**
     * {@inheritdoc}
     */
    public function setTargetLang(string $lang): void
    {
        $this->targetLang = $lang;
    }

    /**
     * {@inheritdoc}
     */
    public function translate(string $text): string
    {
        if (empty($text)) return $text;

        $decodedText = $this->textCleaner->decodeHtmlEntities($text);

        if ($this->textCleaner->isProperName($decodedText)) {
            Log::info("Skipping translation for proper name: $decodedText");
            return $decodedText;
        }

        // Buscar en caché
        if ($cached = $this->cacheService->getFromCache($decodedText, $this->targetLang)) {
            return $cached;
        }

        // Traducir con servidores disponibles
        $translated = $this->serverService->translateWithAvailableServers(
            $decodedText, 
            $this->targetLang
        );

        if ($translated) {
            $cleanedTranslation = $this->textCleaner->cleanTranslatedText($translated);
            $this->cacheService->saveToCache($decodedText, $this->targetLang, $cleanedTranslation);
            return $cleanedTranslation;
        }

        // Si no se pudo traducir, devolver el texto original
        return $decodedText;
    }

    /**
     * {@inheritdoc}
     */
    public function translateArray(array $items): array
    {
        return array_map([$this, 'translate'], $items);
    }

    /**
     * {@inheritdoc}
     */
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

    /**
     * {@inheritdoc}
     */
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
                'category' => $translatedCategories[$q['category']] ?? $q['category'],
                'type' => $q['type'] ?? '',
                'difficulty' => $translatedDifficulties[$q['difficulty']] ?? $q['difficulty'],
                'question' => $translatedTexts[$q['question']] ?? $q['question'],
                'correct_answer' => $translatedTexts[$q['correct_answer']] ?? $q['correct_answer'],
                'incorrect_answers' => array_map(fn($ans) => $translatedTexts[$ans] ?? $ans, $q['incorrect_answers'] ?? []),
            ];
        }

        return $result;
    }

    /**
     * {@inheritdoc}
     */
    public function cleanText(string $text): string
    {
        return $this->textCleaner->cleanTranslatedText($text);
    }
}
