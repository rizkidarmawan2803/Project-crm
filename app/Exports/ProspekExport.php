<?php

namespace App\Exports;

use App\Models\LeadClient;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProspekExport implements FromCollection, WithHeadings, WithMapping
{
    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function collection()
    {
        $query = LeadClient::query();

        // Jika bukan admin → hanya data miliknya
        if ((int) $this->user->is_admin !== 1) {
            $query->where('sales_id', $this->user->id);
        }

        return $query->select(
            'nama_client',
            'company_name',
            'email',
            'phone',
            'product_interest',
            'lead_status',
            'sumber',
            'domisili',
            'created_at'
        )->get();
    }

    public function map($prospek): array
    {
        return [
            $prospek->nama_client,
            $prospek->company_name,
            $prospek->email,
            $prospek->phone,
            $prospek->product_interest,
            $prospek->lead_status,
            $prospek->sumber,
            $prospek->domisili,
            $prospek->created_at
                ? \Carbon\Carbon::parse($prospek->created_at)
                ->translatedFormat('d F Y')
                : '-',
        ];
    }

    public function headings(): array
    {
        return [
            'Nama Client',
            'Perusahaan',
            'Email',
            'Telepon',
            'Produk Diminati',
            'Status',
            'Sumber',
            'Domisili',
            'Tanggal Dibuat',
        ];
    }
}
