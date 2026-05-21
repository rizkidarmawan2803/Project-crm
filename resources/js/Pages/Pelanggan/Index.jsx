// ─────────────────────────────────────────────────────────────────────────────
// IMPORT
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";

// ─────────────────────────────────────────────────────────────────────────────
// ICON HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function IconWallet({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
        </svg>
    );
}

function IconChartBar({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
        </svg>
    );
}

function IconGlobe({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 12a8 8 0 01-8 8m8-8a8 8 0 00-8-8m8 8H4m8 8a8 8 0 01-8-8m8 8c1.657 0 3-3.582 3-8s-1.343-8-3-8m0 16c-1.657 0-3-3.582-3-8s1.343-8 3-8"
            />
        </svg>
    );
}

function IconTrendUp({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
        </svg>
    );
}

function IconTrendStable({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
        </svg>
    );
}

function IconFilter({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
        </svg>
    );
}

function IconDots({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
        </svg>
    );
}

function IconChevronLeft({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
    );
}

function IconChevronRight({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
            />
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const STAT_ICON_MAP = {
    wallet: {
        Component: IconWallet,
        bg: "bg-blue-50",
        text: "text-blue-600",
    },
    "chart-bar": {
        Component: IconChartBar,
        bg: "bg-green-50",
        text: "text-green-600",
    },
    globe: {
        Component: IconGlobe,
        bg: "bg-orange-50",
        text: "text-orange-500",
    },
};

const AVATAR_COLOR_MAP = {
    blue: "bg-blue-600",
    violet: "bg-violet-600",
    orange: "bg-orange-500",
    teal: "bg-teal-600",
    rose: "bg-rose-500",
    green: "bg-green-600",
    gray: "bg-gray-500",
};

const STATUS_STYLE_MAP = {
    Aktif: "bg-green-50 text-green-700",
    "At Risk": "bg-orange-50 text-orange-600",
    Nonaktif: "bg-gray-100 text-gray-500",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ stat }) {
    const iconDef = STAT_ICON_MAP[stat.icon] ?? STAT_ICON_MAP.globe;
    const { Component: IconComp } = iconDef;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start justify-between">
            <div>
                <p className="text-[12px] text-gray-400 mb-1.5">{stat.label}</p>
                <p className="text-[26px] font-medium text-gray-900 mb-1.5 leading-none">
                    {stat.value}
                </p>
                <div
                    className={`flex items-center gap-1 text-[12px] ${
                        stat.trend === "up"
                            ? "text-green-600"
                            : "text-gray-400"
                    }`}
                >
                    {stat.trend === "up" ? (
                        <IconTrendUp className="w-3 h-3" />
                    ) : (
                        <IconTrendStable className="w-3 h-3" />
                    )}
                    {stat.change}
                </div>
            </div>

            <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconDef.bg} ${iconDef.text}`}
            >
                <IconComp className="w-[18px] h-[18px]" />
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                STATUS_STYLE_MAP[status] ??
                "bg-gray-100 text-gray-500"
            }`}
        >
            {status}
        </span>
    );
}

function ManagerCell({ inisial, manager, avatarColor }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 ${
                    AVATAR_COLOR_MAP[avatarColor] ?? "bg-gray-500"
                }`}
            >
                {inisial}
            </div>
            <span className="text-[13px] text-gray-700 truncate">
                {manager}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Pelanggan({
    stats: initialStats = [],
    pelanggan: initialPelanggan = [],
    totalPelanggan: initialTotalPelanggan = 0,
}) {
    const [page, setPage] = useState(1);

    // State API
    const [stats, setStats] = useState(initialStats);
    const [pelanggan, setPelanggan] = useState(initialPelanggan);
    const [totalPelanggan, setTotalPelanggan] =
        useState(initialTotalPelanggan);
    const [loading, setLoading] = useState(initialPelanggan.length === 0);

    const perPage = 10;

    // Ambil data dari API
    useEffect(() => {
        fetch("/api/pelanggan", {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Gagal memuat data pelanggan.");
                }
                return res.json();
            })
            .then((json) => {
                setStats(json.stats || []);
                setPelanggan(json.pelanggan || []);
                setTotalPelanggan(json.totalPelanggan || 0);
            })
            .catch((error) => {
                console.error("Error loading pelanggan:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Total halaman
    const totalPages = Math.max(
        1,
        Math.ceil(totalPelanggan / perPage)
    );

    return (
        <AppLayout>
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-[19px] font-medium text-gray-900">
                    Pelanggan
                </h1>
                <p className="text-[13px] text-gray-500 mt-0.5">
                    Kelola akun dan kemitraan perusahaan bernilai tinggi Anda.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                {stats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-800">
                        Daftar Klien
                    </span>

                    <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <IconFilter className="w-[18px] h-[18px] text-gray-400" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <IconDots className="w-[18px] h-[18px] text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {[
                                    "Nama Perusahaan",
                                    "Kontak",
                                    "Account Manager Assigned",
                                    "Tanggal Bergabung",
                                    "Status Akun",
                                ].map((col) => (
                                    <th
                                        key={col}
                                        className="px-[18px] py-2.5 text-[12px] font-medium text-gray-400"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-[18px] py-10 text-center text-[13px] text-gray-400"
                                    >
                                        Memuat data pelanggan...
                                    </td>
                                </tr>
                            ) : pelanggan.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-[18px] py-10 text-center text-[13px] text-gray-400"
                                    >
                                        Belum ada data pelanggan.
                                    </td>
                                </tr>
                            ) : (
                                pelanggan.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        onClick={() => router.visit(`/pelanggan/${row.id}`)}
                                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                                            i < pelanggan.length - 1
                                                ? "border-b border-gray-50"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-[18px] py-3 text-[13.5px] text-gray-800 font-medium">
                                            {row.perusahaan}
                                        </td>

                                        <td className="px-[18px] py-3 text-[13px] text-gray-500">
                                            {row.kontak}
                                        </td>

                                        <td className="px-[18px] py-3">
                                            <ManagerCell
                                                inisial={
                                                    row.nama_client
                                                     ? row.nama_client
                                                           .split(" ")
                                                           .map((word) => word.charAt(0))
                                                           .slice(0, 2)
                                                           .join("")
                                                           .toUpperCase()
                                                           : "NA"
                                                }           
                                                manager={
                                                    row.nama_client ||
                                                    "Tidak ada"
                                                }
                                                avatarColor={
                                                    row.avatarColor ||
                                                    "gray"
                                                }
                                            />
                                        </td>

                                        <td className="px-[18px] py-3 text-[13px] text-gray-500">
                                            {row.tanggal}
                                        </td>

                                        <td className="px-[18px] py-3">
                                            <StatusBadge
                                                status={
                                                    row.status ||
                                                    "Aktif"
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-[18px] py-2.5 border-t border-gray-100">
                    <span className="text-[12px] text-gray-400">
                        Menampilkan {pelanggan.length} dari {totalPelanggan} pelanggan
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() =>
                                setPage((p) => Math.max(1, p - 1))
                            }
                            disabled={page === 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                        >
                            <IconChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                        </button>

                        <span className="text-[12px] text-gray-400 px-1.5">
                            {page} / {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={page === totalPages}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                        >
                            <IconChevronRight className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}