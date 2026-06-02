<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadClient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LeadClientController extends Controller
{
    // GET /api/prospek
    public function index(Request $request)
    {
        $user    = auth()->user();
        $isAdmin = (int) $user->is_admin === 1;

        $query = LeadClient::with('sales');

        // ── Admin: lihat semua data semua sales ──────────────────
        // ── Sales: hanya lihat data milik sendiri ────────────────
        if (!$isAdmin) {
            $query->where('sales_id', $user->id);
        }

        // Filter by sales_id (admin memilih sales tertentu dari search)
        if ($request->sales_id) {
            $query->where('sales_id', $request->sales_id);
        }

        // Filter by status
        if ($request->status && $request->status !== 'Semua') {
            $query->where('lead_status', $request->status);
        }

        // Search nama/perusahaan/email
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_client',   'like', '%' . $request->search . '%')
                    ->orWhere('company_name', 'like', '%' . $request->search . '%')
                    ->orWhere('email',       'like', '%' . $request->search . '%');
            });
        }

        $prospeks = $query->orderBy('created_at', 'desc')->paginate(5);

        // Summary — admin lihat semua, sales hanya milik sendiri
        $summaryQuery = LeadClient::query();
        if (!$isAdmin) {
            $summaryQuery->where('sales_id', $user->id);
        }
        if ($request->sales_id) {
            $summaryQuery->where('sales_id', $request->sales_id);
        }

        return response()->json([
            'status'   => 'success',
            'prospeks' => $prospeks,
            'summary'  => [
                'total'     => (clone $summaryQuery)->count(),
                'baru'      => (clone $summaryQuery)->where('lead_status', 'Baru')->count(),
                'dihubungi' => (clone $summaryQuery)->where('lead_status', 'Dihubungi')->count(),
                'negosiasi' => (clone $summaryQuery)->where('lead_status', 'Negosiasi')->count(),
                'deal'      => (clone $summaryQuery)->where('lead_status', 'Deal')->count(),
                'belum_tertarik'   => (clone $summaryQuery)->where('lead_status', 'Belum Tertarik')->count(),
            ],
        ]);
    }

    // GET /api/prospek/search-sales — cari sales berdasarkan nama (untuk admin)
    public function searchSales(Request $request)
    {
        $keyword = $request->keyword ?? '';

        $sales = User::where('is_admin', 0)
            ->where(function ($q) use ($keyword) {
                $q->where('first_name', 'like', '%' . $keyword . '%')
                    ->orWhere('last_name',  'like', '%' . $keyword . '%')
                    ->orWhere('email',      'like', '%' . $keyword . '%');
            })
            ->select('id', 'first_name', 'last_name', 'email')
            ->limit(10)
            ->get()
            ->map(fn($s) => [
                'id'    => $s->id,
                'nama'  => trim($s->first_name . ' ' . $s->last_name),
                'email' => $s->email,
            ]);

        return response()->json(['data' => $sales]);
    }

    // POST /api/prospek
    public function store(Request $request)
    {
        $request->validate([
            'nama_client'    => 'required|string|max:50',
            'phone'          => 'required|string|max:20',
            'email'          => 'required|email',
            'lead_status'    => 'required|in:Baru,Dihubungi,Negosiasi,Deal,Belum Tertarik',
            'sumber'         => 'required|string|max:50',
            'domisili'       => 'required|string|max:50',
            'alamat_lengkap' => 'required|string',
        ]);

        $prospek = LeadClient::create([
            'sales_id'         => auth()->id(),
            'nama_client'      => $request->nama_client,
            'company_name'     => $request->company_name,
            'phone'            => $request->phone,
            'email'            => $request->email,
            'product_interest' => $request->product_interest,
            'sumber'           => $request->sumber,
            'lead_status'      => $request->lead_status ?? 'Baru',
            'domisili'         => $request->domisili,
            'alamat_lengkap'   => $request->alamat_lengkap,
            'created_at'       => now(),
        ]);

        if ($prospek->lead_status === 'Baru') {

            Http::withHeaders([
                'Authorization' => env('FONTE_TOKEN')
            ])->post('https://api.fonnte.com/send', [
                'target'  => $prospek->phone,
                'message' =>
                "Halo {$prospek->nama_client},\n\n" .
                    "Terima kasih telah menghubungi PT Disty Teknologi Indonesia.\n" .
                    "Tim kami akan segera menghubungi Anda."
            ]);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Prospek berhasil ditambahkan',
            'data'    => $prospek->load('sales'),
        ], 201);
    }

    // GET /api/prospek/{id}
    public function show($id)
    {
        $prospek = LeadClient::with([
            'sales',
            'communicationLogs.user',
            'reminders',
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $prospek,
        ]);
    }

    // PUT /api/prospek/{id}
    public function update(Request $request, $id)
    {
        $prospek = LeadClient::findOrFail($id);

        $request->validate([
            'nama_client' => 'required|string|max:50',
            'phone'       => 'required|string|max:20',
            'lead_status' => 'required|in:Baru,Dihubungi,Negosiasi,Deal,Belum Tertarik',
            'email'       => 'required|email',
        ]);

        if ($request->lead_status !== $prospek->lead_status) {
            \App\Models\StatusLog::create([
                'lead_client_id' => $prospek->id,
                'user_id'        => auth()->id(),
                'status_lama'    => $prospek->lead_status,
                'status_baru'    => $request->lead_status,
                'catatan'        => $request->catatan ?? null,
            ]);
        }

        $prospek->update($request->all());

        return response()->json([
            'status'  => 'success',
            'message' => 'Prospek berhasil diupdate',
            'data'    => $prospek->load('sales'),
        ]);
    }

    // DELETE /api/prospek/{id}
    public function destroy($id)
    {
        $prospek = LeadClient::findOrFail($id);
        $prospek->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Prospek berhasil dihapus',
        ]);
    }

    // PUT /api/prospek/{id}/convert
    public function convertToClient($id)
    {
        $prospek = LeadClient::findOrFail($id);
        $prospek->update(['lead_status' => 'Deal']);

        return response()->json([
            'status'  => 'success',
            'message' => 'Prospek berhasil dikonversi menjadi client.',
            'data'    => $prospek->load('sales'),
        ]);
    }

    // GET /api/prospek/export/csv
    public function exportCsv()
    {
        $user    = auth()->user();
        $isAdmin = (int) $user->is_admin === 1;

        $query = LeadClient::orderBy('created_at', 'desc');
        if (!$isAdmin) {
            $query->where('sales_id', $user->id);
        }

        $prospeks = $query->get();
        $filename = 'prospek_' . date('Ymd_His') . '.csv';

        return response()->stream(function () use ($prospeks) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Nama Client', 'Perusahaan', 'Email', 'Phone', 'Status', 'Sumber', 'Domisili', 'Tanggal Dibuat']);
            foreach ($prospeks as $item) {
                fputcsv($file, [
                    $item->nama_client,
                    $item->company_name,
                    $item->email,
                    $item->phone,
                    $item->lead_status,
                    $item->sumber,
                    $item->domisili,
                    $item->created_at ? \Carbon\Carbon::parse($item->created_at)->translatedFormat('d F Y') : '-',
                ]);
            }
            fclose($file);
        }, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }
}
