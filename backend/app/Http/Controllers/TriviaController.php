<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Interfaces\TranslationInterface;
use App\Services\TranslationCacheService;
use Illuminate\Support\Facades\Log;

class TriviaController extends Controller
{
    private $baseUrl = 'https://opentdb.com/api.php';
    private $translationService;
    private $cacheService;

    public function __construct(TranslationInterface $translationService, TranslationCacheService $cacheService)
    {
        $this->translationService = $translationService;
        $this->cacheService = $cacheService;
    }

    public function getQuestions(Request $request)
    {
        try {
            $startTime = microtime(true);
            
            // Obtener el idioma seleccionado (por defecto español)
            $language = $request->input('language', 'es');
            
            $response = Http::timeout(5)->get($this->baseUrl, [
                'amount' => $request->input('amount', 10),
                'difficulty' => $request->input('difficulty', 'medium'),
                'type' => 'multiple'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['results']) && is_array($data['results'])) {
                    // Actualizar la propiedad targetLang en TranslationService
                    $this->translationService->setTargetLang($language);
                    
                    // Usar la traducción optimizada
                    $data['results'] = $this->translationService->translateQuestionsOptimized($data['results']);
                }
                
                $endTime = microtime(true);
                $executionTime = ($endTime - $startTime);
                Log::info("Tiempo de ejecución para obtener y traducir preguntas: " . $executionTime . " segundos (idioma: $language)");

                return response()->json($data);
            }

            Log::error('OpenTDB API error: ' . $response->body());
            return response()->json(['error' => 'Error al obtener preguntas'], 500);
        } catch (\Exception $e) {
            Log::error('TriviaController error: ' . $e->getMessage());
            return response()->json(['error' => 'Error del servidor'], 500);
        }
    }

    public function getCategories(Request $request)
    {
        try {
            $startTime = microtime(true);
            
            // Obtener el idioma seleccionado (por defecto español)
            $language = $request->input('language', 'es');
            
            $response = Http::timeout(5)->get('https://opentdb.com/api_category.php');

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['trivia_categories']) && is_array($data['trivia_categories'])) {
                    // Actualizar la propiedad targetLang en TranslationService
                    $this->translationService->setTargetLang($language);
                    
                    // Traducir directamente las categorías - son pocas
                    foreach ($data['trivia_categories'] as &$category) {
                        $category['name'] = $this->translationService->translate($category['name']);
                        // Aplicar limpieza adicional
                        $category['name'] = $this->translationService->cleanText($category['name']);
                    }
                }
                
                $endTime = microtime(true);
                $executionTime = ($endTime - $startTime);
                Log::info("Tiempo de ejecución para obtener y traducir categorías: " . $executionTime . " segundos (idioma: $language)");

                return response()->json($data);
            }

            Log::error('OpenTDB Categories API error: ' . $response->body());
            return response()->json(['error' => 'Error al obtener categorías'], 500);
        } catch (\Exception $e) {
            Log::error('TriviaController categories error: ' . $e->getMessage());
            return response()->json(['error' => 'Error del servidor'], 500);
        }
    }
    
    /**
     * Limpia el caché de traducciones
     * Útil cuando se hacen cambios en el servicio de traducción
     */
    public function clearTranslationCache()
    {
        try {
            // Usar el servicio específico para limpiar el caché de traducciones
            $entriesRemoved = $this->cacheService->clearAllTranslations();
            
            Log::info("Translation cache cleared successfully");
            
            return response()->json([
                'success' => true,
                'message' => "Se ha limpiado el caché de traducciones"
            ]);
        } catch (\Exception $e) {
            Log::error("Error clearing translation cache: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Error al limpiar el caché de traducciones: ' . $e->getMessage()
            ], 500);
        }
    }
}