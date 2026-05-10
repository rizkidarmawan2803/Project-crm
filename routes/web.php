<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/login', function () {
    return view('auth.login');
})->name('login');
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
