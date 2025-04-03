<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\TranslationService;
use Illuminate\Support\Facades\Log;

class TriviaController extends Controller
{
    private $baseUrl = 'https://opentdb.com/api.php';
    private $translationService;

    public function __construct(TranslationService $translationService)
    {
        $this->translationService = $translationService;
    }

    public function getQuestions(Request $request)
    {
        try {
            $startTime = microtime(true);
            
            $response = Http::timeout(5)->get($this->baseUrl, [
                'amount' => $request->input('amount', 10),
                'difficulty' => $request->input('difficulty', 'medium'),
                'type' => 'multiple'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['results']) && is_array($data['results'])) {
                    // Usar la nueva traducción optimizada con servidor local
                    $data['results'] = $this->translationService->translateQuestionsOptimized($data['results']);
                }
                
                $endTime = microtime(true);
                $executionTime = ($endTime - $startTime);
                Log::info("Tiempo de ejecución para obtener y traducir preguntas: " . $executionTime . " segundos");

                return response()->json($data);
            }

            Log::error('OpenTDB API error: ' . $response->body());
            return response()->json(['error' => 'Error al obtener preguntas'], 500);
        } catch (\Exception $e) {
            Log::error('TriviaController error: ' . $e->getMessage());
            return response()->json(['error' => 'Error del servidor'], 500);
        }
    }

    public function getCategories()
    {
        try {
            $startTime = microtime(true);
            
            $response = Http::timeout(5)->get('https://opentdb.com/api_category.php');

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['trivia_categories']) && is_array($data['trivia_categories'])) {
                    // Traducir directamente las categorías - son pocas
                    foreach ($data['trivia_categories'] as &$category) {
                        $category['name'] = $this->translationService->translate($category['name']);
                    }
                }
                
                $endTime = microtime(true);
                $executionTime = ($endTime - $startTime);
                Log::info("Tiempo de ejecución para obtener y traducir categorías: " . $executionTime . " segundos");

                return response()->json($data);
            }

            Log::error('OpenTDB Categories API error: ' . $response->body());
            return response()->json(['error' => 'Error al obtener categorías'], 500);
        } catch (\Exception $e) {
            Log::error('TriviaController categories error: ' . $e->getMessage());
            return response()->json(['error' => 'Error del servidor'], 500);
        }
    }
}