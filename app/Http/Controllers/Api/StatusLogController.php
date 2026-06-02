<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StatusLog;
use App\Models\LeadClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class StatusLogController extends Controller
{
    /**
     * Menampilkan seluruh riwayat perubahan status
     * berdasarkan lead_client_id.
     */
    public function index($id)
    {
        $logs = StatusLog::with('user')
            ->where('lead_client_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    /**
     * Menyimpan perubahan status prospek sekaligus
     * memperbarui field lead_status pada tabel lead_clients.
     *
     * POST /api/prospek/{id}/status-logs
     */
    public function store(Request $request, $id)
    {
        // Cari data prospek
        $prospek = LeadClient::findOrFail($id);

        // Validasi input sesuai enum di database
        $validated = $request->validate([
            'status_baru' => 'required|in:Baru,Dihubungi,Negosiasi,Deal,Belum Tertarik',
            'catatan'     => 'nullable|string',
        ]);

        // Ambil ID user yang sedang login
        $userId = Auth::id();

        // Jika user belum login
        if (!$userId) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User belum login.',
            ], 401);
        }

        // Jika status tidak berubah
        if ($prospek->lead_status === $validated['status_baru']) {
            return response()->json([
                'status'  => 'warning',
                'message' => 'Status tidak mengalami perubahan.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Simpan status lama
            $statusLama = $prospek->lead_status;

            // Update status pada tabel lead_clients
            $prospek->update([
                'lead_status' => $validated['status_baru'],
            ]);

            // Simpan riwayat ke tabel status_logs
            $log = StatusLog::create([
                'lead_client_id' => $prospek->id,
                'user_id'        => $userId,
                'status_lama'    => $statusLama,
                'status_baru'    => $validated['status_baru'],
                'catatan'        => $validated['catatan'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Status prospek berhasil diperbarui.',
                'data'    => [
                    'log'     => $log->load('user'),
                    'prospek' => $prospek->fresh('sales'),
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            // Tampilkan pesan error asli agar mudah debugging
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal memperbarui status prospek.',
                'error'   => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => basename($e->getFile()),
            ], 500);
        }
    }
}