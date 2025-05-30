<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Interfaces\TranslationInterface;
use App\Services\TranslationCacheService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\Game;
use App\Models\GameAnswer;
use App\Services\LeaderboardService;

class TriviaController extends Controller
{
    private $baseUrl = 'https://opentdb.com/api.php';
    private $translationService;
    private $cacheService;
    private $leaderboardService;

    public function __construct(
        TranslationInterface $translationService, 
        TranslationCacheService $cacheService,
        LeaderboardService $leaderboardService
    ) {
        $this->translationService = $translationService;
        $this->cacheService = $cacheService;
        $this->leaderboardService = $leaderboardService;
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

    public function saveGameResults(Request $request)
    {
        try {
            Log::info('Iniciando guardado de resultados del juego');
            $user = Auth::user();
            
            if (!$user) {
                Log::error('Usuario no autenticado al intentar guardar resultados');
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }
            
            Log::info('Datos recibidos:', [
                'difficulty' => $request->difficulty,
                'category' => $request->category,
                'answers_count' => count($request->answers ?? []),
                'user_id' => $user->id
            ]);
            
            // Validar los datos de entrada
            $request->validate([
                'difficulty' => 'required|string|in:easy,medium,hard',
                'category' => 'required|string',
                'answers' => 'required|array',
                'answers.*.question' => 'required|string',
                'answers.*.given_answer' => 'required|string',
                'answers.*.correct_answer' => 'required|string',
                'answers.*.is_correct' => 'required|boolean',
                'answers.*.response_time' => 'required|numeric',
                'answers.*.points_earned' => 'required|integer'
            ]);

            Log::info('Validación de datos completada');

            try {
                // Crear el juego
                $game = Game::create([
                    'user_id' => $user->id,
                    'difficulty' => $request->difficulty,
                    'category' => $request->category,
                    'total_points' => collect($request->answers)->sum('points_earned'),
                    'total_questions' => count($request->answers),
                    'correct_answers' => collect($request->answers)->where('is_correct', true)->count(),
                    'avg_response_time' => collect($request->answers)->avg('response_time')
                ]);

                Log::info('Juego creado:', ['game_id' => $game->id]);

                // Guardar las respuestas
                foreach ($request->answers as $answer) {
                    GameAnswer::create([
                        'game_id' => $game->id,
                        'question' => $answer['question'],
                        'given_answer' => $answer['given_answer'],
                        'correct_answer' => $answer['correct_answer'],
                        'is_correct' => $answer['is_correct'],
                        'question_difficulty' => $request->difficulty,
                        'category' => $request->category,
                        'response_time' => $answer['response_time'],
                        'points_earned' => $answer['points_earned']
                    ]);
                }

                Log::info('Respuestas guardadas');

                // Actualizar puntuaciones en el tablero de clasificación
                $this->leaderboardService->updateScores(
                    $user,
                    $game->total_points,
                    $request->category
                );

                Log::info('Puntuaciones actualizadas en el tablero');

                // Calcular bonificaciones de experiencia
                $experienceGained = $game->total_points; // Base XP igual a los puntos ganados
                
                // Inicializar bonificaciones
                $streakBonus = 0;
                $quickBonus = 0;
                $difficultyBonus = 0;
                
                // Bonificación por racha de respuestas correctas
                $streak = 0;
                $maxStreak = 0;
                foreach ($request->answers as $answer) {
                    if ($answer['is_correct']) {
                        $streak++;
                        $maxStreak = max($maxStreak, $streak);
                    } else {
                        $streak = 0;
                    }
                }
                if ($maxStreak >= 3) {
                    $streakBonus = 30; // Bonificación fija de 30 XP por alcanzar una racha de 3 o más
                }

                // Bonificación por respuestas rápidas (menos de 5 segundos)
                $quickAnswers = array_filter($request->answers, function($answer) {
                    return $answer['is_correct'] && $answer['response_time'] < 5;
                });
                $quickBonus = count($quickAnswers) * 15; // 15 XP por respuesta rápida

                // Bonificación por dificultad
                $hardQuestions = array_filter($request->answers, function($answer) use ($request) {
                    return $answer['is_correct'] && $request->difficulty === 'hard';
                });
                $difficultyBonus = count($hardQuestions) * 20; // 20 XP extra por pregunta difícil

                // Sumar todas las bonificaciones a la experiencia base
                $experienceGained += $streakBonus + $quickBonus + $difficultyBonus;

                Log::info('Bonificaciones calculadas:', [
                    'streak' => $streakBonus,
                    'quick' => $quickBonus,
                    'difficulty' => $difficultyBonus,
                    'total' => $experienceGained
                ]);

                // Actualizar experiencia del usuario
                $user->experience_points += $experienceGained;
                
                // Nueva fórmula progresiva para calcular el nivel
                // Cada nivel requiere un 10% más de XP que el anterior
                $xpForLevel = function($level) {
                    return floor(1000 * pow(1.1, $level - 1));
                };
                
                // Calcular nuevo nivel
                $currentLevel = $user->level;
                $totalXP = $user->experience_points;
                
                while ($totalXP >= $xpForLevel($currentLevel + 1)) {
                    $currentLevel++;
                }
                
                if ($currentLevel != $user->level) {
                    $user->level = $currentLevel;
                    Log::info('Usuario subió de nivel:', [
                        'old_level' => $user->level,
                        'new_level' => $currentLevel
                    ]);
                }
                
                $user->save();
                Log::info('Experiencia del usuario actualizada');

                // Calcular XP para el siguiente nivel
                $nextLevelXP = $xpForLevel($user->level + 1);
                $currentLevelXP = $xpForLevel($user->level);
                $progress = floor(($totalXP - $currentLevelXP) / ($nextLevelXP - $currentLevelXP) * 100);

                $response = [
                    'message' => 'Partida guardada correctamente',
                    'game_id' => $game->id,
                    'total_points' => $game->total_points,
                    'experience_gained' => $experienceGained,
                    'bonuses' => [
                        'streak' => $streakBonus,
                        'quick' => $quickBonus,
                        'difficulty' => $difficultyBonus
                    ],
                    'new_level' => $user->level,
                    'experience_points' => $user->experience_points,
                    'next_level_xp' => $nextLevelXP,
                    'progress' => $progress
                ];

                Log::info('Respuesta preparada:', $response);
                return response()->json($response);

            } catch (\Exception $e) {
                Log::error('Error en la transacción de base de datos: ' . $e->getMessage());
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Error al guardar resultados del juego: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Error al guardar los resultados del juego: ' . $e->getMessage()
            ], 500);
        }
    }
}