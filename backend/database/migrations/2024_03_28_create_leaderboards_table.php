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
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->string('period'); // daily, weekly, monthly, all_time
            $table->string('category')->nullable();
            $table->timestamps();

            // Índices para mejorar el rendimiento de las consultas
            $table->index(['period', 'category', 'score']);
            $table->index(['user_id', 'period', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderboards');
    }
}; 