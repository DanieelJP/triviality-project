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
        Schema::dropIfExists('leaderboards');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('leaderboards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('period');
            $table->string('category')->nullable();
            $table->integer('score')->default(0);
            $table->integer('rank')->default(0);
            $table->timestamps();

            $table->index(['period', 'category']);
            $table->index('score');
            $table->index('rank');
        });
    }
};
