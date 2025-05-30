<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('achievement_type');
            $table->string('title');
            $table->text('description');
            $table->string('icon');
            $table->timestamp('unlocked_at')->useCurrent();
            $table->timestamps();

            // Índice único para evitar duplicados del mismo tipo de logro por usuario
            $table->unique(['user_id', 'achievement_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
    }
};
