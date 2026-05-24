<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !auth()->user()->is_admin) {
            // Sales yang coba akses halaman admin
            // diarahkan ke prospek
            return redirect()->route('prospek');
        }

        return $next($request);
    }
}