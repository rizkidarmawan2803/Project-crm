<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PelangganController extends Controller
{
    public function index()
    {
        $stats = [
            [
                'label'  => 'Total Pelanggan',
                'value'  => 350,
                'change' => '+12 vs bulan lalu',
                'trend'  => 'up',
                'icon'   => 'wallet',
                'color'  => 'blue',
            ],
            [
                'label'  => 'Pelanggan Aktif',
                'value'  => 125,
                'change' => '+3.2% vs bulan lalu',
                'trend'  => 'up',
                'icon'   => 'chart-bar',
                'color'  => 'green',
            ],
            [
                'label'  => 'Prospek Berhasil',
                'value'  => 850,
                'change' => 'Stabil vs bulan lalu',
                'trend'  => 'stable',
                'icon'   => 'globe',
                'color'  => 'orange',
            ],
        ];

        $pelanggan = [
            [
                'id'         => 1,
                'perusahaan' => 'Solusi Teknologi',
                'kontak'     => '+62 812 8763 6356',
                'manager'    => 'Budi Santoso',
                'inisial'    => 'BS',
                'avatarColor'=> 'blue',
                'tanggal'    => '20 Agustus 2024',
                'status'     => 'Aktif',
            ],
            [
                'id'         => 2,
                'perusahaan' => 'Maju Jaya Logistik',
                'kontak'     => '+62 813 8763 7654',
                'manager'    => 'Anita Sari',
                'inisial'    => 'AS',
                'avatarColor'=> 'violet',
                'tanggal'    => '20 Agustus 2024',
                'status'     => 'Aktif',
            ],
            [
                'id'         => 3,
                'perusahaan' => 'Bank Global',
                'kontak'     => '+62 817 3426 0954',
                'manager'    => 'Hendra Wijaya',
                'inisial'    => 'HW',
                'avatarColor'=> 'orange',
                'tanggal'    => '20 Agustus 2024',
                'status'     => 'At Risk',
            ],
            [
                'id'         => 4,
                'perusahaan' => 'Sejahtera Ritel',
                'kontak'     => '+62 814 1258 3215',
                'manager'    => 'Budi Santoso',
                'inisial'    => 'BS',
                'avatarColor'=> 'blue',
                'tanggal'    => '20 Agustus 2024',
                'status'     => 'Aktif',
            ],
            [
                'id'         => 5,
                'perusahaan' => 'Karya Mandiri',
                'kontak'     => '+62 811 2345 6789',
                'manager'    => 'Dewi Kusuma',
                'inisial'    => 'DK',
                'avatarColor'=> 'teal',
                'tanggal'    => '15 September 2024',
                'status'     => 'Aktif',
            ],
            [
                'id'         => 6,
                'perusahaan' => 'Prima Utama',
                'kontak'     => '+62 856 9876 5432',
                'manager'    => 'Reza Pratama',
                'inisial'    => 'RP',
                'avatarColor'=> 'rose',
                'tanggal'    => '01 Oktober 2024',
                'status'     => 'Nonaktif',
            ],
            [
                'id'         => 7,
                'perusahaan' => 'Nusantara Digital',
                'kontak'     => '+62 878 1122 3344',
                'manager'    => 'Anita Sari',
                'inisial'    => 'AS',
                'avatarColor'=> 'violet',
                'tanggal'    => '10 Oktober 2024',
                'status'     => 'Aktif',
            ],
            [
                'id'         => 8,
                'perusahaan' => 'Bintang Harapan',
                'kontak'     => '+62 819 5566 7788',
                'manager'    => 'Hendra Wijaya',
                'inisial'    => 'HW',
                'avatarColor'=> 'orange',
                'tanggal'    => '22 Oktober 2024',
                'status'     => 'At Risk',
            ],
        ];

        return Inertia::render('Pelanggan', [
            'stats'          => $stats,
            'pelanggan'      => $pelanggan,
            'totalPelanggan' => 124,
        ]);
    }
}