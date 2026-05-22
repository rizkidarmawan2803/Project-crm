<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DealController extends Controller
{
    private function fileUrl($path): ?string
    {
        $clean = trim((string) ($path ?? ''));
        if ($clean === '') return null;
        try {
            return Storage::disk('public')->url($clean);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Simpan file langsung pakai move() — bypass storeAs yang bermasalah di Windows
     */
    private function saveFile(\Illuminate\Http\UploadedFile $file): ?string
    {
        try {
            $ext      = $file->getClientOriginalExtension() ?: 'bin';
            $safeName = time() . '_' . uniqid() . '.' . $ext;
            $destDir  = storage_path('app/public/deals');

            // Buat direktori jika belum ada
            if (!is_dir($destDir)) {
                mkdir($destDir, 0755, true);
            }

            // Pindahkan file ke direktori tujuan
            $file->move($destDir, $safeName);

            // Return path relatif untuk disimpan di DB
            return 'deals/' . $safeName;

        } catch (\Throwable $e) {
            \Log::error('DealController@saveFile error: ' . $e->getMessage());
            return null;
        }
    }

    // GET /api/deals?lead_client_id=xxx
    public function index(Request $request)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        $query = Deal::with(['leadClient', 'user'])
            ->whereHas('leadClient', function ($q) use ($userId) {
                $q->where('sales_id', $userId);
            });

        if ($request->lead_client_id) {
            $query->where('lead_client_id', $request->lead_client_id);
        }

        return response()->json([
            'success' => true,
            'data'    => $query->orderBy('created_at', 'desc')->get()->map(fn($deal) => [
                'id'             => $deal->id,
                'lead_client_id' => $deal->lead_client_id,
                'user_id'        => $deal->user_id,
                'payment_status' => $deal->payment_status,
                'deal_file'      => $deal->deal_file,
                'deal_file_url'  => $this->fileUrl($deal->deal_file),
                'catatan'        => $deal->catatan,
                'created_at'     => $deal->created_at,
                'user'           => $deal->user ? [
                    'id'         => $deal->user->id,
                    'first_name' => $deal->user->first_name,
                    'last_name'  => $deal->user->last_name,
                ] : null,
            ]),
        ]);
    }

    // POST /api/deals
    public function store(Request $request)
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Sesi login habis. Silakan login ulang.',
            ], 401);
        }

        $validated = $request->validate([
            'lead_client_id' => 'required|exists:lead_clients,id',
            'payment_status' => 'required|in:unpaid,partial,paid',
            'deal_file'      => 'nullable|file|mimes:pdf,doc,docx,zip|max:10240',
            'catatan'        => 'nullable|string',
        ]);

        // Simpan file pakai move() langsung — tidak pakai storeAs/store
        $filePath = null;
        if ($request->hasFile('deal_file') && $request->file('deal_file')->isValid()) {
            $filePath = $this->saveFile($request->file('deal_file'));
        }

        $deal = Deal::create([
            'lead_client_id' => $validated['lead_client_id'],
            'user_id'        => $userId,
            'payment_status' => $validated['payment_status'],
            'deal_file'      => $filePath,
            'catatan'        => $validated['catatan'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deal berhasil ditambahkan',
            'data'    => [
                'id'             => $deal->id,
                'lead_client_id' => $deal->lead_client_id,
                'payment_status' => $deal->payment_status,
                'deal_file'      => $deal->deal_file,
                'deal_file_url'  => $this->fileUrl($deal->deal_file),
                'catatan'        => $deal->catatan,
                'created_at'     => $deal->created_at,
            ],
        ], 201);
    }

    // DELETE /api/deals/{id}
    public function destroy($id)
    {
        $deal = Deal::findOrFail($id);
        if (!empty(trim((string) $deal->deal_file))) {
            Storage::disk('public')->delete($deal->deal_file);
        }
        $deal->delete();
        return response()->json(['success' => true, 'message' => 'Deal berhasil dihapus']);
    }

    // PUT /api/deals/{id}/status
    public function updateStatus(Request $request, $id)
    {
        $deal = Deal::findOrFail($id);
        $request->validate(['payment_status' => 'required|in:unpaid,partial,paid']);
        $deal->update(['payment_status' => $request->payment_status]);
        return response()->json(['success' => true, 'message' => 'Status deal berhasil diupdate', 'data' => $deal]);
    }
}