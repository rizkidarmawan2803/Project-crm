<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'CRM Dashboard' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 font-sans antialiased">

<div class="flex min-h-screen">

    {{-- SIDEBAR --}}
    <aside class="fixed top-0 left-0 w-56 h-screen bg-white border-r border-gray-100 flex flex-col z-20">

        {{-- Logo --}}
        <div class="px-4 py-4 border-b border-gray-100">
            <div class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-fit">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect width="16" height="16" rx="3" fill="#1d6fa8"/>
                    <rect x="3" y="3" width="4" height="4" rx="1" fill="white"/>
                    <rect x="9" y="3" width="4" height="4" rx="1" fill="white"/>
                    <rect x="3" y="9" width="4" height="4" rx="1" fill="white"/>
                    <rect x="9" y="9" width="4" height="4" rx="1" fill="white"/>
                </svg>
                <span class="text-sm font-semibold text-gray-700">Logo</span>
            </div>
        </div>

        {{-- Nav Menu --}}
        <nav class="flex-1 px-2 py-3 space-y-0.5">
            <a href="{{ route('dashboard') }}"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                      {{ request()->routeIs('dashboard') ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800' }}">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="1" width="6" height="6" rx="1"/>
                    <rect x="9" y="1" width="6" height="6" rx="1"/>
                    <rect x="1" y="9" width="6" height="6" rx="1"/>
                    <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
                Dashboard
            </a>

            <a href="#"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <circle cx="6" cy="5" r="2.5"/>
                    <path d="M1 13.5c0-2.5 2-4.5 5-4.5"/>
                    <circle cx="12" cy="5" r="2" stroke-dasharray="1"/>
                    <path d="M11 9c1.5 0.3 3 1.5 3 4.5"/>
                </svg>
                Manajemen Pengguna
            </a>

            <a href="#"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="2" y1="4" x2="14" y2="4"/>
                    <line x1="2" y1="8" x2="14" y2="8"/>
                    <line x1="2" y1="12" x2="10" y2="12"/>
                </svg>
                Prospek
            </a>

            <a href="#"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <circle cx="8" cy="5.5" r="3"/>
                    <path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/>
                </svg>
                Pelanggan
            </a>
        </nav>

        {{-- Nav Bottom --}}
        <div class="px-2 py-3 border-t border-gray-100 space-y-0.5">
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <circle cx="8" cy="8" r="6"/>
                    <path d="M8 5v3.5l2 2"/>
                </svg>
                Pengaturan
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <circle cx="8" cy="8" r="6"/>
                    <path d="M8 6v1M8 10v0.5" stroke-linecap="round"/>
                </svg>
                Bantuan
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                    <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6"/>
                </svg>
                Keluar
            </a>
        </div>
    </aside>

    {{-- MAIN CONTENT --}}
    <main class="ml-56 flex-1 flex flex-col">

        {{-- Top Bar --}}
        <header class="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3">
            <div class="flex items-center gap-3">
                {{-- Search --}}
                <div class="flex-1 flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400">
                    <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="7" cy="7" r="5"/>
                        <path d="M11 11l3 3"/>
                    </svg>
                    Cari prospek, pasar, atau aktivitas...
                </div>

                {{-- Icon Buttons --}}
                <div class="flex items-center gap-2">
                    <button class="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <svg class="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                            <path d="M8 2a5 5 0 00-5 5v2L1.5 12h13L13 9V7a5 5 0 00-5-5zM6.5 13.5a1.5 1.5 0 003 0"/>
                        </svg>
                    </button>
                    <button class="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <svg class="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                            <circle cx="8" cy="8" r="6"/>
                            <path d="M8 6v1M8 10v0.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 cursor-pointer">
                        AD
                    </div>
                </div>
            </div>
        </header>

        {{-- Page Content --}}
        <div class="flex-1 p-6">
            @yield('content')
        </div>
    </main>

</div>

</body>
</html>
