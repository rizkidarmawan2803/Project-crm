<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadClient;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PelangganController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isAdmin = (int) $user->is_admin === 1;

        /*
        |--------------------------------------------------------------------------
        | Query Data Pelanggan
        |--------------------------------------------------------------------------
        */
        $query = LeadClient::with('sales')
            ->where('lead_status', 'Deal');

        // Jika bukan admin → hanya data milik sales tersebut
        if (!$isAdmin) {
            $query->where('sales_id', $user->id);
        }

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_client', 'like', '%' . $request->search . '%')
                    ->orWhere('company_name', 'like', '%' . $request->search . '%')
                    ->orWhere('phone', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Ambil Data
        |--------------------------------------------------------------------------
        */
        $clients = $query
            ->orderBy('created_at', 'desc')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Statistik
        |--------------------------------------------------------------------------
        */
        $summaryQuery = LeadClient::where('lead_status', 'Deal');

        if (!$isAdmin) {
            $summaryQuery->where('sales_id', $user->id);
        }

        $totalPelanggan = $summaryQuery->count();

        $pelangganAktif = $totalPelanggan;

        $prospekBerhasil = $totalPelanggan;

        $stats = [
            [
                'label'  => 'Total Pelanggan',
                'value'  => $totalPelanggan,
                'change' => '+12 vs bulan lalu',
                'trend'  => 'up',
                'icon'   => 'wallet',
                'color'  => 'blue',
            ],
            [
                'label'  => 'Pelanggan Aktif',
                'value'  => $pelangganAktif,
                'change' => '+3.2% vs bulan lalu',
                'trend'  => 'up',
                'icon'   => 'chart-bar',
                'color'  => 'green',
            ],
            [
                'label'  => 'Prospek Berhasil',
                'value'  => $prospekBerhasil,
                'change' => 'Stabil vs bulan lalu',
                'trend'  => 'stable',
                'icon'   => 'globe',
                'color'  => 'orange',
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Mapping Data
        |--------------------------------------------------------------------------
        */
        $colors = [
            'blue',
            'violet',
            'orange',
            'teal',
            'rose',
            'green',
            'gray',
        ];

        $pelanggan = $clients->map(function ($client) use ($colors) {

            $inisial = collect(explode(' ', $client->nama_client))
                ->filter()
                ->map(fn ($word) => strtoupper(substr($word, 0, 1)))
                ->take(2)
                ->implode('');

            if ($inisial === '') {
                $inisial = 'NA';
            }

            $avatarColor = $colors[$client->sales_id % count($colors)];

            return [
                'id' => $client->id,

                'perusahaan' => $client->company_name ?: $client->nama_client,

                'kontak' => $client->phone,

                'manager' => $client->sales
                    ? trim($client->sales->first_name . ' ' . $client->sales->last_name)
                    : '-',

                'inisial' => $inisial,

                'avatarColor' => $avatarColor,

                'tanggal' => Carbon::parse($client->created_at)
                    ->translatedFormat('d F Y'),

                'status' => 'Aktif',

                'nama_client' => $client->nama_client,
                'email' => $client->email,
                'company_name' => $client->company_name,
                'created_at' => $client->created_at,
            ];
        })->values();

        return response()->json([
            'status' => 'success',
            'stats' => $stats,
            'pelanggan' => $pelanggan,
            'totalPelanggan' => $totalPelanggan,
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();
        $isAdmin = (int) $user->is_admin === 1;

        $query = LeadClient::with([
            'sales',
            'communicationLogs.user',
            'reminders',
        ])
        ->where('lead_status', 'Deal');

        // Sales hanya boleh lihat miliknya sendiri
        if (!$isAdmin) {
            $query->where('sales_id', $user->id);
        }

        $client = $query->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $client,
        ]);
    }
}