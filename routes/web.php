<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ManajemenPenggunaController;
use App\Http\Controllers\ProspekController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\Api\StatusLogController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadClientController;
use App\Http\Controllers\Api\AktivitasController;
use App\Http\Controllers\Api\DealController;

// ─── AUTH (belum login) ───────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',     [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login',    [AuthController::class, 'login']);
});


// ─── PROTECTED (sudah login) ──────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/prospek', [ProspekController::class, 'index'])->name('prospek');
    Route::get('/pelanggan', [PelangganController::class, 'index'])->name('pelanggan');
    Route::get('/pelanggan/{id}', [PelangganController::class, 'show'])->name('pelanggan.show');


    Route::prefix('api')->group(function () {

        // ==============================
        // USERS
        // ==============================
        Route::get('/users',        [UserController::class, 'index']);
        Route::post('/users',       [UserController::class, 'store']);
        Route::get('/users/{id}',   [UserController::class, 'show']);
        Route::put('/users/{id}',   [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // ==============================
        // DASHBOARD
        // ==============================
        Route::get('/dashboard',                        [App\Http\Controllers\Api\DashboardController::class, 'index']);
        Route::get('/dashboard/statistik-prospek',      [App\Http\Controllers\Api\DashboardController::class, 'statistikProspek']);
        Route::get('/dashboard/ranking-sales',          [App\Http\Controllers\Api\DashboardController::class, 'rankingSales']);
        Route::get('/dashboard/detail-sales/{id}',      [App\Http\Controllers\Api\DashboardController::class, 'detailSales']);

        // ==============================
        // STATUS LOG
        // ==============================
        Route::get('/prospek/{id}/status-logs',  [StatusLogController::class, 'index']);
        Route::post('/prospek/{id}/status-logs', [StatusLogController::class, 'store']);


        // ==============================
        // PROSPEK / LEAD CLIENTS
        // ==============================
        Route::get('/prospek/search-sales', [LeadClientController::class, 'searchSales']);
        Route::get('/prospek/export/csv',       [LeadClientController::class, 'exportCsv']); // ← harus SEBELUM /{id}
        Route::get('/prospek/export/excel',     [LeadClientController::class, 'exportExcel']); // ← harus SEBELUM /{id}
        Route::get('/prospek',                  [LeadClientController::class, 'index']);
        Route::post('/prospek',                 [LeadClientController::class, 'store']);
        Route::get('/prospek/{id}',             [LeadClientController::class, 'show']);
        Route::put('/prospek/{id}',             [LeadClientController::class, 'update']);
        Route::delete('/prospek/{id}',          [LeadClientController::class, 'destroy']);
        Route::put('/prospek/{id}/convert',     [LeadClientController::class, 'convertToClient']);

        // ==============================
        // PELANGGAN
        // ==============================
        Route::get('/pelanggan',      [App\Http\Controllers\Api\PelangganController::class, 'index']);
        Route::get('/pelanggan/{id}', [App\Http\Controllers\Api\PelangganController::class, 'show']);

        // ==============================
        // RIWAYAT KOMUNIKASI / AKTIVITAS
        // ==============================
        Route::get('/aktivitas/{leadClientId}', [AktivitasController::class, 'index']);
        Route::post('/aktivitas',               [AktivitasController::class, 'store']);

        // ==============================
        // DEALS
        // ==============================
        Route::get('/deals',                [DealController::class, 'index']);
        Route::post('/deals',               [DealController::class, 'store']);
        Route::delete('/deals/{id}',        [DealController::class, 'destroy']);
        Route::put('/deals/{id}/status',    [DealController::class, 'updateStatus']);
    });
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/pengguna', [ManajemenPenggunaController::class, 'index'])->name('pengguna');
});
