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
     * Tampilkan halaman register
     */
    public function showRegister()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/Register');
    }

    /**
     * Proses register (otomatis membuat akun Admin)
     */
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name'  => 'nullable|string|max:50',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6|confirmed',
        ]);

        // Simpan user baru sebagai Admin
        User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => bcrypt($request->password),
            'is_admin'   => 1,          // Otomatis Admin
            'status'     => 'active',   // Otomatis Aktif
        ]);

        return redirect()->route('login')
            ->with('success', 'Registrasi berhasil. Silakan login.');
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
