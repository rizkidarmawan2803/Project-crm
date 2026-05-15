<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunicationLog;
use App\Models\LeadClient;
use Illuminate\Http\Request;

class AktivitasController extends Controller
{
    /**
     * Ambil semua log komunikasi berdasarkan lead/client.
     * GET /api/aktivitas/{leadClientId}
     */
    public function index($leadClientId)
    {
        $logs = CommunicationLog::with('user:id,first_name,last_name')
            ->where('lead_client_id', $leadClientId)
            ->orderBy('contacted_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id'           => $log->id,
                    'channel'      => $log->channel,
                    'message'      => $log->message,
                    'contacted_at' => $log->contacted_at,
                    'sales_name'   => $log->user
                        ? trim($log->user->first_name . ' ' . $log->user->last_name)
                        : '-',
                ];
            });

        return response()->json([
            'status' => 'success',
            'data'   => $logs,
        ]);
    }

    /**
     * Simpan log komunikasi baru.
     * POST /api/aktivitas
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'lead_client_id' => 'required|integer|exists:lead_clients,id',
            'channel'        => 'required|in:WA,Email,Call',
            'message'        => 'required|string|max:5000',
            'contacted_at'   => 'nullable|date',
        ], [
            'lead_client_id.required' => 'Lead/Client wajib dipilih.',
            'lead_client_id.exists'   => 'Lead/Client tidak ditemukan.',
            'channel.required'        => 'Channel komunikasi wajib dipilih.',
            'channel.in'              => 'Channel harus WA, Email, atau Call.',
            'message.required'        => 'Isi pesan wajib diisi.',
        ]);

        // Ambil data lead/client
        $leadClient = LeadClient::findOrFail($request->lead_client_id);

        // Gunakan sales_id sebagai user_id
        $salesId = $leadClient->sales_id;

        // Simpan log komunikasi
        $log = CommunicationLog::create([
            'lead_client_id' => $request->lead_client_id,
            'user_id'        => $salesId, // otomatis dari sales PIC
            'channel'        => $request->channel,
            'message'        => $request->message,
            'contacted_at'   => $request->contacted_at ?? now(),
        ]);

        // Load relasi user untuk menampilkan nama sales
        $log->load('user:id,first_name,last_name');

        return response()->json([
            'status'  => 'success',
            'message' => 'Log komunikasi berhasil disimpan.',
            'data'    => [
                'id'             => $log->id,
                'lead_client_id' => $log->lead_client_id,
                'user_id'        => $log->user_id,
                'channel'        => $log->channel,
                'message'        => $log->message,
                'contacted_at'   => $log->contacted_at,
                'sales_name'     => $log->user
                    ? trim($log->user->first_name . ' ' . $log->user->last_name)
                    : '-',
            ],
        ], 201);
    }
}