<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'question',
        'given_answer',
        'correct_answer',
        'is_correct',
        'question_difficulty',
        'category',
        'response_time',
        'points_earned'
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
} 