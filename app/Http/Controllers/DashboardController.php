<?php

namespace App\Http\Controllers;

use App\Models\LeadClient;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | Statistik Dashboard
        |--------------------------------------------------------------------------
        */

        // Total seluruh target market
        $totalTargetMarket = LeadClient::count();

        // Prospek aktif
        $prospekAktif = LeadClient::whereIn('lead_status', [
            'Baru',
            'Dihubungi',
            'Negosiasi',
        ])->count();

        // Pelanggan berhasil
        $pelangganBerhasil = LeadClient::where('lead_status', 'Deal')->count();

        // Closed deals
        $closedDeals = $pelangganBerhasil;

        // Tingkat konversi
        $conversionRate = $totalTargetMarket > 0
            ? round(($pelangganBerhasil / $totalTargetMarket) * 100, 1)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Corong Konversi
        |--------------------------------------------------------------------------
        */

        $conversionFunnel = [
            [
                'label' => 'Baru',
                'value' => LeadClient::where('lead_status', 'Baru')->count(),
            ],
            [
                'label' => 'Dihubungi',
                'value' => LeadClient::where('lead_status', 'Dihubungi')->count(),
            ],
            [
                'label' => 'Negosiasi',
                'value' => LeadClient::where('lead_status', 'Negosiasi')->count(),
            ],
            [
                'label' => 'Deal',
                'value' => LeadClient::where('lead_status', 'Deal')->count(),
            ],
            [
                'label' => 'Ditolak',
                'value' => LeadClient::where('lead_status', 'Ditolak')->count(),
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Aktivitas Terbaru
        |--------------------------------------------------------------------------
        */

        $activities = DB::table('communication_logs')
            ->join(
                'lead_clients',
                'communication_logs.lead_client_id',
                '=',
                'lead_clients.id'
            )
            ->select(
                'communication_logs.*',
                'lead_clients.nama_client',
                'lead_clients.company_name'
            )
            ->orderBy('communication_logs.created_at', 'desc')
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Reminder Aktif
        |--------------------------------------------------------------------------
        */

        $reminders = DB::table('reminders')
            ->join(
                'lead_clients',
                'reminders.lead_client_id',
                '=',
                'lead_clients.id'
            )
            ->select(
                'reminders.*',
                'lead_clients.nama_client',
                'lead_clients.company_name'
            )
            ->where('reminders.is_completed', 0)
            ->orderBy('reminders.reminder_date', 'asc')
            ->take(5)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Kirim ke React (Inertia)
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_target_market' => $totalTargetMarket,
                'prospek_aktif'       => $prospekAktif,
                'pelanggan_berhasil'  => $pelangganBerhasil,
                'conversion_rate'     => $conversionRate,
                'closed_deals'        => $closedDeals,
            ],

            'conversionFunnel' => $conversionFunnel,

            'activities' => $activities,

            'reminders' => $reminders,
        ]);
    }
}