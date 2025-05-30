<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserAchievement;
use App\Models\GameAnswer;
use Illuminate\Support\Facades\DB;

class AchievementService
{
    /**
     * Verifica y otorga logros basados en las estadísticas del usuario
     */
    public function checkAchievements(User $user)
    {
        $this->checkGameCountAchievements($user);
        $this->checkAccuracyAchievements($user);
        $this->checkCategoryMasteryAchievements($user);
        $this->checkDifficultyAchievements($user);
        $this->checkSpeedAchievements($user);
    }

    /**
     * Verifica logros basados en número de partidas jugadas
     */
    private function checkGameCountAchievements(User $user)
    {
        $gamesPlayed = $user->games_played;

        $milestones = [
            1 => ['Principiante', '¡Has jugado tu primera partida!', 'achievement_first_game'],
            10 => ['Aficionado', 'Has jugado 10 partidas', 'achievement_10_games'],
            50 => ['Entusiasta', 'Has jugado 50 partidas', 'achievement_50_games'],
            100 => ['Veterano', 'Has jugado 100 partidas', 'achievement_100_games'],
            500 => ['Experto', 'Has jugado 500 partidas', 'achievement_500_games'],
            1000 => ['Maestro', 'Has jugado 1000 partidas', 'achievement_1000_games'],
        ];

        foreach ($milestones as $count => $achievement) {
            if ($gamesPlayed >= $count) {
                $this->createAchievement($user->id, 'games_played', $achievement[0], $achievement[1], $achievement[2]);
            }
        }
    }

    /**
     * Verifica logros basados en precisión de respuestas
     */
    private function checkAccuracyAchievements(User $user)
    {
        $accuracy = DB::table('game_answers')
            ->join('games', 'game_answers.game_id', '=', 'games.id')
            ->where('games.user_id', $user->id)
            ->where('games.id', '>', DB::raw('games.id - 10')) // Últimas 10 partidas
            ->select(DB::raw('AVG(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) * 100 as accuracy'))
            ->first()
            ->accuracy;

        $milestones = [
            70 => ['Preciso', 'Alcanzaste 70% de precisión en tus últimas 10 partidas', 'achievement_accuracy_70'],
            80 => ['Muy Preciso', 'Alcanzaste 80% de precisión en tus últimas 10 partidas', 'achievement_accuracy_80'],
            90 => ['Experto en Precisión', 'Alcanzaste 90% de precisión en tus últimas 10 partidas', 'achievement_accuracy_90'],
            100 => ['¡Perfección!', 'Alcanzaste 100% de precisión en tus últimas 10 partidas', 'achievement_accuracy_100'],
        ];

        foreach ($milestones as $percentage => $achievement) {
            if ($accuracy >= $percentage) {
                $this->createAchievement($user->id, 'accuracy', $achievement[0], $achievement[1], $achievement[2]);
            }
        }
    }

    /**
     * Verifica logros basados en dominio de categorías
     */
    private function checkCategoryMasteryAchievements(User $user)
    {
        $categoryStats = DB::table('game_answers')
            ->join('games', 'game_answers.game_id', '=', 'games.id')
            ->where('games.user_id', $user->id)
            ->groupBy('category')
            ->having(DB::raw('COUNT(*)'), '>=', 10)
            ->having(DB::raw('AVG(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END)'), '>=', 0.8)
            ->select('category')
            ->get();

        foreach ($categoryStats as $stat) {
            $this->createAchievement(
                $user->id,
                'category_mastery',
                "Maestro de {$stat->category}",
                "Has dominado la categoría {$stat->category} con más de 80% de precisión",
                "achievement_category_{$stat->category}"
            );
        }
    }

    /**
     * Verifica logros basados en dificultad
     */
    private function checkDifficultyAchievements(User $user)
    {
        $difficulties = ['easy', 'medium', 'hard'];
        
        foreach ($difficulties as $difficulty) {
            $perfectStreak = DB::table('game_answers')
                ->join('games', 'game_answers.game_id', '=', 'games.id')
                ->where('games.user_id', $user->id)
                ->where('question_difficulty', $difficulty)
                ->orderBy('game_answers.id', 'desc')
                ->limit(5)
                ->get()
                ->every(function ($answer) {
                    return $answer->is_correct;
                });

            if ($perfectStreak) {
                $difficultyName = [
                    'easy' => 'fácil',
                    'medium' => 'media',
                    'hard' => 'difícil'
                ][$difficulty];

                $this->createAchievement(
                    $user->id,
                    'difficulty_mastery',
                    "Dominador {$difficultyName}",
                    "Has respondido correctamente 5 preguntas seguidas en dificultad {$difficultyName}",
                    "achievement_difficulty_{$difficulty}"
                );
            }
        }
    }

    /**
     * Verifica logros basados en velocidad de respuesta
     */
    private function checkSpeedAchievements(User $user)
    {
        $avgSpeed = DB::table('game_answers')
            ->join('games', 'game_answers.game_id', '=', 'games.id')
            ->where('games.user_id', $user->id)
            ->where('is_correct', 1)
            ->avg('response_time');

        $speedMilestones = [
            5 => ['Velocista', 'Respondiste correctamente con un promedio menor a 5 segundos', 'achievement_speed_5'],
            3 => ['Rayo', 'Respondiste correctamente con un promedio menor a 3 segundos', 'achievement_speed_3'],
        ];

        foreach ($speedMilestones as $seconds => $achievement) {
            if ($avgSpeed <= $seconds) {
                $this->createAchievement($user->id, 'speed', $achievement[0], $achievement[1], $achievement[2]);
            }
        }
    }

    /**
     * Crea un logro si no existe
     */
    private function createAchievement($userId, $type, $title, $description, $icon)
    {
        UserAchievement::firstOrCreate(
            [
                'user_id' => $userId,
                'achievement_type' => $type,
                'title' => $title
            ],
            [
                'description' => $description,
                'icon' => $icon
            ]
        );
    }
} 