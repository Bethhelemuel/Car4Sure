<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The namespace for your API controllers.
     *
     * @var string
     */
    protected $namespace = 'App\\Http\\Controllers';

    public const HOME = '/home';

    public function boot(): void
    {
        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->namespace($this->namespace . '\Api') // 👈 This is the key line
                ->group(base_path('routes/api.php'));
        });
    }
}
