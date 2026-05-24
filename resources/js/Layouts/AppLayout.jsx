import React, { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";

// ─── Nav Items ADMIN ──────────────────────────────────────────
const adminNavItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
        ),
    },
    {
        label: "Manajemen Pengguna",
        href: "/pengguna",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
        ),
    },
    {
        label: "Prospek",
        href: "/prospek",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
        ),
    },
    {
        label: "Pelanggan",
        href: "/pelanggan",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
        ),
    },
];

// ─── Nav Items SALES ──────────────────────────────────────────
const salesNavItems = [
    {
        label: "Prospek",
        href: "/prospek",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
        ),
    },
    {
        label: "Pelanggan",
        href: "/pelanggan",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
        ),
    },
];

// ─── Bottom Items ─────────────────────────────────────────────
const bottomItems = [
    {
        label: "Pengaturan",
        href: "/pengaturan",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
        ),
    },
    {
        label: "Keluar",
        href: "/logout",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
        ),
    },
];

export default function AppLayout({ children }) {
    const { url, props } = usePage();
    const user           = props.auth?.user;
    const isAdmin        = user?.is_admin == 1;

    // Pilih nav items berdasarkan role
    const navItems = isAdmin ? adminNavItems : salesNavItems;

    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`.toUpperCase();
    const role     = isAdmin ? "Administrator" : "Sales";

    return (
        <div className="flex min-h-screen bg-gray-50 text-[15px]">
            {/* SIDEBAR */}
            <aside className="fixed top-0 left-0 w-56 h-screen bg-white border-r border-gray-100 flex flex-col z-20">

                {/* Logo */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <img src="/images/logo.png" alt="Disty CRM" className="h-8 w-auto object-contain"/>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 px-2 py-3 space-y-0.5">
                    {navItems.map((item) => {
                        const active = url === item.href || url.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-150
                                    ${active
                                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Nav */}
                <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
                    {bottomItems.map((item) =>
                        item.label === "Keluar" ? (
                            <button
                                key={item.href}
                                type="button"
                                onClick={() => router.post("/logout")}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150 text-left"
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        )
                    )}
                </div>
            </aside>

            {/* MAIN */}
            <main className="ml-56 flex-1 flex flex-col">

                {/* TOPBAR */}
                <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3">
                    <div className="flex items-center gap-3">

                        {/* Search */}
                        <div className="flex-1 relative max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari prospek, pasar, atau aktivitas..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-auto">
                            {/* Notifikasi */}
                            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/>
                                </svg>
                            </button>

                            {/* Bantuan */}
                            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01"/>
                                </svg>
                            </button>

                            <div className="w-px h-6 bg-gray-200 mx-1"/>

                            {/* PROFILE DROPDOWN */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setOpenProfile(!openProfile)}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[13px] font-semibold text-blue-700">
                                        {initials}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-[13px] font-medium text-gray-800 leading-tight">
                                            {user?.first_name} {user?.last_name}
                                        </p>
                                        <p className="text-[11px] text-gray-400 leading-tight">{role}</p>
                                    </div>
                                    <svg
                                        className={`w-3.5 h-3.5 text-gray-400 transition-transform ${openProfile ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>

                                {/* DROPDOWN */}
                                {openProfile && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                        <div className="px-4 py-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <h3 className="text-[14px] font-semibold text-gray-800">
                                                        {user?.first_name} {user?.last_name}
                                                    </h3>
                                                    <p className="text-[12px] text-gray-500">{user?.email}</p>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                                        isAdmin ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                                                    }`}>
                                                        {role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                                Profil Saya
                                            </button>

                                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                                Pengaturan
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 p-2">
                                            <button
                                                onClick={() => router.post("/logout")}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-600 hover:bg-red-50"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                                                </svg>
                                                Keluar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="flex-1 py-7 px-8">
                    <div className="max-w-6xl mx-auto">{children}</div>
                </div>
            </main>
        </div>
    );
}