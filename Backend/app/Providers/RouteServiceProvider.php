<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is automatically applied to your controller routes.
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Called during bootstrapping to map all routes.
     */
    public function boot()
    {
        parent::boot();
    }

    /**
     * Register the route groups for the application.
     */
    public function map()
    {
        $this->mapApiRoutes();
       # $this->mapWebRoutes();
    }

    /**
     * API routes for `/api/*` 
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->namespace($this->namespace . '\Api') // Optional: If you put API controllers in App\Http\Controllers\Api
            ->group(base_path('routes/api.php'));
    }

    /**
     * Web routes for the browser-based pages
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }
}
