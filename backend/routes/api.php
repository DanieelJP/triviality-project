<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TriviaController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\GameController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas de trivia
Route::get('/trivia/questions', [TriviaController::class, 'getQuestions']);
Route::get('/trivia/categories', [TriviaController::class, 'getCategories']);
Route::get('/trivia/clear-translation-cache', [TriviaController::class, 'clearTranslationCache']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rutas de trivia
    Route::post('/trivia/save-results', [TriviaController::class, 'saveGameResults']);

    // Rutas de perfil y estadísticas
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::post('/profile/avatar', [UserProfileController::class, 'updateAvatar']);
    Route::post('/profile/experience', [UserProfileController::class, 'updateExperience']);

    // Rutas de tablero de clasificación
    Route::get('/leaderboard', [LeaderboardController::class, 'getRanking']);
    Route::get('/leaderboard/user', [LeaderboardController::class, 'getUserRanking']);
    Route::post('/leaderboard/score', [LeaderboardController::class, 'updateScore']);

    Route::post('/games', [GameController::class, 'store']);
});
