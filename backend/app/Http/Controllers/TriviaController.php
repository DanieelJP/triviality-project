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
            $response = Http::timeout(5)->get($this->baseUrl, [
                'amount' => $request->input('amount', 10),
                'difficulty' => $request->input('difficulty', 'medium'),
                'type' => 'multiple'
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['results']) && is_array($data['results'])) {
                    // Translate questions
                    $data['results'] = array_map(function ($question) {
                        return $this->translationService->translateQuestion($question);
                    }, $data['results']);
                }

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
            $response = Http::timeout(5)->get('https://opentdb.com/api_category.php');

            if ($response->successful()) {
                $data = $response->json();
                
                if (isset($data['trivia_categories']) && is_array($data['trivia_categories'])) {
                    // Translate categories
                    $data['trivia_categories'] = array_map(function ($category) {
                        return [
                            'id' => $category['id'],
                            'name' => $this->translationService->translate($category['name'])
                        ];
                    }, $data['trivia_categories']);
                }

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