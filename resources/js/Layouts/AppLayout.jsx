import React from 'react';
import { Link, usePage } from '@inertiajs/react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1"/>
                <rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
            </svg>
        ),
    },
    {
        label: 'Manajemen Pengguna',
        href: '/pengguna',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="6" cy="5" r="2.5"/>
                <path d="M1 13.5c0-2.5 2-4.5 5-4.5"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M11 9c1.5 0.3 3 1.5 3 4.5"/>
            </svg>
        ),
    },
    {
        label: 'Prospek',
        href: '/prospek',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="4" x2="14" y2="4"/>
                <line x1="2" y1="8" x2="14" y2="8"/>
                <line x1="2" y1="12" x2="10" y2="12"/>
            </svg>
        ),
    },
    {
        label: 'Pelanggan',
        href: '/pelanggan',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="8" cy="5.5" r="3"/>
                <path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/>
            </svg>
        ),
    },
];

const bottomItems = [
    {
        label: 'Pengaturan',
        href: '/pengaturan',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="8" cy="8" r="2.5"/>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/>
            </svg>
        ),
    },
    {
        label: 'Bantuan',
        href: '/bantuan',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="8" cy="8" r="6"/>
                <path d="M6 6c0-1.1.9-2 2-2s2 .9 2 2c0 1-1 1.5-2 2v1" strokeLinecap="round"/>
                <circle cx="8" cy="11.5" r="0.5" fill="currentColor"/>
            </svg>
        ),
    },
    {
        label: 'Keluar',
        href: '/logout',
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6"/>
            </svg>
        ),
    },
];

export default function AppLayout({ children }) {
    const { url } = usePage();

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* SIDEBAR */}
            <aside className="fixed top-0 left-0 w-56 h-screen bg-white border-r border-gray-100 flex flex-col z-20">

                {/* Logo */}
                <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-fit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect width="16" height="16" rx="3" fill="#1d6fa8"/>
                            <rect x="3" y="3" width="4" height="4" rx="1" fill="white"/>
                            <rect x="9" y="3" width="4" height="4" rx="1" fill="white"/>
                            <rect x="3" y="9" width="4" height="4" rx="1" fill="white"/>
                            <rect x="9" y="9" width="4" height="4" rx="1" fill="white"/>
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">Logo</span>
                    </div>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 px-2 py-3 space-y-0.5">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                                ${url.startsWith(item.href)
                                    ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Nav Bottom */}
                <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
                    {bottomItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>
            </aside>

            {/* MAIN */}
            <main className="ml-56 flex-1 flex flex-col">

                {/* Topbar */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="7" cy="7" r="5"/>
                                <path d="M11 11l3 3"/>
                            </svg>
                            Cari prospek, pasar, atau aktivitas...
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                                    <path d="M8 2a5 5 0 00-5 5v2L1.5 12h13L13 9V7a5 5 0 00-5-5zM6.5 13.5a1.5 1.5 0 003 0"/>
                                </svg>
                            </button>
                            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                                    <circle cx="8" cy="8" r="6"/>
                                    <path d="M8 6v1M8 10v0.5" strokeLinecap="round"/>
                                </svg>
                            </button>
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 cursor-pointer">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
