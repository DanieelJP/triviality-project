<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TranslationServerService
{
    /**
     * Lista de servidores de traducción disponibles
     *
     * @var array
     */
    private array $servers = [
        'http://localhost:5000',
        'https://translate.argosopentech.com',
        'https://translate.terraprint.co',
        'https://lt.vern.cc',
    ];

    /**
     * Tiempo de espera para el servidor local (en segundos)
     *
     * @var int
     */
    private int $localTimeout = 2;

    /**
     * Tiempo de espera para servidores remotos (en segundos)
     *
     * @var int
     */
    private int $remoteTimeout = 5;

    /**
     * Obtiene una traducción utilizando un servidor específico
     *
     * @param string $server URL del servidor de traducción
     * @param string $text Texto a traducir
     * @param string $targetLang Idioma de destino
     * @param string $sourceLang Idioma de origen
     * @param int $timeout Tiempo de espera en segundos
     * @return string|null Texto traducido o null si hubo error
     */
    public function translateWithServer(
        string $server, 
        string $text, 
        string $targetLang, 
        string $sourceLang = 'en',
        int $timeout = null
    ): ?string
    {
        $timeout = $timeout ?? $this->remoteTimeout;
        
        try {
            $response = Http::timeout($timeout)
                ->retry(1, 100)
                ->post($server . '/translate', [
                    'q' => $text,
                    'source' => $sourceLang,
                    'target' => $targetLang,
                    'format' => 'text',
                ]);

            if ($response->successful()) {
                $translated = $response->json()['translatedText'] ?? null;
                return $translated;
            }
        } catch (\Exception $e) {
            Log::warning("Translation failed with $server: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Obtiene una traducción utilizando todos los servidores disponibles
     *
     * @param string $text Texto a traducir
     * @param string $targetLang Idioma de destino
     * @param string $sourceLang Idioma de origen
     * @return string|null Texto traducido o null si todos los servidores fallaron
     */
    public function translateWithAvailableServers(
        string $text, 
        string $targetLang, 
        string $sourceLang = 'en'
    ): ?string
    {
        // Intentar con servidor local primero (es más rápido)
        $localServer = $this->servers[0];
        if ($translated = $this->translateWithServer($localServer, $text, $targetLang, $sourceLang, $this->localTimeout)) {
            Log::info("Translation successful using local server");
            return $translated;
        }

        // Intentar con servidores remotos si el local falló
        foreach (array_slice($this->servers, 1) as $server) {
            if ($translated = $this->translateWithServer($server, $text, $targetLang, $sourceLang, $this->remoteTimeout)) {
                Log::info("Translation successful using server: $server");
                return $translated;
            }
        }

        Log::error("All translation servers failed for text: " . substr($text, 0, 100));
        return null;
    }

    /**
     * Configura la lista de servidores de traducción
     *
     * @param array $servers
     * @return void
     */
    public function setServers(array $servers): void
    {
        $this->servers = $servers;
    }

    /**
     * Configura el tiempo de espera para el servidor local
     *
     * @param int $timeout
     * @return void
     */
    public function setLocalTimeout(int $timeout): void
    {
        $this->localTimeout = $timeout;
    }

    /**
     * Configura el tiempo de espera para servidores remotos
     *
     * @param int $timeout
     * @return void
     */
    public function setRemoteTimeout(int $timeout): void
    {
        $this->remoteTimeout = $timeout;
    }
} 