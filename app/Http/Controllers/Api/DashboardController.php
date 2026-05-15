<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | Statistik Dashboard
        |--------------------------------------------------------------------------
        | Semua perhitungan menggunakan tabel lead_clients
        | dengan acuan kolom lead_status:
        |
        | - Baru
        | - Dihubungi
        | - Negosiasi
        | - Deal
        | - Ditolak
        |--------------------------------------------------------------------------
        */

        // Total seluruh target market (semua prospek)
        $totalTargetMarket = DB::table('lead_clients')->count();

        // Prospek yang masih aktif diproses
        $prospekAktif = DB::table('lead_clients')
            ->whereIn('lead_status', [
                'Baru',
                'Dihubungi',
                'Negosiasi',
            ])
            ->count();

        // Prospek yang berhasil menjadi pelanggan
        $pelangganBerhasil = DB::table('lead_clients')
            ->where('lead_status', 'Deal')
            ->count();

        // Closed deals = sama dengan jumlah Deal
        $closedDeals = $pelangganBerhasil;

        // Tingkat konversi = Deal / Total Target Market x 100%
        $conversionRate = $totalTargetMarket > 0
            ? round(($pelangganBerhasil / $totalTargetMarket) * 100, 1)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Corong Konversi (Conversion Funnel)
        |--------------------------------------------------------------------------
        */
        $conversionFunnel = [
            'baru' => DB::table('lead_clients')
                ->where('lead_status', 'Baru')
                ->count(),

            'dihubungi' => DB::table('lead_clients')
                ->where('lead_status', 'Dihubungi')
                ->count(),

            'negosiasi' => DB::table('lead_clients')
                ->where('lead_status', 'Negosiasi')
                ->count(),

            'deal' => DB::table('lead_clients')
                ->where('lead_status', 'Deal')
                ->count(),

            'ditolak' => DB::table('lead_clients')
                ->where('lead_status', 'Ditolak')
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Aktivitas Terbaru
        |--------------------------------------------------------------------------
        | Tabel: communication_logs
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
            ->orderBy('communication_logs.contacted_at', 'desc')
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
        | Response JSON
        |--------------------------------------------------------------------------
        */
        return response()->json([
            'status' => 'success',

            'stats' => [
                'total_target_market' => $totalTargetMarket,
                'prospek_today'       => 0, // dapat dikembangkan nanti
                'prospek_aktif'       => $prospekAktif,
                'pelanggan_berhasil'  => $pelangganBerhasil,
                'conversion_rate'     => $conversionRate,
                'closed_deals'        => $closedDeals,
            ],

            // Data funnel untuk grafik corong konversi
            'conversion_funnel' => $conversionFunnel,

            // Aktivitas terbaru
            'activities' => $activities,

            // Reminder aktif
            'reminders' => $reminders,
        ]);
    }
}