@extends('layouts.app')

@section('title', 'Dashboard - CRM')

@section('content')

{{-- STAT CARDS --}}
<div class="grid grid-cols-4 gap-4 mb-6">

    {{-- Total Target Market --}}
    <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <circle cx="8" cy="8" r="6"/>
                    <path d="M4 8a4 4 0 014-4"/>
                </svg>
            </div>
            <span class="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">+4.2%</span>
        </div>
        <p class="text-xs text-gray-400 mb-1">Total Target Market</p>
        <p class="text-2xl font-semibold text-gray-800">{{ number_format($stats['total_target_market']) }}</p>
        <p class="text-xs text-gray-400 mt-1">dibandingkan bulan lalu</p>
    </div>

    {{-- Prospek Aktif --}}
    <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-teal-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <path d="M8 2C5 2 3 4 3 7c0 1.5.5 2.8 1.3 3.7L3 14l3.5-1c.5.2 1 .3 1.5.3 3 0 5-2 5-5S11 2 8 2z"/>
                </svg>
            </div>
            <span class="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">+{{ $stats['prospek_today'] }} today</span>
        </div>
        <p class="text-xs text-gray-400 mb-1">Prospek Aktif</p>
        <p class="text-2xl font-semibold text-gray-800">{{ $stats['prospek_aktif'] }}</p>
        <p class="text-xs text-gray-400 mt-1">status aktif</p>
    </div>

    {{-- Pelanggan Berhasil --}}
    <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <circle cx="8" cy="6" r="3"/>
                    <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
                </svg>
            </div>
            <span class="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Sesuai rencana</span>
        </div>
        <p class="text-xs text-gray-400 mb-1">Pelanggan Berhasil</p>
        <p class="text-2xl font-semibold text-gray-800">{{ $stats['pelanggan_berhasil'] }}</p>
        <p class="text-xs text-gray-400 mt-1">melampaui target</p>
    </div>

    {{-- Tingkat Konversi --}}
    <div class="bg-white rounded-xl border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="2,12 6,7 9,10 14,4"/>
                </svg>
            </div>
            <span class="text-xs font-medium bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-0.4%</span>
        </div>
        <p class="text-xs text-gray-400 mb-1">Tingkat Konversi</p>
        <p class="text-2xl font-semibold text-gray-800">{{ $stats['tingkat_konversi'] }}%</p>
        <p class="text-xs text-gray-400 mt-1">rata rata bulanan</p>
    </div>

</div>

{{-- CORONG KONVERSI --}}
<div class="bg-white rounded-xl border border-gray-100 p-5 mb-5">
    <div class="flex items-center justify-between mb-5">
        <h2 class="text-sm font-semibold text-gray-800">Corong Konversi</h2>
        <a href="#" class="text-xs text-blue-600 hover:underline">Lihat Laporan Lengkap →</a>
    </div>

    <div class="space-y-3">
        @foreach ($funnel as $item)
        <div>
            <div class="flex justify-between text-xs mb-1.5">
                <span class="text-gray-500">{{ $item['label'] }}</span>
                <span class="{{ $item['color_text'] ?? 'text-gray-600' }} font-medium">{{ $item['value'] }} {{ $item['suffix'] }}</span>
            </div>
            <div class="h-5 bg-gray-100 rounded">
                <div class="h-full rounded transition-all duration-500 {{ $item['color_bar'] }}"
                     style="width: {{ $item['percent'] }}%"></div>
            </div>
        </div>
        @endforeach
    </div>
</div>

{{-- AKTIVITAS TERKINI --}}
<div class="bg-white rounded-xl border border-gray-100 p-5 mb-5">
    <h2 class="text-sm font-semibold text-gray-800 mb-4">Aktivitas Terkini</h2>

    <div class="divide-y divide-gray-50">
        @foreach ($activities as $activity)
        <div class="flex items-start gap-3 py-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 {{ $activity['icon_bg'] }}">
                {!! $activity['icon'] !!}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800">{{ $activity['title'] }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ $activity['description'] }}</p>
            </div>
            <span class="text-xs text-gray-400 whitespace-nowrap">{{ $activity['time'] }}</span>
        </div>
        @endforeach
    </div>
</div>

{{-- BARIS BAWAH: Peringatan + Tren --}}
<div class="grid grid-cols-2 gap-5">

    {{-- Peringatan Mendesak --}}
    <div class="bg-white rounded-xl border border-gray-100 p-5">
        <h2 class="text-sm font-semibold text-red-600 mb-4 flex items-center gap-1.5">
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="8" cy="8" r="6"/>
                <path d="M8 5v3M8 10.5v0.5" stroke-linecap="round"/>
            </svg>
            Peringatan Mendesak
        </h2>

        @foreach ($alerts as $alert)
        <div class="rounded-lg p-3.5 mb-3 border-l-4 {{ $alert['class'] }}">
            <p class="text-[10px] font-semibold tracking-wider mb-1 {{ $alert['label_color'] }}">{{ $alert['label'] }}</p>
            <p class="text-sm font-semibold text-gray-800">{{ $alert['title'] }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ $alert['subtitle'] }}</p>
            <button class="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 {{ $alert['btn_class'] }}">
                {{ $alert['btn_text'] }}
            </button>
        </div>
        @endforeach
    </div>

    {{-- Tren Mingguan --}}
    <div class="bg-white rounded-xl border border-gray-100 p-5">
        <h2 class="text-sm font-semibold text-gray-800 mb-4">Tren Mingguan</h2>

        {{-- Bar Chart --}}
        <div class="flex items-end gap-2 h-28">
            @foreach ($weekly_trend as $day)
            <div class="flex-1 flex flex-col items-center gap-1">
                <div class="w-full rounded-t transition-all duration-500 {{ $day['active'] ? 'bg-blue-500' : 'bg-gray-100' }}"
                     style="height: {{ $day['height'] }}px"></div>
                <span class="text-[10px] {{ $day['active'] ? 'text-blue-600 font-semibold' : 'text-gray-400' }}">
                    {{ $day['label'] }}
                </span>
            </div>
            @endforeach
        </div>

        {{-- Performa Puncak --}}
        <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
                <p class="text-xs text-gray-400">Performa Puncak</p>
                <p class="text-sm font-semibold text-gray-800">{{ $peak_performance }}</p>
            </div>
            <svg class="w-10 h-5" viewBox="0 0 40 20" fill="none">
                <polyline points="2,16 10,12 18,14 28,6 38,4" stroke="#3B6D11" stroke-width="1.5" fill="none"/>
            </svg>
        </div>
    </div>

</div>

@endsection
