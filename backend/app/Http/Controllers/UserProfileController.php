<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use App\Models\UserAchievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserProfileController extends Controller
{
    public function getProfile()
    {
        try {
            $user = Auth::user();
            
            $data = [
                'user' => [
                    'name' => $user->name,
                    'avatar' => $user->avatar,
                    'level' => $user->level,
                    'experience_points' => $user->experience_points,
                ],
                'stats' => [
                    'total_games' => 0,
                    'correct_answers' => 0,
                    'total_answers' => 0,
                    'accuracy_percentage' => 0,
                    'avg_response_time' => 0,
                    'total_points' => 0
                ],
                'difficulty_stats' => [
                    [
                        'question_difficulty' => 'easy',
                        'total_questions' => 0,
                        'correct_answers' => 0,
                        'accuracy_percentage' => 0
                    ],
                    [
                        'question_difficulty' => 'medium',
                        'total_questions' => 0,
                        'correct_answers' => 0,
                        'accuracy_percentage' => 0
                    ],
                    [
                        'question_difficulty' => 'hard',
                        'total_questions' => 0,
                        'correct_answers' => 0,
                        'accuracy_percentage' => 0
                    ]
                ],
                'category_stats' => [],
                'achievements' => [],
                'rankings' => [
                    [
                        'period' => 'daily',
                        'score' => 0,
                        'rank' => 0
                    ],
                    [
                        'period' => 'weekly',
                        'score' => 0,
                        'rank' => 0
                    ],
                    [
                        'period' => 'monthly',
                        'score' => 0,
                        'rank' => 0
                    ],
                    [
                        'period' => 'all_time',
                        'score' => 0,
                        'rank' => 0
                    ]
                ],
                'level_progress' => [
                    'current_level' => $user->level,
                    'current_xp' => $user->experience_points,
                    'next_level_xp' => $user->level * 1000,
                    'progress_percentage' => min(100, (($user->experience_points - (($user->level - 1) * 1000)) / (($user->level * 1000) - (($user->level - 1) * 1000))) * 100)
                ]
            ];

            return response()->json($data);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar el perfil: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateAvatar(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|string|max:255'
            ]);

            $user = Auth::user();
            $user->avatar = $request->avatar;
            $user->save();

            return response()->json(['message' => 'Avatar actualizado correctamente']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el avatar: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateExperience(Request $request)
    {
        try {
            $user = Auth::user();
            $oldLevel = $user->level;
            
            $user->experience_points += $request->points_earned;
            $newLevel = floor($user->experience_points / 1000) + 1;
            
            if ($newLevel != $user->level) {
                $user->level = $newLevel;
            }
            
            $user->save();
            
            return response()->json([
                'new_level' => $user->level,
                'experience_points' => $user->experience_points,
                'leveled_up' => $oldLevel < $user->level
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar la experiencia: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show()
    {
        $user = Auth::user();
        
        // Obtener estadísticas de juego
        $games = Game::where('user_id', $user->id)->get();
        
        $totalGames = $games->count();
        $totalPoints = $games->sum('total_points');
        $totalCorrectAnswers = $games->sum('correct_answers');
        $totalQuestions = $games->sum('total_questions');
        $avgResponseTime = $games->avg('avg_response_time');
        
        $accuracy = $totalQuestions > 0 ? ($totalCorrectAnswers / $totalQuestions) * 100 : 0;
        
        // Obtener logros
        $achievements = UserAchievement::where('user_id', $user->id)
            ->with('achievement')
            ->get()
            ->map(function ($userAchievement) {
                return [
                    'id' => $userAchievement->achievement->id,
                    'name' => $userAchievement->achievement->name,
                    'description' => $userAchievement->achievement->description,
                    'unlocked_at' => $userAchievement->created_at
                ];
            });

        // Calcular información de nivel y progreso
        $currentLevel = $user->level ?? 1;
        $currentXP = $user->experience_points ?? 0;
        $xpForNextLevel = $currentLevel * 1000;
        $xpForCurrentLevel = ($currentLevel - 1) * 1000;
        $progressPercentage = min(100, (($currentXP - $xpForCurrentLevel) / ($xpForNextLevel - $xpForCurrentLevel)) * 100);

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'level' => $currentLevel,
                'experience_points' => $currentXP,
                'avatar' => $user->avatar
            ],
            'stats' => [
                'total_games' => $totalGames,
                'total_points' => $totalPoints,
                'accuracy' => round($accuracy, 2),
                'avg_response_time' => round($avgResponseTime, 2),
                'achievements' => $achievements
            ],
            'level_progress' => [
                'current_level' => $currentLevel,
                'current_xp' => $currentXP,
                'next_level_xp' => $xpForNextLevel,
                'progress_percentage' => round($progressPercentage, 2)
            ]
        ]);
    }
} 