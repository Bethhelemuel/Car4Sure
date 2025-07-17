<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Always return null for API routes to prevent redirects
        if ($request->is('api/*') || 
            $request->expectsJson() || 
            $request->header('Accept') === 'application/json' ||
            $request->header('Content-Type') === 'application/json' ||
            $request->isMethod('post') && $request->is('api/*')) {
            return null;
        }
        
        return route('login');
    }
} 