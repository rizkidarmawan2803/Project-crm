<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Tampilkan halaman login
     */
    public function showLogin()
    {
        if (Auth::check()) {
            // Redirect sesuai role
            if (Auth::user()->is_admin) {
                return redirect()->route('dashboard');
            } else {
                return redirect()->route('prospek');
            }
        }

        return Inertia::render('Auth/Login');
    }

    /**
     * Proses login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return back()->withErrors([
                'email' => 'Email atau password salah.',
            ]);
        }

        $user = Auth::user();

        if ($user->status === 'inactive') {
            Auth::logout();
            return back()->withErrors([
                'email' => 'Akun anda tidak aktif.',
            ]);
        }

        $request->session()->regenerate();

        // ← Redirect berdasarkan role
        if ($user->is_admin) {
            return redirect()->route('dashboard');
        } else {
            return redirect()->route('prospek');
        }
    }


    /**
     * Proses logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
