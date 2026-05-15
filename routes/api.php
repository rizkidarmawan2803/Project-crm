<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeadClientController;
use App\Http\Controllers\Api\AktivitasController;

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
Route::get('/dashboard', [DashboardController::class, 'index']);

// ==============================
// PROSPEK / LEAD CLIENTS
// ==============================
Route::get('/prospek', [LeadClientController::class, 'index']);
Route::post('/prospek', [LeadClientController::class, 'store']);
Route::get('/prospek/{id}', [LeadClientController::class, 'show']);
Route::put('/prospek/{id}', [LeadClientController::class, 'update']);
Route::delete('/prospek/{id}', [LeadClientController::class, 'destroy']);

// Konversi prospek menjadi client
Route::put('/prospek/{id}/convert', [LeadClientController::class, 'convertToClient']);

// ==============================
// RIWAYAT KOMUNIKASI / AKTIVITAS
// ==============================

// Menampilkan semua aktivitas berdasarkan lead_client_id
Route::get('/aktivitas/{leadClientId}', [AktivitasController::class, 'index']);

// Menambahkan aktivitas baru
Route::post('/aktivitas', [AktivitasController::class, 'store']);

