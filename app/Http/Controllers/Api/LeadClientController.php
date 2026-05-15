<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeadClient;
use App\Models\User;
use Illuminate\Http\Request;

class LeadClientController extends Controller
{
    // GET /api/prospek
    public function index(Request $request)
    {
        $query = LeadClient::with('sales');

        // Filter by status
        if ($request->status && $request->status !== 'Semua') {
            $query->where('lead_status', $request->status);
        }

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nama_client', 'like', '%' . $request->search . '%')
                  ->orWhere('company_name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $prospeks = $query->orderBy('created_at', 'desc')->paginate(5);

        return response()->json([
            'status'   => 'success',
            'prospeks' => $prospeks,
            'summary'  => [
                'total'     => LeadClient::count(),
                'baru'      => LeadClient::where('lead_status', 'Baru')->count(),
                'dihubungi' => LeadClient::where('lead_status', 'Dihubungi')->count(),
                'negosiasi' => LeadClient::where('lead_status', 'Negosiasi')->count(),
                'deal'      => LeadClient::where('lead_status', 'Deal')->count(),
                'ditolak'   => LeadClient::where('lead_status', 'Ditolak')->count(),
            ]
        ]);
    }

    // POST /api/prospek
    public function store(Request $request)
    {
        $request->validate([
            'nama_client'    => 'required|string|max:50',
            'phone'          => 'required|string|max:20',
            'sales_id'       => 'required|exists:users,id',
            'lead_status'    => 'required|in:Baru,Dihubungi,Negosiasi,Deal,Ditolak',
            'sumber'         => 'required|string|max:50',
            'domisili'       => 'required|string|max:50',
            'alamat_lengkap' => 'required|string',
        ]);

        $prospek = LeadClient::create([
            'sales_id'         => $request->sales_id,
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
            'reminders'
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
            'lead_status' => 'required|in:Baru,Dihubungi,Negosiasi,Deal,Ditolak',
        ]);

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
}