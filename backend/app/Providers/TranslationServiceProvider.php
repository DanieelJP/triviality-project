<?php

namespace App\Providers;

use App\Interfaces\TranslationInterface;
use App\Services\TextCleanerService;
use App\Services\TranslationCacheService;
use App\Services\TranslationServerService;
use App\Services\TranslationService;
use Illuminate\Support\ServiceProvider;

class TranslationServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Registrar servicios individuales
        $this->app->singleton(TextCleanerService::class);
        $this->app->singleton(TranslationCacheService::class);
        $this->app->singleton(TranslationServerService::class);
        
        // Registrar el servicio principal y vincularlo a su interfaz
        $this->app->singleton(TranslationService::class, function ($app) {
            return new TranslationService(
                $app->make(TextCleanerService::class),
                $app->make(TranslationServerService::class),
                $app->make(TranslationCacheService::class)
            );
        });

        $this->app->bind(TranslationInterface::class, TranslationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
