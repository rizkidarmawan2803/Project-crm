<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ManajemenPenggunaController;
use App\Http\Controllers\ProspekController;
use App\Http\Controllers\PelangganController;

// ─── AUTH (belum login) ───────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// ─── PROTECTED (sudah login) ──────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/prospek', [ProspekController::class, 'index'])->name('prospek');
    Route::get('/pelanggan', [PelangganController::class, 'index'])->name('pelanggan');
    Route::get('/pengguna', [ManajemenPenggunaController::class, 'index'])->name('pengguna');
});