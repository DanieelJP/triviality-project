<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationCacheService
{
    /**
     * Tiempo de caché en días
     */
    private int $cacheDays = 7;

    /**
     * Obtiene una traducción de la caché
     *
     * @param string $text
     * @param string $targetLang
     * @return string|null
     */
    public function getFromCache(string $text, string $targetLang): ?string
    {
        $cacheKey = $this->getCacheKey($text, $targetLang);
        
        if (Cache::has($cacheKey)) {
            Log::info("Translation retrieved from cache for: " . substr($text, 0, 50));
            return Cache::get($cacheKey);
        }
        
        return null;
    }

    /**
     * Guarda una traducción en la caché
     *
     * @param string $text
     * @param string $targetLang
     * @param string $translatedText
     * @return void
     */
    public function saveToCache(string $text, string $targetLang, string $translatedText): void
    {
        $cacheKey = $this->getCacheKey($text, $targetLang);
        Cache::put($cacheKey, $translatedText, now()->addDays($this->cacheDays));
        
        Log::info("Translation saved to cache for: " . substr($text, 0, 50));
    }

    /**
     * Limpia todas las entradas de traducciones en la caché
     *
     * @return int Número de entradas eliminadas
     */
    public function clearAllTranslations(): int
    {
        // En Laravel no hay una manera directa de contar las claves eliminadas
        // Usamos flush() para limpiar toda la caché en desarrollo
        Cache::flush();
        
        Log::info("All translations cleared from cache");
        return 0; // No podemos determinar el número exacto con flush()
    }

    /**
     * Genera una clave única para guardar en caché
     *
     * @param string $text
     * @param string $targetLang
     * @return string
     */
    private function getCacheKey(string $text, string $targetLang): string
    {
        return 'translation_' . md5($text . $targetLang);
    }

    /**
     * Establece el tiempo de caché en días
     *
     * @param int $days
     * @return void
     */
    public function setCacheDays(int $days): void
    {
        $this->cacheDays = $days;
    }
} 