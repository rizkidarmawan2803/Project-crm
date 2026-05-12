import React from "react";
import { useState } from "react";
import AppLayout from "../../Layouts/AppLayout";

const STATUS_TABS = [
    { key: "semua", label: "Semua" },
    { key: "baru", label: "Baru" },
    { key: "dihubungi", label: "Dihubungi" },
    { key: "negosiasi", label: "Negosiasi" },
    { key: "berhasil", label: "Deal" },
    { key: "gagal", label: "Ditolak" },
];

const BADGE = {
    baru: "bg-blue-100 text-blue-700",
    negosiasi: "bg-amber-100 text-amber-700",
    berhasil: "bg-green-100 text-green-700",
    gagal: "bg-red-100 text-red-700",
    dihubungi: "bg-purple-100 text-purple-700",
};

const BADGE_LABEL = {
    baru: "Baru",
    negosiasi: "Negosiasi",
    berhasil: "Berhasil",
    gagal: "Gagal",
    dihubungi: "Dihubungi",
};

const AVATAR_COLORS = [
    "#e8630a",
    "#7c3aed",
    "#1d4ed8",
    "#0f766e",
    "#be185d",
    "#0369a1",
];

export default function ProspekList({
    prospeks = [],
    onTambahKlien = () => {},
    onViewDetail = () => {},
}) {
    const [activeTab, setActiveTab] = useState("semua");

    const filtered =
        activeTab === "semua"
            ? prospeks
            : prospeks.filter((p) => p.status === activeTab);

    return (
        <AppLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[17px] font-semibold text-gray-900">
                        Manajemen Prospek
                    </h1>

                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
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
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>
                            Impor CSV
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

                {/* Tabs */}
                <div className="flex gap-1.5 mb-4 flex-wrap">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-1 rounded-full text-[12.5px] border transition ${
                                activeTab === tab.key
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
                                {filtered.length > 0 ? (
                                    filtered.map((p, i) => (
                                        <tr
                                            key={p.id || i}
                                            className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition"
                                        >
                                            {/* Nama */}
                                            <td className="px-3.5 py-2.5">
                                                <div
                                                    className="font-medium text-blue-700 cursor-pointer hover:underline"
                                                    onClick={() =>
                                                        onViewDetail(p)
                                                    }
                                                >
                                                    {p.nama || "-"}
                                                </div>

                                                <div className="text-[12px] text-gray-500 mt-0.5">
                                                    {p.perusahaan || "-"}
                                                </div>
                                            </td>

                                            {/* Kontak */}
                                            <td className="px-3.5 py-2.5">
                                                <div>{p.email || "-"}</div>

                                                <div className="text-[12px] text-gray-500 mt-0.5">
                                                    {p.telepon || "-"}
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
                                                    className={`px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${
                                                        BADGE[p.status] ||
                                                        "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {BADGE_LABEL[p.status] ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* Domisili */}
                                            <td className="px-3.5 py-2.5 text-gray-700">
                                                {p.domisili || "-"}
                                            </td>

                                            {/* PIC */}
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
                                                        {(p.pic || "NA")
                                                            .split(" ")
                                                            .map((w) => w[0])
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </div>

                                                    <span>{p.pic || "-"}</span>
                                                </div>
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-3.5 py-2.5 text-gray-600 whitespace-nowrap">
                                                {p.tgl_dibuat || "-"}
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
                                                    <button className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-green-600 hover:bg-gray-50 transition">
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
                                                    <button className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-red-600 hover:bg-gray-50 transition">
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                        <span className="text-[12px] text-gray-500">
                            Menampilkan {filtered.length} dari {prospeks.length}{" "}
                            Leads
                        </span>

                        <div className="flex gap-1">
                            {["‹", "1", "2", "3", "...", "129", "›"].map(
                                (p, i) => (
                                    <button
                                        key={i}
                                        className={`w-7 h-7 rounded-md text-[12.5px] border flex items-center justify-center transition ${
                                            p === "1"
                                                ? "bg-blue-700 text-white border-blue-700"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-600"
                                        } ${
                                            p === "..."
                                                ? "border-none bg-transparent cursor-default"
                                                : ""
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
