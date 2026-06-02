<?php

namespace App\Http\Controllers;

use App\Models\LeadClient;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ProspekController extends Controller
{
    public function index(): Response
    {
        // Ambil daftar user Sales PIC
        $sales = User::where('is_admin', 0)
            ->where('status', 'active')
            ->orderBy('first_name')
            ->get([
                'id',
                'first_name',
                'last_name',
            ]);

        // Statistik prospek
        $summary = [
            'total'      => LeadClient::count(),
            'baru'       => LeadClient::where('lead_status', 'Baru')->count(),
            'dihubungi'  => LeadClient::where('lead_status', 'Dihubungi')->count(),
            'negosiasi'  => LeadClient::where('lead_status', 'Negosiasi')->count(),
            'deal'       => LeadClient::where('lead_status', 'Deal')->count(),
            'belum_tertarik'    => LeadClient::where('lead_status', 'Belum Tertarik')->count(),
        ];

        return Inertia::render('Prospek/Index', [
            'sales'   => $sales,
            'summary' => $summary,
        ]);
    }

    public function show($id)
    {
        try {
            $prospek = \App\Models\LeadClient::with('sales')
                ->findOrFail($id);

            // Tambahkan nama lengkap untuk frontend
            $prospek->nama_client = trim(
                ($prospek->first_name ?? '') . ' ' .
                    ($prospek->last_name ?? '')
            );

            return response()->json([
                'status' => 'success',
                'data'   => $prospek,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mengambil data prospek.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
