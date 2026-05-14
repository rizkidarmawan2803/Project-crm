<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LeadClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::get()->map(function ($user) {

            $totalClients = LeadClient::where('sales_id', $user->id)
                ->where('user_type', 'client')
                ->count();

            $totalLeads = LeadClient::where('sales_id', $user->id)
                ->where('user_type', 'lead')
                ->count();

            return [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'status' => $user->status,
                'total_clients' => $totalClients,
                'total_leads' => $totalLeads,
            ];
        });

        return response()->json([
            'total_staff' => User::count(),
            'total_sales' => User::where('is_admin', 0)->count(),
            'total_admin' => User::where('is_admin', 1)->count(),
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'is_admin' => 'required|boolean',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => $request->is_admin,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'User berhasil ditambahkan',
            'user' => $user
        ]);
    }
}