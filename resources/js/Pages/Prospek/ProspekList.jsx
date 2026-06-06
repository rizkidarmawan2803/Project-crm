import React, { useState } from "react";
import AppLayout from "../../Layouts/AppLayout";

const STATUS_TABS = [
    { key: "Semua", label: "Semua" },
    { key: "Baru", label: "Baru" },
    { key: "Dihubungi", label: "Dihubungi" },
    { key: "Negosiasi", label: "Negosiasi" },
    { key: "Deal", label: "Deal" },
    { key: "Belum Tertarik", label: "Belum Tertarik" },
];

const BADGE = {
    Baru: "bg-blue-100 text-blue-700",
    Dihubungi: "bg-purple-100 text-purple-700",
    Negosiasi: "bg-amber-100 text-amber-700",
    Deal: "bg-green-100 text-green-700",
    "Belum Tertarik": "bg-red-100 text-red-700",
};

const AVATAR_COLORS = [
    "#e8630a",
    "#7c3aed",
    "#1d4ed8",
    "#0f766e",
    "#be185d",
    "#0369a1",
];

const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export default function ProspekList({
    prospeks = [],
    summary = {},
    pagination = null,
    activeFilter = "Semua",
    loading = false,
    search = "",
    onSearchChange = () => {},
    onFilterChange = () => {},
    onPageChange = () => {},
    onTambahKlien = () => {},
    onViewDetail = () => {},
    onDelete = () => {},
    onUpdate = () => {},
}) {
    async function handleExportCsv() {
        try {
            const response = await fetch("/api/prospek/export/csv", {
                method: "GET",
                credentials: "same-origin",
            });

            if (!response.ok) {
                throw new Error("Gagal export CSV");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "prospek.csv";

            document.body.appendChild(a);
            a.click();

            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    }

    async function handleExportExcel() {
        try {
            const response = await fetch("/api/prospek/export/excel", {
                method: "GET",
                credentials: "same-origin",
            });

            if (!response.ok) {
                throw new Error("Gagal export Excel");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "prospek.xlsx";

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <AppLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[17px] font-semibold text-gray-900">
                        Manajemen Prospek
                    </h1>

                    <div className="flex gap-2">
                        <button
                            onClick={handleExportCsv}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                        >
                            Export CSV
                        </button>

                        <button
                            onClick={handleExportExcel}
                            className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
                        >
                            Export Excel
                        </button>

                        <button
                            onClick={onTambahKlien}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-blue-700 text-white border border-blue-700 hover:bg-blue-800 transition"
                        >
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                            Tambah Klien
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Cari nama client, perusahaan, atau email..."
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Tabs Filter */}
                <div className="flex gap-1.5 mb-4 flex-wrap">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onFilterChange(tab.key)}
                            className={`px-4 py-1 rounded-full text-[12.5px] border transition ${
                                activeFilter === tab.key
                                    ? "bg-blue-700 text-white border-blue-700"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] min-w-[860px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {[
                                        "Nama / Perusahaan",
                                        "Kontak",
                                        "Sumber",
                                        "Status",
                                        "Domisili",
                                        "Sales PIC",
                                        "Tgl Dibuat",
                                        "Aksi",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-3.5 py-2.5 text-left text-[11.5px] uppercase tracking-wide text-gray-500 font-medium whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-center py-10 text-gray-400 text-[13px]"
                                        >
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : prospeks.length > 0 ? (
                                    prospeks.map((p, i) => (
                                        <tr
                                            key={p.id || i}
                                            className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition"
                                        >
                                            {/* Nama / Perusahaan */}
                                            <td className="px-3.5 py-2.5">
                                                <div
                                                    className="font-medium text-blue-700 cursor-pointer hover:underline"
                                                    onClick={() =>
                                                        onViewDetail(p)
                                                    }
                                                >
                                                    {p.nama_client || "-"}
                                                </div>
                                                <div className="text-[12px] text-gray-500 mt-0.5">
                                                    {p.company_name || "-"}
                                                </div>
                                            </td>

                                            {/* Kontak */}
                                            <td className="px-3.5 py-2.5">
                                                <div>{p.email || "-"}</div>
                                                <div className="text-[12px] text-gray-500 mt-0.5">
                                                    {p.phone || "-"}
                                                </div>
                                            </td>

                                            {/* Sumber */}
                                            <td className="px-3.5 py-2.5">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11.5px]">
                                                    {p.sumber || "-"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3.5 py-2.5">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${BADGE[p.lead_status] || "bg-gray-100 text-gray-600"}`}
                                                >
                                                    {p.lead_status || "-"}
                                                </span>
                                            </td>

                                            {/* Domisili */}
                                            <td className="px-3.5 py-2.5 text-gray-700">
                                                {p.domisili || "-"}
                                            </td>

                                            {/* Sales PIC */}
                                            <td className="px-3.5 py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                    <div
                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white flex-shrink-0"
                                                        style={{
                                                            background:
                                                                AVATAR_COLORS[
                                                                    i %
                                                                        AVATAR_COLORS.length
                                                                ],
                                                        }}
                                                    >
                                                        {p.sales
                                                            ? `${p.sales.first_name?.[0] || ""}${p.sales.last_name?.[0] || ""}`
                                                            : "N"}
                                                    </div>
                                                    <span>
                                                        {p.sales
                                                            ? `${p.sales.first_name} ${p.sales.last_name || ""}`
                                                            : "-"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">
                                                {formatTanggal(p.created_at)}
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-3.5 py-2.5">
                                                <div className="flex gap-1.5">
                                                    {/* View */}
                                                    <button
                                                        onClick={() =>
                                                            onViewDetail(p)
                                                        }
                                                        className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-blue-600 hover:bg-gray-50 transition"
                                                    >
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {/* Edit */}
                                                    {/* Edit */}
                                                    <button
                                                        onClick={() =>
                                                            onUpdate(p)
                                                        }
                                                        className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-green-600 hover:bg-gray-50 transition"
                                                        title="Update Prospek"
                                                    >
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() =>
                                                            onDelete(p.id)
                                                        }
                                                        className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-red-600 hover:bg-gray-50 transition"
                                                    >
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-center py-10 text-gray-400 text-[13px]"
                                        >
                                            Tidak ada data prospek.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer & Pagination */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                        <span className="text-[12px] text-gray-500">
                            Menampilkan {prospeks.length} dari{" "}
                            {pagination?.total || 0} Leads
                        </span>

                        {pagination && pagination.last_page > 1 && (
                            <div className="flex gap-1">
                                {/* Prev */}
                                <button
                                    onClick={() =>
                                        onPageChange(
                                            pagination.current_page - 1,
                                        )
                                    }
                                    disabled={!pagination.prev_page_url}
                                    className="w-7 h-7 rounded-md text-[12.5px] border flex items-center justify-center bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                                >
                                    ‹
                                </button>

                                {/* Page Numbers */}
                                {Array.from(
                                    { length: pagination.last_page },
                                    (_, i) => i + 1,
                                )
                                    .filter(
                                        (p) =>
                                            p === 1 ||
                                            p === pagination.last_page ||
                                            Math.abs(
                                                p - pagination.current_page,
                                            ) <= 1,
                                    )
                                    .map((p, idx, arr) => (
                                        <React.Fragment key={p}>
                                            {idx > 0 &&
                                                arr[idx - 1] !== p - 1 && (
                                                    <span className="w-7 h-7 flex items-center justify-center text-gray-400 text-[12px]">
                                                        ...
                                                    </span>
                                                )}
                                            <button
                                                onClick={() => onPageChange(p)}
                                                className={`w-7 h-7 rounded-md text-[12.5px] border flex items-center justify-center transition ${
                                                    p ===
                                                    pagination.current_page
                                                        ? "bg-blue-700 text-white border-blue-700"
                                                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        </React.Fragment>
                                    ))}

                                {/* Next */}
                                <button
                                    onClick={() =>
                                        onPageChange(
                                            pagination.current_page + 1,
                                        )
                                    }
                                    disabled={!pagination.next_page_url}
                                    className="w-7 h-7 rounded-md text-[12.5px] border flex items-center justify-center bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
