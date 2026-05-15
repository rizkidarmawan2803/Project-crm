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

            // Total pelanggan = lead yang sudah Deal
            $totalPelanggan = LeadClient::where('sales_id', $user->id)
                ->where('lead_status', 'Deal')
                ->count();

            // Total leads aktif = yang belum Deal atau Ditolak
            $totalLeads = LeadClient::where('sales_id', $user->id)
                ->whereNotIn('lead_status', ['Deal', 'Ditolak'])
                ->count();

            return [
                'id'               => $user->id,
                'first_name'       => $user->first_name,
                'last_name'        => $user->last_name,
                'email'            => $user->email,
                'is_admin'         => $user->is_admin,
                'status'           => $user->status,
                'total_pelanggan'  => $totalPelanggan,  // sudah Deal
                'total_leads'      => $totalLeads,       // masih proses
            ];
        });

        return response()->json([
            'status'      => 'success',
            'total_staff' => User::count(),
            'total_sales' => User::where('is_admin', 0)->count(),
            'total_admin' => User::where('is_admin', 1)->count(),
            'users'       => $users
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name'  => 'nullable|string|max:50',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6',
            'is_admin'   => 'required|boolean',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'is_admin'   => $request->is_admin,
            'status'     => 'active',
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil ditambahkan',
            'user'    => $user
        ], 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);

        $totalLeads = LeadClient::where('sales_id', $user->id)->count();

        return response()->json([
            'status' => 'success',
            'user'   => array_merge($user->toArray(), [
                'total_leads' => $totalLeads,
            ])
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name'  => 'nullable|string|max:50',
            'email'      => 'required|email|unique:users,email,' . $id,
            'is_admin'   => 'required|boolean',
            'status'     => 'required|in:active,inactive',
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'is_admin'   => $request->is_admin,
            'status'     => $request->status,
        ]);

        if ($request->password) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil diupdate',
            'user'    => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil dihapus'
        ]);
    }
}
