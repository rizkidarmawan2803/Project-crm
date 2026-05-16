<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ManajemenPenggunaController;
use App\Http\Controllers\ProspekController;
use App\Http\Controllers\PelangganController;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadClientController;
use App\Http\Controllers\Api\AktivitasController;


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

    Route::prefix('api')->group(function(){
        // ==============================
// USERS
// ==============================
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);


// ==============================
// DASHBOARD
// ==============================
Route::get('/dashboard', [App\Http\Controllers\Api\DashboardController::class, 'index']);


// ==============================
// PROSPEK / LEAD CLIENTS
// ==============================
Route::get('/prospek', [LeadClientController::class, 'index']);
Route::post('/prospek', [LeadClientController::class, 'store']);
Route::get('/prospek/{id}', [LeadClientController::class, 'show']);
Route::put('/prospek/{id}', [LeadClientController::class, 'update']);
Route::delete('/prospek/{id}', [LeadClientController::class, 'destroy']);

// Konversi prospek menjadi pelanggan
Route::put('/prospek/{id}/convert', [LeadClientController::class, 'convertToClient']);


// ==============================
// PELANGGAN
// ==============================

// Semua pelanggan
Route::get('/pelanggan', [App\Http\Controllers\Api\PelangganController::class, 'index']);

// Detail pelanggan
Route::get('/pelanggan/{id}', [App\Http\Controllers\Api\PelangganController::class, 'show']);


// ==============================
// RIWAYAT KOMUNIKASI / AKTIVITAS
// ==============================

// Menampilkan semua aktivitas berdasarkan lead_client_id
Route::get('/aktivitas/{leadClientId}', [AktivitasController::class, 'index']);

// Menambahkan aktivitas baru
Route::post('/aktivitas', [AktivitasController::class, 'store']);
    });
});