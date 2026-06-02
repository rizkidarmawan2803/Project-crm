<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadClient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Total seluruh target market
        $totalTargetMarket = DB::table('lead_clients')->count();

        // Prospek aktif
        $prospekAktif = DB::table('lead_clients')
            ->whereIn('lead_status', ['Baru', 'Dihubungi', 'Negosiasi'])
            ->count();

        // Pelanggan berhasil
        $pelangganBerhasil = DB::table('lead_clients')
            ->where('lead_status', 'Deal')
            ->count();

        // Tingkat konversi
        $conversionRate = $totalTargetMarket > 0
            ? round(($pelangganBerhasil / $totalTargetMarket) * 100, 1)
            : 0;

        // Corong konversi
        $conversionFunnel = [
            'baru'      => DB::table('lead_clients')->where('lead_status', 'Baru')->count(),
            'dihubungi' => DB::table('lead_clients')->where('lead_status', 'Dihubungi')->count(),
            'negosiasi' => DB::table('lead_clients')->where('lead_status', 'Negosiasi')->count(),
            'deal'      => DB::table('lead_clients')->where('lead_status', 'Deal')->count(),
            'belum_tertarik'   => DB::table('lead_clients')->where('lead_status', 'Belum Tertarik')->count(),
        ];

        // Aktivitas terbaru
        $activities = DB::table('communication_logs')
            ->join('lead_clients', 'communication_logs.lead_client_id', '=', 'lead_clients.id')
            ->select('communication_logs.*', 'lead_clients.nama_client', 'lead_clients.company_name')
            ->orderBy('communication_logs.contacted_at', 'desc')
            ->take(5)
            ->get();

        // Reminder aktif
        $reminders = DB::table('reminders')
            ->join('lead_clients', 'reminders.lead_client_id', '=', 'lead_clients.id')
            ->select('reminders.*', 'lead_clients.nama_client', 'lead_clients.company_name')
            ->where('reminders.is_completed', 0)
            ->orderBy('reminders.reminder_date', 'asc')
            ->take(5)
            ->get();

        return response()->json([
            'status'          => 'success',
            'stats'           => [
                'total_target_market' => $totalTargetMarket,
                'prospek_aktif'       => $prospekAktif,
                'pelanggan_berhasil'  => $pelangganBerhasil,
                'conversion_rate'     => $conversionRate,
                'closed_deals'        => $pelangganBerhasil,
            ],
            'conversion_funnel' => $conversionFunnel,
            'activities'        => $activities,
            'reminders'         => $reminders,
        ]);
    }

    // ─── Statistik Prospek dengan Filter ───────────────────────────────────────
    public function statistikProspek(Request $request)
    {
        $query = DB::table('lead_clients');

        // Filter by status
        if ($request->status && $request->status !== 'Semua') {
            $query->where('lead_status', $request->status);
        }

        // Filter by bulan
        if ($request->bulan) {
            $query->whereMonth('created_at', $request->bulan);
        }

        // Filter by tahun
        if ($request->tahun) {
            $query->whereYear('created_at', $request->tahun);
        }

        $total = (clone $query)->count();

        // Breakdown per status dengan filter bulan & tahun
        $baseQuery = DB::table('lead_clients');
        if ($request->bulan) $baseQuery->whereMonth('created_at', $request->bulan);
        if ($request->tahun) $baseQuery->whereYear('created_at', $request->tahun);

        $breakdown = [
            'baru'      => (clone $baseQuery)->where('lead_status', 'Baru')->count(),
            'dihubungi' => (clone $baseQuery)->where('lead_status', 'Dihubungi')->count(),
            'negosiasi' => (clone $baseQuery)->where('lead_status', 'Negosiasi')->count(),
            'deal'      => (clone $baseQuery)->where('lead_status', 'Deal')->count(),
            'belum_tertarik'   => (clone $baseQuery)->where('lead_status', 'Belum Tertarik')->count(),
        ];

        // Data per bulan untuk chart (dalam tahun yang dipilih)
        $tahun  = $request->tahun ?? now()->year;
        $perBulan = [];
        for ($i = 1; $i <= 12; $i++) {
            $q = DB::table('lead_clients')->whereYear('created_at', $tahun)->whereMonth('created_at', $i);
            if ($request->status && $request->status !== 'Semua') {
                $q->where('lead_status', $request->status);
            }
            $perBulan[] = [
                'bulan' => $i,
                'label' => \Carbon\Carbon::create()->month($i)->translatedFormat('M'),
                'total' => $q->count(),
            ];
        }

        return response()->json([
            'status'    => 'success',
            'total'     => $total,
            'breakdown' => $breakdown,
            'per_bulan' => $perBulan,
        ]);
    }

    // ─── Ranking Sales ──────────────────────────────────────────────────────────
    public function rankingSales(Request $request)
    {
        $query = DB::table('lead_clients')
            ->join('users', 'lead_clients.sales_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.email',
                DB::raw('COUNT(lead_clients.id) as total_prospek'),
                DB::raw('SUM(CASE WHEN lead_clients.lead_status = "Deal" THEN 1 ELSE 0 END) as total_deal'),
                DB::raw('SUM(CASE WHEN lead_clients.lead_status = "Baru" THEN 1 ELSE 0 END) as total_baru'),
                DB::raw('SUM(CASE WHEN lead_clients.lead_status = "Dihubungi" THEN 1 ELSE 0 END) as total_dihubungi'),
                DB::raw('SUM(CASE WHEN lead_clients.lead_status = "Negosiasi" THEN 1 ELSE 0 END) as total_negosiasi'),
                DB::raw('SUM(CASE WHEN lead_clients.lead_status = "Belum Tertarik" THEN 1 ELSE 0 END) as total_belum_tertarik')
            )
            ->where('users.is_admin', 0); // hanya sales

        // Filter by tanggal
        if ($request->dari) {
            $query->whereDate('lead_clients.created_at', '>=', $request->dari);
        }
        if ($request->sampai) {
            $query->whereDate('lead_clients.created_at', '<=', $request->sampai);
        }

        // Filter by bulan & tahun
        if ($request->bulan) {
            $query->whereMonth('lead_clients.created_at', $request->bulan);
        }
        if ($request->tahun) {
            $query->whereYear('lead_clients.created_at', $request->tahun);
        }

        $sales = $query->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email')
            ->get()
            ->map(function ($s) {
                $s->conversion_rate = $s->total_prospek > 0
                    ? round(($s->total_deal / $s->total_prospek) * 100, 1)
                    : 0;
                $s->nama = trim("{$s->first_name} {$s->last_name}");
                return $s;
            });

        // 10 terbaik = deal terbanyak
        $terbaik = $sales->sortByDesc('total_deal')->take(10)->values();

        // 10 terburuk = deal paling sedikit
        $terburuk = $sales->sortBy('total_deal')->take(10)->values();

        return response()->json([
            'status'   => 'success',
            'terbaik'  => $terbaik,
            'terburuk' => $terburuk,
        ]);
    }

    // ─── Detail Sales ───────────────────────────────────────────────────────────
    public function detailSales(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $query = DB::table('lead_clients')->where('sales_id', $id);

        // Filter tanggal
        if ($request->dari) {
            $query->whereDate('created_at', '>=', $request->dari);
        }
        if ($request->sampai) {
            $query->whereDate('created_at', '<=', $request->sampai);
        }
        if ($request->bulan) {
            $query->whereMonth('created_at', $request->bulan);
        }
        if ($request->tahun) {
            $query->whereYear('created_at', $request->tahun);
        }

        $total = (clone $query)->count();

        $breakdown = [
            ['status' => 'Baru',      'total' => (clone $query)->where('lead_status', 'Baru')->count()],
            ['status' => 'Dihubungi', 'total' => (clone $query)->where('lead_status', 'Dihubungi')->count()],
            ['status' => 'Negosiasi', 'total' => (clone $query)->where('lead_status', 'Negosiasi')->count()],
            ['status' => 'Deal',      'total' => (clone $query)->where('lead_status', 'Deal')->count()],
            ['status' => 'Belum Tertarik',   'total' => (clone $query)->where('lead_status', 'Belum Tertarik')->count()],
        ];

        // Hitung persen
        $breakdown = array_map(function ($item) use ($total) {
            $item['persen'] = $total > 0 ? round(($item['total'] / $total) * 100, 1) : 0;
            return $item;
        }, $breakdown);

        return response()->json([
            'status' => 'success',
            'sales'  => [
                'id'    => $user->id,
                'nama'  => trim("{$user->first_name} {$user->last_name}"),
                'email' => $user->email,
            ],
            'total'     => $total,
            'breakdown' => $breakdown,
        ]);
    }
}