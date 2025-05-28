<?php

namespace App\Http\Controllers;

use App\Services\LeaderboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaderboardController extends Controller
{
    private $leaderboardService;

    public function __construct(LeaderboardService $leaderboardService)
    {
        $this->leaderboardService = $leaderboardService;
    }

    /**
     * Obtiene el ranking general o por categoría
     */
    public function getRanking(Request $request)
    {
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,all_time',
            'category' => 'nullable|string',
            'limit' => 'nullable|integer|min:1|max:100'
        ]);

        $period = $request->input('period');
        $category = $request->input('category');
        $limit = $request->input('limit', 10);

        $ranking = $this->leaderboardService->getRanking($period, $category, $limit);
        $userRanking = $this->leaderboardService->getUserRanking(Auth::user(), $period, $category);

        return response()->json([
            'ranking' => $ranking,
            'user_ranking' => $userRanking
        ]);
    }

    /**
     * Obtiene el ranking del usuario actual
     */
    public function getUserRanking(Request $request)
    {
        $request->validate([
            'period' => 'required|in:daily,weekly,monthly,all_time',
            'category' => 'nullable|string'
        ]);

        $period = $request->input('period');
        $category = $request->input('category');

        $ranking = $this->leaderboardService->getUserRanking(Auth::user(), $period, $category);

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