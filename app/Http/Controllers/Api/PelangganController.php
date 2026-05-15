<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadClient;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PelangganController extends Controller
{
    /**
     * GET /api/pelanggan
     * Menampilkan seluruh data pelanggan
     * (data dari tabel lead_clients dengan lead_status = 'Deal')
     */
    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Query Data Pelanggan
        |--------------------------------------------------------------------------
        */
        $query = LeadClient::with('sales')
            ->where('lead_status', 'Deal');

        /*
        |--------------------------------------------------------------------------
        | Pencarian (opsional)
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
        | Statistik Dashboard
        |--------------------------------------------------------------------------
        */
        $totalPelanggan = $clients->count();

        // Untuk sementara seluruh pelanggan dianggap aktif
        $pelangganAktif = $totalPelanggan;

        // Jumlah prospek yang berhasil dikonversi menjadi pelanggan
        $prospekBerhasil = LeadClient::where('lead_status', 'Deal')->count();

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
        | Mapping Data untuk React (Pelanggan.jsx)
        |--------------------------------------------------------------------------
        | Kolom "Account Manager Assigned" akan menampilkan nama pelanggan
        | (nama_client), bukan nama PIC/Sales.
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
            // Inisial dari nama pelanggan
            $inisial = collect(explode(' ', $client->nama_client))
                ->filter()
                ->map(fn ($word) => strtoupper(substr($word, 0, 1)))
                ->take(2)
                ->implode('');

            if ($inisial === '') {
                $inisial = 'NA';
            }

            // Warna avatar berdasarkan sales_id
            $avatarColor = $colors[$client->sales_id % count($colors)];

            return [
                'id' => $client->id,

                // Nama perusahaan (jika kosong gunakan nama pelanggan)
                'perusahaan' => $client->company_name ?: $client->nama_client,

                // Nomor kontak
                'kontak' => $client->phone,

                // Kolom "Account Manager Assigned"
                // Menampilkan nama pelanggan
                'manager' => $client->nama_client,

                // Inisial nama pelanggan
                'inisial' => $inisial,

                // Warna avatar
                'avatarColor' => $avatarColor,

                // Tanggal bergabung
                'tanggal' => Carbon::parse($client->created_at)
                    ->translatedFormat('d F Y'),

                // Status akun
                'status' => 'Aktif',

                /*
                | Data tambahan
                */
                'nama_client' => $client->nama_client,
                'email' => $client->email,
                'company_name' => $client->company_name,
                'created_at' => $client->created_at,
            ];
        })->values();

        /*
        |--------------------------------------------------------------------------
        | Response JSON
        |--------------------------------------------------------------------------
        */
        return response()->json([
            'status' => 'success',
            'stats' => $stats,
            'pelanggan' => $pelanggan,
            'totalPelanggan' => $totalPelanggan,
        ]);
    }

    /**
     * GET /api/pelanggan/{id}
     * Menampilkan detail pelanggan
     */
    public function show($id)
    {
        $client = LeadClient::with([
            'sales',
            'communicationLogs.user',
            'reminders',
        ])
            ->where('lead_status', 'Deal')
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $client,
        ]);
    }
}