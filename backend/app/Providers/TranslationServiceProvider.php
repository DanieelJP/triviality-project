<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\TranslationService;

class TranslationServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(TranslationService::class, function ($app) {
            return new TranslationService();
        });
    }

    public function boot()
    {
        //
    }
}
