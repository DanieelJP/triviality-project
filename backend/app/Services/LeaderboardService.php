<?php

namespace App\Services;

use App\Models\Leaderboard;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LeaderboardService
{
    /**
     * Actualiza las puntuaciones del usuario en el tablero de clasificación
     */
    public function updateScores(User $user, int $points, ?string $category = null)
    {
        $periods = ['daily', 'weekly', 'monthly', 'all_time'];
        
        foreach ($periods as $period) {
            $this->updatePeriodScore($user->id, $points, $period, $category);
        }
    }

    /**
     * Actualiza la puntuación para un período específico
     */
    private function updatePeriodScore(int $userId, int $points, string $period, ?string $category)
    {
        $startDate = $this->getPeriodStartDate($period);
        
        DB::transaction(function () use ($userId, $points, $period, $category, $startDate) {
            $leaderboard = Leaderboard::where('user_id', $userId)
                ->where('period', $period)
                ->where('category', $category)
                ->where('updated_at', '>=', $startDate)
                ->first();

            if (!$leaderboard) {
                Leaderboard::create([
                    'user_id' => $userId,
                    'score' => $points,
                    'period' => $period,
                    'category' => $category
                ]);
            } else {
                $leaderboard->score += $points;
                $leaderboard->save();
            }
        });
    }

    /**
     * Obtiene la fecha de inicio para un período
     */
    private function getPeriodStartDate(string $period): Carbon
    {
        $now = Carbon::now();
        
        switch ($period) {
            case 'daily':
                return $now->startOfDay();
            case 'weekly':
                return $now->startOfWeek();
            case 'monthly':
                return $now->startOfMonth();
            default: // all_time
                return Carbon::createFromTimestamp(0);
        }
    }

    /**
     * Obtiene el ranking para un período y categoría específicos
     */
    public function getRanking(string $period, ?string $category = null, int $limit = 10)
    {
        $startDate = $this->getPeriodStartDate($period);
        
        return DB::table('leaderboards')
            ->join('users', 'leaderboards.user_id', '=', 'users.id')
            ->where('leaderboards.period', $period)
            ->where('leaderboards.category', $category)
            ->where('leaderboards.updated_at', '>=', $startDate)
            ->select(
                'users.name',
                'users.avatar',
                'leaderboards.score',
                DB::raw('RANK() OVER (ORDER BY leaderboards.score DESC) as rank')
            )
            ->orderBy('leaderboards.score', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Obtiene la posición del usuario en el ranking
     */
    public function getUserRanking(User $user, string $period, ?string $category = null)
    {
        $startDate = $this->getPeriodStartDate($period);
        
        $userScore = Leaderboard::where('user_id', $user->id)
            ->where('period', $period)
            ->where('category', $category)
            ->where('updated_at', '>=', $startDate)
            ->first();

        if (!$userScore) {
            return null;
        }

        $rank = DB::table('leaderboards')
            ->where('period', $period)
            ->where('category', $category)
            ->where('updated_at', '>=', $startDate)
            ->where('score', '>', $userScore->score)
            ->count() + 1;

        return [
            'rank' => $rank,
            'score' => $userScore->score,
            'total_players' => Leaderboard::where('period', $period)
                ->where('category', $category)
                ->where('updated_at', '>=', $startDate)
                ->count()
        ];
    }

    /**
     * Limpia las entradas antiguas del tablero de clasificación
     */
    public function cleanupOldEntries()
    {
        // Mantener solo el último mes para entradas diarias
        Leaderboard::where('period', 'daily')
            ->where('updated_at', '<', Carbon::now()->subMonth())
            ->delete();

        // Mantener solo los últimos 3 meses para entradas semanales
        Leaderboard::where('period', 'weekly')
            ->where('updated_at', '<', Carbon::now()->subMonths(3))
            ->delete();

        // Mantener solo el último año para entradas mensuales
        Leaderboard::where('period', 'monthly')
            ->where('updated_at', '<', Carbon::now()->subYear())
            ->delete();
    }
} 