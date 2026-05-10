<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [

            'stats' => [
                'total_target_market' => 1250,
                'prospek_today'       => 8,
                'prospek_aktif'       => 45,
                'pelanggan_berhasil'  => 12,
                'tingkat_konversi'    => 9.6,
            ],

            'funnel' => [
                ['label' => 'Penemuan',  'value' => '450', 'suffix' => 'Calon pelanggan', 'percent' => 100, 'colorBar' => 'bg-gray-800',  'colorText' => 'text-gray-600'],
                ['label' => 'Prospek',   'value' => '292', 'suffix' => 'Aktif',           'percent' => 65,  'colorBar' => 'bg-blue-400',  'colorText' => 'text-gray-600'],
                ['label' => 'Proposal',  'value' => '158', 'suffix' => 'Terkirim',        'percent' => 35,  'colorBar' => 'bg-blue-600',  'colorText' => 'text-gray-600'],
                ['label' => 'Negosiasi', 'value' => '67',  'suffix' => 'Terkualifikasi',  'percent' => 15,  'colorBar' => 'bg-blue-200',  'colorText' => 'text-gray-600'],
                ['label' => 'Tertutup',  'value' => '36',  'suffix' => 'Penawaran',       'percent' => 8,   'colorBar' => 'bg-green-500', 'colorText' => 'text-green-700'],
            ],

            'activities' => [
                [
                    'title'       => 'Hubungi TechSolutions - Tertarik?',
                    'description' => 'Klien meminta demonstrasi modul perusahaan yang baru.',
                    'time'        => '22 menit lalu',
                    'iconBg'      => 'bg-blue-50',
                    'iconType'    => 'phone',
                ],
                [
                    'title'       => 'Pertemuan dengan GlobalNet - Sukses',
                    'description' => 'Lingkup proyek telah diselesaikan. Kontrak telah dikirim untuk ditandatangani.',
                    'time'        => '2 jam lalu',
                    'iconBg'      => 'bg-green-50',
                    'iconType'    => 'meeting',
                ],
                [
                    'title'       => 'Kampanye email dikirim ke 12 prospek.',
                    'description' => 'Rangkaian kampanye personalisasi "Summer Q3" telah dimulai.',
                    'time'        => '4 jam lalu',
                    'iconBg'      => 'bg-amber-50',
                    'iconType'    => 'email',
                ],
                [
                    'title'       => 'Proposal yang dibuat untuk Horizon Partners',
                    'description' => 'Perjanjian lisensi multi-situs khusus yang disusun oleh tim hukum.',
                    'time'        => 'Kemarin',
                    'iconBg'      => 'bg-amber-50',
                    'iconType'    => 'document',
                ],
            ],

            'alerts' => [
                [
                    'label'      => 'PERINGATAN TANPA KONTAK',
                    'labelColor' => 'text-red-600',
                    'title'      => '5 prospek baru',
                    'subtitle'   => 'Menunggu sentuhan pertama > 48 jam',
                    'btnText'    => 'Ambil tindakan',
                    'btnClass'   => 'bg-red-500 hover:bg-red-600',
                    'cardClass'  => 'bg-red-50 border-red-400',
                ],
                [
                    'label'      => 'PERINGATAN KETIDAKAKTIFAN',
                    'labelColor' => 'text-amber-600',
                    'title'      => '3 prospek dingin',
                    'subtitle'   => 'Tidak ada aktivitas selama 3 hari',
                    'btnText'    => 'Menindaklanjuti',
                    'btnClass'   => 'bg-amber-500 hover:bg-amber-600',
                    'cardClass'  => 'bg-amber-50 border-amber-400',
                ],
            ],

            'weekly_trend' => [
                ['label' => 'Senin',  'height' => 55, 'active' => false],
                ['label' => 'Selasa', 'height' => 40, 'active' => false],
                ['label' => 'Rabu',   'height' => 70, 'active' => false],
                ['label' => 'Kamis',  'height' => 50, 'active' => false],
                ['label' => 'Jumat',  'height' => 85, 'active' => true],
                ['label' => 'Sabtu',  'height' => 90, 'active' => false],
                ['label' => 'Minggu', 'height' => 80, 'active' => false],
            ],

            'peak_performance' => 'Kamis: 14.2%',
        ]);
    }
}
