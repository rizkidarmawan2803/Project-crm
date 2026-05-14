<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalTargetMarket = DB::table('lead_clients')->count();

        $prospekAktif = DB::table('lead_clients')
            ->where('user_type', 'lead')
            ->count();

        $pelangganBerhasil = DB::table('lead_clients')
            ->where('user_type', 'client')
            ->count();

        $closedDeals = DB::table('lead_clients')
            ->where('lead_status', 'closed')
            ->count();

        $conversionRate = $totalTargetMarket > 0
            ? round(($pelangganBerhasil / $totalTargetMarket) * 100, 1)
            : 0;

        $activities = DB::table('communication_log')
            ->join(
                'lead_clients',
                'communication_log.lead_client_id',
                '=',
                'lead_clients.id'
            )
            ->select(
                'communication_log.*',
                'lead_clients.first_name',
                'lead_clients.last_name',
                'lead_clients.company_name'
            )
            ->latest('contacted_at')
            ->take(5)
            ->get();

        $reminders = DB::table('reminders')
            ->join(
                'lead_clients',
                'reminders.lead_client_id',
                '=',
                'lead_clients.id'
            )
            ->select(
                'reminders.*',
                'lead_clients.first_name',
                'lead_clients.last_name',
                'lead_clients.company_name'
            )
            ->where('is_completed', 0)
            ->latest('reminder_date')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_target_market' => $totalTargetMarket,
                'prospek_today'       => 0,
                'prospek_aktif'       => $prospekAktif,
                'pelanggan_berhasil'  => $pelangganBerhasil,
                'conversion_rate'     => $conversionRate,
                'closed_deals'        => $closedDeals,
            ],

            'activities' => $activities,

            'reminders' => $reminders,
        ]);
    }
}