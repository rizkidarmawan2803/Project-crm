<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_target_market' => 1250,
            'prospek_today'       => 8,
            'prospek_aktif'       => 45,
            'pelanggan_berhasil'  => 12,
            'tingkat_konversi'    => 9.6,
        ];

        $funnel = [
            [
                'label'      => 'Penemuan',
                'value'      => '450',
                'suffix'     => 'Calon pelanggan',
                'percent'    => 100,
                'color_bar'  => 'bg-gray-800',
                'color_text' => 'text-gray-600',
            ],
            [
                'label'      => 'Prospek',
                'value'      => '292',
                'suffix'     => 'Aktif',
                'percent'    => 65,
                'color_bar'  => 'bg-blue-400',
                'color_text' => 'text-gray-600',
            ],
            [
                'label'      => 'Proposal',
                'value'      => '158',
                'suffix'     => 'Terkirim',
                'percent'    => 35,
                'color_bar'  => 'bg-blue-600',
                'color_text' => 'text-gray-600',
            ],
            [
                'label'      => 'Negosiasi',
                'value'      => '67',
                'suffix'     => 'Terkualifikasi',
                'percent'    => 15,
                'color_bar'  => 'bg-blue-200',
                'color_text' => 'text-gray-600',
            ],
            [
                'label'      => 'Tertutup',
                'value'      => '36',
                'suffix'     => 'Penawaran',
                'percent'    => 8,
                'color_bar'  => 'bg-green-500',
                'color_text' => 'text-green-700',
            ],
        ];

        $activities = [
            [
                'title'       => 'Hubungi TechSolutions - Tertarik?',
                'description' => 'Klien meminta demonstrasi modul perusahaan yang baru.',
                'time'        => '22 menit lalu',
                'icon_bg'     => 'bg-blue-50',
                'icon'        => '<svg class="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 3h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg>',
            ],
            [
                'title'       => 'Pertemuan dengan GlobalNet - Sukses',
                'description' => 'Lingkup proyek telah diselesaikan. Kontrak telah dikirim untuk ditandatangani.',
                'time'        => '2 jam lalu',
                'icon_bg'     => 'bg-green-50',
                'icon'        => '<svg class="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8l4 4 8-8"/></svg>',
            ],
            [
                'title'       => 'Kampanye email dikirim ke 12 prospek.',
                'description' => 'Rangkaian kampanye personalisasi "Summer Q3" telah dimulai.',
                'time'        => '4 jam lalu',
                'icon_bg'     => 'bg-amber-50',
                'icon'        => '<svg class="w-4 h-4 text-amber-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 4h12v9H2z"/><path d="M2 4l6 5 6-5"/></svg>',
            ],
            [
                'title'       => 'Proposal yang dibuat untuk Horizon Partners',
                'description' => 'Perjanjian lisensi multi-situs khusus yang disusun oleh tim hukum.',
                'time'        => 'Kemarin',
                'icon_bg'     => 'bg-amber-50',
                'icon'        => '<svg class="w-4 h-4 text-amber-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 2h10v12H3z"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="9" x2="10" y2="9"/></svg>',
            ],
        ];

        $alerts = [
            [
                'label'       => 'PERINGATAN TANPA KONTAK',
                'title'       => '5 prospek baru',
                'subtitle'    => 'Menunggu sentuhan pertama > 48 jam',
                'btn_text'    => 'Ambil tindakan',
                'class'       => 'bg-red-50 border-red-400',
                'label_color' => 'text-red-600',
                'btn_class'   => 'bg-red-500 hover:bg-red-600',
            ],
            [
                'label'       => 'PERINGATAN KETIDAKAKTIFAN',
                'title'       => '3 prospek dingin',
                'subtitle'    => 'Tidak ada aktivitas selama 3 hari',
                'btn_text'    => 'Menindaklanjuti',
                'class'       => 'bg-amber-50 border-amber-400',
                'label_color' => 'text-amber-600',
                'btn_class'   => 'bg-amber-500 hover:bg-amber-600',
            ],
        ];

        $weekly_trend = [
            ['label' => 'Senin',  'height' => 55, 'active' => false],
            ['label' => 'Selasa', 'height' => 40, 'active' => false],
            ['label' => 'Rabu',   'height' => 70, 'active' => false],
            ['label' => 'Kamis',  'height' => 50, 'active' => false],
            ['label' => 'Jumat',  'height' => 85, 'active' => true],
            ['label' => 'Sabtu',  'height' => 90, 'active' => false],
            ['label' => 'Minggu', 'height' => 80, 'active' => false],
        ];

        $peak_performance = 'Kamis: 14.2%';

        return view('dashboard.index', compact(
            'stats',
            'funnel',
            'activities',
            'alerts',
            'weekly_trend',
            'peak_performance'
        ));
    }
}
