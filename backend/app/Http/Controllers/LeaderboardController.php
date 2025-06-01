<?php

namespace App\Http\Controllers;

use App\Services\LeaderboardService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    protected LeaderboardService $leaderboardService;

    public function __construct(LeaderboardService $leaderboardService)
    {
        $this->leaderboardService = $leaderboardService;
    }

    /**
     * Obtiene el ranking general o por categoría
     */
    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', 'all_time');
        $category = $request->query('category');
        $limit = $request->query('limit', 10);

        $ranking = $this->leaderboardService->getRanking($period, $category, $limit);

        return response()->json($ranking);
    }

    /**
     * Obtiene la posición del usuario autenticado en el ranking
     */
    public function userRanking(Request $request): JsonResponse
    {
        $period = $request->query('period', 'all_time');
        $category = $request->query('category');
        
        $ranking = $this->leaderboardService->getUserRanking(
            $request->user(),
            $period,
            $category
        );

        if (!$ranking) {
            return response()->json([
                'message' => 'No ranking data available for this user'
            ], 404);
        }

        return response()->json($ranking);
    }

    /**
     * Actualiza la puntuación del usuario
     */
    public function updateScore(Request $request)
    {
        $request->validate([
            'points' => 'required|integer',
            'category' => 'nullable|string'
        ]);

        $this->leaderboardService->updateScores(
            Auth::user(),
            $request->input('points'),
            $request->input('category')
        );

        return response()->json(['message' => 'Puntuación actualizada correctamente']);
    }
} 