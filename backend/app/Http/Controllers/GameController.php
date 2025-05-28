<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'difficulty' => 'required|string',
            'category' => 'required|string',
            'answers' => 'required|array|min:1',
            'answers.*.question' => 'required|string',
            'answers.*.given_answer' => 'required|string',
            'answers.*.correct_answer' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
            'answers.*.response_time' => 'required|numeric',
            'answers.*.points_earned' => 'required|integer'
        ]);

        try {
            DB::beginTransaction();

            $answers = $request->input('answers');
            
            // Calcular estadísticas del juego
            $totalPoints = collect($answers)->sum('points_earned');
            $totalQuestions = count($answers);
            $correctAnswers = collect($answers)->where('is_correct', true)->count();
            $avgResponseTime = collect($answers)->average('response_time');

            // Crear el juego
            $game = Game::create([
                'user_id' => Auth::id(),
                'difficulty' => $request->input('difficulty'),
                'category' => $request->input('category'),
                'total_points' => $totalPoints,
                'total_questions' => $totalQuestions,
                'correct_answers' => $correctAnswers,
                'avg_response_time' => $avgResponseTime
            ]);

            // Guardar las respuestas
            foreach ($answers as $answer) {
                GameAnswer::create([
                    'game_id' => $game->id,
                    'question' => $answer['question'],
                    'given_answer' => $answer['given_answer'],
                    'correct_answer' => $answer['correct_answer'],
                    'is_correct' => $answer['is_correct'],
                    'question_difficulty' => $request->input('difficulty'),
                    'category' => $request->input('category'),
                    'response_time' => $answer['response_time'],
                    'points_earned' => $answer['points_earned']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Game results saved successfully',
                'game' => $game
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error saving game results',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 