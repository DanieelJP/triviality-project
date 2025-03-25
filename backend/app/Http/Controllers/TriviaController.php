<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TriviaController extends Controller
{
    private $baseUrl = 'https://opentdb.com/api.php';

    public function getQuestions(Request $request)
    {
        try {
            $response = Http::get($this->baseUrl, [
                'amount' => $request->input('amount', 10),
                'difficulty' => $request->input('difficulty', 'medium'),
                'type' => 'multiple'
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Error al obtener preguntas'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getCategories()
    {
        try {
            $response = Http::get('https://opentdb.com/api_category.php');

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'Error al obtener categorías'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
} 