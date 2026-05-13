<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProspekController;
use App\Http\Controllers\PelangganController;
use Inertia\Inertia;

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/prospek', [ProspekController::class, 'index'])->name('prospek');

Route::get('/pelanggan', [PelangganController::class, 'index'])->name('pelanggan');
