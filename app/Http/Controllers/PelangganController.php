<?php

namespace App\Http\Controllers;

use App\Models\LeadClient;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class PelangganController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | HALAMAN INDEX PELANGGAN
    |--------------------------------------------------------------------------
    */
    public function index(): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Ambil pelanggan
        |--------------------------------------------------------------------------
        | Pelanggan = prospek dengan status Deal
        */
        $userId = auth()->user()->id;

        $clients = LeadClient::with('sales')
            ->where('sales_id', $userId)
            ->where('lead_status', 'Deal')
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Statistik
        |--------------------------------------------------------------------------
        */
        $summary = [
            'total'   => $clients->count(),
            'aktif'   => $clients->count(),
            'berhasil' => LeadClient::where('sales_id', $userId)
                ->where('lead_status', 'Deal')
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Warna avatar
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

        /*
        |--------------------------------------------------------------------------
        | Format data pelanggan
        |--------------------------------------------------------------------------
        */
        $pelanggan = $clients->map(function ($client) use ($colors) {

            $displayName = $client->nama_client ?: 'Tidak Ada';

            /*
            |--------------------------------------------------------------------------
            | Inisial
            |--------------------------------------------------------------------------
            */
            $inisial = collect(explode(' ', $displayName))
                ->filter()
                ->map(fn($word) => strtoupper(substr($word, 0, 1)))
                ->take(2)
                ->implode('');

            $inisial = $inisial ?: 'NA';

            /*
            |--------------------------------------------------------------------------
            | Avatar color
            |--------------------------------------------------------------------------
            */
            $salesId = $client->sales_id ?? 0;

            $avatarColor = $colors[$salesId % count($colors)];

            return [

                /*
                |--------------------------------------------------------------------------
                | IDENTITAS
                |--------------------------------------------------------------------------
                */
                'id' => $client->id,

                'nama_client' => $client->nama_client,

                'company_name' => $client->company_name,

                'perusahaan' => $client->company_name
                    ?: $client->nama_client,

                /*
                |--------------------------------------------------------------------------
                | KONTAK
                |--------------------------------------------------------------------------
                */
                'kontak' => $client->phone,

                'phone' => $client->phone,

                'email' => $client->email,

                /*
                |--------------------------------------------------------------------------
                | ACCOUNT MANAGER
                |--------------------------------------------------------------------------
                */
                'manager' => $displayName,

                'inisial' => $inisial,

                'avatarColor' => $avatarColor,

                /*
                |--------------------------------------------------------------------------
                | SALES PIC
                |--------------------------------------------------------------------------
                */
                'sales' => [
                    'id' => $client->sales?->id,
                    'name' => $client->sales?->name,
                ],

                /*
                |--------------------------------------------------------------------------
                | STATUS
                |--------------------------------------------------------------------------
                */
                'status' => 'Aktif',

                'lead_status' => $client->lead_status,

                /*
                |--------------------------------------------------------------------------
                | INFORMASI TAMBAHAN
                |--------------------------------------------------------------------------
                */
                'sumber' => $client->sumber,

                'domisili' => $client->domisili,

                'alamat_lengkap' => $client->alamat_lengkap,

                'product_interest' => $client->product_interest,

                /*
                |--------------------------------------------------------------------------
                | TANGGAL
                |--------------------------------------------------------------------------
                */
                'tanggal' => Carbon::parse(
                    $client->created_at
                )->translatedFormat('d F Y'),

                'created_at' => $client->created_at,
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | Stats card frontend
        |--------------------------------------------------------------------------
        */
        $stats = [
            [
                'label'  => 'Total Pelanggan',
                'value'  => $summary['total'],
                'change' => '+12 vs bulan lalu',
                'trend'  => 'up',
                'icon'   => 'wallet',
                'color'  => 'blue',
            ],
            [
                'label'  => 'Pelanggan Aktif',
                'value'  => $summary['aktif'],
                'change' => '+3.2% vs bulan lalu',
                'trend'  => 'up',
                'icon'   => 'chart-bar',
                'color'  => 'green',
            ],
            [
                'label'  => 'Prospek Berhasil',
                'value'  => $summary['berhasil'],
                'change' => 'Stabil vs bulan lalu',
                'trend'  => 'stable',
                'icon'   => 'globe',
                'color'  => 'orange',
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Render inertia
        |--------------------------------------------------------------------------
        */
        return Inertia::render('Pelanggan/Index', [
            'stats'          => $stats,
            'summary'        => $summary,
            'pelanggan'      => $pelanggan,
            'totalPelanggan' => $summary['total'],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DETAIL PELANGGAN
    |--------------------------------------------------------------------------
    */
    public function show($id)
    {
        try {

            $user = auth()->user();
            $isAdmin = (int) $user->is_admin === 1;

            $query = LeadClient::where('lead_status', 'Deal');

            // Jika bukan admin → hanya boleh lihat miliknya sendiri
            if (!$isAdmin) {
                $query->where('sales_id', $user->id);
            }

            $pelanggan = $query->findOrFail($id);

            return Inertia::render('Pelanggan/Show', [
                'id' => $id,
            ]);
        } catch (\Exception $e) {

            abort(404);
        }
    }
}
