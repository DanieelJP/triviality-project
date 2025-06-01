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
        
        return match ($period) {
            'daily' => $now->startOfDay(),
            'weekly' => $now->startOfWeek(),
            'monthly' => $now->startOfMonth(),
            default => Carbon::createFromTimestamp(0)
        };
    }

    /**
     * Obtiene el ranking para un período y categoría específicos
     */
    public function getRanking(string $period = 'all_time', ?string $category = null, int $limit = 10)
    {
        $query = User::select([
            'users.id',
            'users.name',
            'users.avatar',
            'users.level',
            DB::raw('COUNT(DISTINCT games.id) as total_games'),
            DB::raw('SUM(games.total_points) as score'),
            DB::raw('AVG(games.avg_response_time) as avg_response_time'),
            DB::raw('(SUM(games.correct_answers) * 100.0 / NULLIF(SUM(games.total_questions), 0)) as accuracy')
        ])
        ->leftJoin('games', 'users.id', '=', 'games.user_id');

        // Filtrar por período
        if ($period !== 'all_time') {
            $startDate = $this->getPeriodStartDate($period);
            $query->where('games.created_at', '>=', $startDate);
        }

        // Filtrar por categoría
        if ($category) {
            $query->where('games.category', $category);
        }

        $ranking = $query->groupBy('users.id', 'users.name', 'users.avatar', 'users.level')
            ->having('total_games', '>', 0)
            ->orderBy('score', 'desc')
            ->limit($limit)
            ->get();

        // Añadir el rank a cada usuario
        return $ranking->map(function ($user, $index) {
            $user->rank = $index + 1;
            return $user;
        });
    }

    /**
     * Obtiene la posición del usuario en el ranking
     */
    public function getUserRanking(User $user, string $period = 'all_time', ?string $category = null)
    {
        $query = User::select([
            'users.id',
            DB::raw('COUNT(DISTINCT games.id) as total_games'),
            DB::raw('SUM(games.total_points) as score'),
            DB::raw('AVG(games.avg_response_time) as avg_response_time'),
            DB::raw('(SUM(games.correct_answers) * 100.0 / NULLIF(SUM(games.total_questions), 0)) as accuracy')
        ])
        ->leftJoin('games', 'users.id', '=', 'games.user_id');

        if ($period !== 'all_time') {
            $startDate = $this->getPeriodStartDate($period);
            $query->where('games.created_at', '>=', $startDate);
        }

        if ($category) {
            $query->where('games.category', $category);
        }

        $userStats = $query->where('users.id', $user->id)
            ->groupBy('users.id')
            ->first();

        if (!$userStats || $userStats->total_games === 0) {
            return null;
        }

        // Calcular el rank del usuario
        $betterPlayers = User::select('users.id')
            ->leftJoin('games', 'users.id', '=', 'games.user_id')
            ->where(function ($query) use ($period, $category) {
                if ($period !== 'all_time') {
                    $startDate = $this->getPeriodStartDate($period);
                    $query->where('games.created_at', '>=', $startDate);
                }
                if ($category) {
                    $query->where('games.category', $category);
                }
            })
            ->groupBy('users.id')
            ->having(DB::raw('SUM(games.total_points)'), '>', $userStats->score)
            ->count();

        // Contar el total de jugadores
        $totalPlayers = User::select('users.id')
            ->leftJoin('games', 'users.id', '=', 'games.user_id')
            ->where(function ($query) use ($period, $category) {
                if ($period !== 'all_time') {
                    $startDate = $this->getPeriodStartDate($period);
                    $query->where('games.created_at', '>=', $startDate);
                }
                if ($category) {
                    $query->where('games.category', $category);
                }
            })
            ->groupBy('users.id')
            ->having(DB::raw('COUNT(DISTINCT games.id)'), '>', 0)
            ->count();

        return [
            'rank' => $betterPlayers + 1,
            'score' => $userStats->score,
            'total_games' => $userStats->total_games,
            'accuracy' => round($userStats->accuracy, 2),
            'avg_response_time' => round($userStats->avg_response_time, 2),
            'total_players' => $totalPlayers
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