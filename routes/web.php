<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia; // <-- Pastikan baris ini ada

Route::get('/login', function () {
    // Ubah baris di bawah ini agar memuat komponen React
    return Inertia::render('Auth/Login'); 
})->name('login');

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');