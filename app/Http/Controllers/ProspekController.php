<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ProspekController extends Controller
{
    /**
     * Halaman utama Manajemen Prospek.
     */
    public function index(): Response
    {
        // Ganti dengan query Eloquent ketika model & tabel sudah siap
        // Contoh: $prospeks = Prospek::with('pic')->latest()->get();
        $prospeks = [
            [
                'id'              => 'LD-2023-0042',
                'nama'            => 'Budi Santoso',
                'perusahaan'      => 'PT. Teknologi Maju',
                'email'           => 'budi.s@techmaju.com',
                'telepon'         => '+62 812 3456 7890',
                'sumber'          => 'Google Ads',
                'status'          => 'baru',
                'domisili'        => 'Surabaya',
                'pic'             => 'Andi Pratama',
                'tgl_dibuat'      => '10 Jul 2021',
                'nilai_estimasi'  => 'Rp 125.000.000',
            ],
            [
                'id'              => 'LD-2022-0108',
                'nama'            => 'Citra Lestari',
                'perusahaan'      => 'Lestari Fashion',
                'email'           => 'citra@lestarifashion.id',
                'telepon'         => '+62 811 9988 7766',
                'sumber'          => 'Instagram',
                'status'          => 'negosiasi',
                'domisili'        => 'Malang',
                'pic'             => 'Siti Aminah',
                'tgl_dibuat'      => '11 Ags 2022',
                'nilai_estimasi'  => 'Rp 78.000.000',
            ],
            [
                'id'              => 'LD-2023-0215',
                'nama'            => 'Deni Kurniawan',
                'perusahaan'      => 'CV. Berkah Abadi',
                'email'           => 'deni@berkah.co.id',
                'telepon'         => '+62 877 6655 4433',
                'sumber'          => 'Referral',
                'status'          => 'berhasil',
                'domisili'        => 'Gresik',
                'pic'             => 'Budi Doremi',
                'tgl_dibuat'      => '12 Sep 2023',
                'nilai_estimasi'  => 'Rp 210.000.000',
            ],
            [
                'id'              => 'LD-2025-0399',
                'nama'            => 'Farhan Hakim',
                'perusahaan'      => 'Individual',
                'email'           => 'farhan.h@gmail.com',
                'telepon'         => '+62 899 1122 3344',
                'sumber'          => 'Direct Traffic',
                'status'          => 'gagal',
                'domisili'        => 'Bali',
                'pic'             => 'Rina Sari',
                'tgl_dibuat'      => '14 Nov 2025',
                'nilai_estimasi'  => 'Rp 35.000.000',
            ],
            [
                'id'              => 'LD-2024-0511',
                'nama'            => 'Sari Dewi',
                'perusahaan'      => 'PT. Maju Bersama',
                'email'           => 'sari.dewi@majubersama.co.id',
                'telepon'         => '+62 856 7788 9900',
                'sumber'          => 'Facebook Ads',
                'status'          => 'dihubungi',
                'domisili'        => 'Bandung',
                'pic'             => 'Andi Mahendra',
                'tgl_dibuat'      => '3 Mar 2024',
                'nilai_estimasi'  => 'Rp 55.000.000',
            ],
        ];

        return Inertia::render('Prospek/Index', [
            'prospeks' => $prospeks,
        ]);
    }
}
