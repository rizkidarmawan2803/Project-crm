import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import AppLayout from "../Layouts/AppLayout";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const BULAN_OPTIONS = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
];

const STATUS_OPTIONS = [
    { value: "Semua", label: "Semua Status" },
    { value: "Baru", label: "Baru" },
    { value: "Dihubungi", label: "Dihubungi" },
    { value: "Negosiasi", label: "Negosiasi" },
    { value: "Deal", label: "Deal" },
    { value: "Belum Tertarik", label: "Belum Tertarik" },
];

const STATUS_BADGE = {
    Baru: "bg-blue-100 text-blue-700",
    Dihubungi: "bg-purple-100 text-purple-700",
    Negosiasi: "bg-amber-100 text-amber-700",
    Deal: "bg-green-100 text-green-700",
    "Belum Tertarik": "bg-red-100 text-red-700",
};

const tahunOptions = () => {
    const tahun = [];
    const now = new Date().getFullYear();
    for (let y = now; y >= now - 5; y--) tahun.push(y);
    return tahun;
};

function selectCls() {
    return "border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] text-gray-700 outline-none focus:border-blue-500 bg-white";
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, badge, badgeClass, label, value, sub }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}
                >
                    {icon}
                </div>
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
                >
                    {badge}
                </span>
            </div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// FUNNEL ROW
// ─────────────────────────────────────────────────────────────
function FunnelRow({ label, value, percent, colorBar, colorText }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">{label}</span>
                <span className={`font-medium ${colorText}`}>{value}</span>
            </div>
            <div className="h-5 bg-gray-100 rounded">
                <div
                    className={`h-full rounded transition-all duration-700 ${colorBar}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// STATISTIK PROSPEK — dengan Chart.js
// ─────────────────────────────────────────────────────────────
function StatistikProspek() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        status: "Semua",
        bulan: "",
        tahun: String(new Date().getFullYear()),
    });

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/dashboard/statistik-prospek", {
                params: filter,
            });
            setData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!data?.per_bulan || !chartRef.current) return;

        const renderChart = () => {
            if (!window.Chart) {
                setTimeout(renderChart, 100);
                return;
            }

            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }

            const ctx = chartRef.current.getContext("2d");
            chartInstance.current = new window.Chart(ctx, {
                type: "bar",
                data: {
                    labels: data.per_bulan.map((b) => b.label),
                    datasets: [
                        {
                            label: "Prospek",
                            data: data.per_bulan.map((b) => b.total),
                            backgroundColor: "#378ADD",
                            borderRadius: 4,
                            borderSkipped: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` ${ctx.parsed.y} prospek`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                color: "#9ca3af",
                                font: { size: 11 },
                            },
                        },
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: "rgba(0,0,0,0.05)" },
                            ticks: {
                                stepSize: 1,
                                color: "#9ca3af",
                                font: { size: 11 },
                            },
                        },
                    },
                },
            });
        };

        renderChart();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data]);

    const breakdown = data?.breakdown || {};
    const total = data?.total || 0;

    const cards = [
        { label: "Total", value: total, text: "text-gray-700" },
        { label: "Baru", value: breakdown.baru || 0, text: "text-blue-600" },
        {
            label: "Dihubungi",
            value: breakdown.dihubungi || 0,
            text: "text-purple-600",
        },
        {
            label: "Negosiasi",
            value: breakdown.negosiasi || 0,
            text: "text-amber-600",
        },
        { label: "Deal", value: breakdown.deal || 0, text: "text-green-600" },
        {
            label: "Belum Tertarik",
            value: breakdown.belum_tertarik || 0,
            text: "text-red-600",
        },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5 shadow-sm">
            {/* Header + Filter */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-gray-800">
                    Statistik Prospek
                </h2>
                <div className="flex gap-2 flex-wrap">
                    <select
                        value={filter.status}
                        onChange={(e) =>
                            setFilter((f) => ({ ...f, status: e.target.value }))
                        }
                        className={selectCls()}
                    >
                        {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filter.bulan}
                        onChange={(e) =>
                            setFilter((f) => ({ ...f, bulan: e.target.value }))
                        }
                        className={selectCls()}
                    >
                        {BULAN_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filter.tahun}
                        onChange={(e) =>
                            setFilter((f) => ({ ...f, tahun: e.target.value }))
                        }
                        className={selectCls()}
                    >
                        {tahunOptions().map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                    Memuat statistik...
                </p>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
                        {cards.map((c) => (
                            <div
                                key={c.label}
                                className="bg-gray-50 rounded-lg p-3 text-center"
                            >
                                <p className="text-[11px] text-gray-400 mb-1">
                                    {c.label}
                                </p>
                                <p
                                    className={`text-[22px] font-bold ${c.text}`}
                                >
                                    {c.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bar Chart */}
                    <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">
                            Tren per Bulan ({filter.tahun})
                        </p>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "200px",
                            }}
                        >
                            <canvas ref={chartRef} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// MODAL DETAIL SALES
// ─────────────────────────────────────────────────────────────
function ModalDetailSales({ salesId, onClose, filterTanggal }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!salesId) return;
        axios
            .get(`/api/dashboard/detail-sales/${salesId}`, {
                params: filterTanggal,
            })
            .then((res) => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [salesId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-[15px] font-semibold text-gray-800">
                            {loading
                                ? "Memuat..."
                                : `Detail Sales: ${data?.sales?.nama}`}
                        </h3>
                        <p className="text-[12px] text-gray-400">
                            {data?.sales?.email}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>
                <div className="px-6 py-5">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center py-6">
                            Memuat data...
                        </p>
                    ) : (
                        <>
                            <div className="bg-blue-50 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                                <span className="text-[13px] text-blue-700 font-medium">
                                    Total Prospek
                                </span>
                                <span className="text-[22px] font-bold text-blue-700">
                                    {data?.total || 0}
                                </span>
                            </div>
                            <table className="w-full text-[13px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-3 py-2 text-left text-[11px] uppercase text-gray-400 font-medium">
                                            Status
                                        </th>
                                        <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">
                                            Total
                                        </th>
                                        <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">
                                            Persen
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.breakdown || []).map((row) => (
                                        <tr
                                            key={row.status}
                                            className="border-b border-gray-50 last:border-0"
                                        >
                                            <td className="px-3 py-2.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_BADGE[row.status] ?? "bg-gray-100 text-gray-600"}`}
                                                >
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-semibold text-gray-800">
                                                {row.total}
                                            </td>
                                            <td className="px-3 py-2.5 text-right text-gray-500">
                                                {row.persen}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
                <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// RANKING SALES
// ─────────────────────────────────────────────────────────────
function RankingSales() {
    const [data, setData] = useState({ terbaik: [], terburuk: [] });
    const [loading, setLoading] = useState(true);
    const [selectedSales, setSelectedSales] = useState(null);
    const [dateError, setDateError] = useState("");
    const [filter, setFilter] = useState({
        bulan: String(new Date().getMonth() + 1),
        tahun: String(new Date().getFullYear()),
        dari: "",
        sampai: "",
    });

    const loadData = useCallback(async () => {
        if (filter.dari && filter.sampai) {
            if (new Date(filter.dari) > new Date(filter.sampai)) {
                setDateError(
                    'Rentang tanggal tidak valid. "Dari" tidak boleh melebihi "Sampai".',
                );
                setData({ terbaik: [], terburuk: [] });
                setLoading(false);
                return;
            }
        }
        setDateError("");

        setLoading(true);
        try {
            const res = await axios.get("/api/dashboard/ranking-sales", {
                params: filter,
            });
            setData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const SalesTable = ({ title, rows, icon }) => {
        const safeRows = Array.isArray(rows) ? rows : Object.values(rows || {});

        return (
            <div className="flex-1 w-full overflow-hidden">
                <h3 className="text-[13px] font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    {icon} {title}
                </h3>
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto">
                    <table className="w-full text-[13px] min-w-[500px]">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left text-[11px] uppercase text-gray-400 font-medium">
                                    No
                                </th>
                                <th className="px-3 py-2 text-left text-[11px] uppercase text-gray-400 font-medium">
                                    Nama Sales
                                </th>
                                <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">
                                    Prospek
                                </th>
                                <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">
                                    Deal
                                </th>
                                <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">
                                    Rate
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeRows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-center py-10 bg-white"
                                    >
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <svg
                                                className="w-8 h-8 mb-2 text-gray-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                />
                                            </svg>
                                            <span className="text-[12px]">
                                                Tidak ada data pada periode ini
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                safeRows.map((s, i) => (
                                    <tr
                                        key={s.id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-white transition cursor-pointer"
                                        onClick={() => setSelectedSales(s.id)}
                                    >
                                        <td className="px-3 py-2.5 text-gray-400 font-mono">
                                            {i + 1}
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 flex-shrink-0">
                                                    {s.nama
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-blue-600 hover:underline">
                                                        {s.nama}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {s.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right text-gray-600">
                                            {s.total_prospek}
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            <span className="font-semibold text-green-600">
                                                {s.total_deal}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                                    s.conversion_rate >= 50
                                                        ? "bg-green-100 text-green-700"
                                                        : s.conversion_rate >=
                                                            25
                                                          ? "bg-amber-100 text-amber-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {s.conversion_rate}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-gray-800">
                    Ranking Performa Tim Sales
                </h2>

                <div className="flex flex-col items-end">
                    <div className="flex gap-2 flex-wrap">
                        <select
                            value={filter.bulan}
                            onChange={(e) =>
                                setFilter((f) => ({
                                    ...f,
                                    bulan: e.target.value,
                                }))
                            }
                            className={selectCls()}
                        >
                            {BULAN_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filter.tahun}
                            onChange={(e) =>
                                setFilter((f) => ({
                                    ...f,
                                    tahun: e.target.value,
                                }))
                            }
                            className={selectCls()}
                        >
                            {tahunOptions().map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            title="Tanggal Dari"
                            value={filter.dari}
                            onChange={(e) =>
                                setFilter((f) => ({
                                    ...f,
                                    dari: e.target.value,
                                }))
                            }
                            className={selectCls()}
                        />
                        <input
                            type="date"
                            title="Tanggal Sampai"
                            value={filter.sampai}
                            onChange={(e) =>
                                setFilter((f) => ({
                                    ...f,
                                    sampai: e.target.value,
                                }))
                            }
                            className={selectCls()}
                        />
                    </div>
                    {dateError && (
                        <p className="text-red-500 text-[11px] mt-1.5 font-medium flex items-center gap-1">
                            ⚠️ {dateError}
                        </p>
                    )}
                </div>
            </div>

            <p className="text-[11px] text-gray-400 mb-4">
                Klik nama sales untuk melihat detail breakdown prospek
            </p>

            {loading ? (
                <p className="text-sm text-gray-400 py-10 text-center">
                    Memuat ranking...
                </p>
            ) : (
                <div className="flex gap-5 flex-col lg:flex-row">
                    {/* PERBAIKAN EMOTE: Mengganti emoji piala dengan SVG Medal */}
                    <SalesTable
                        title="10 Sales Terbaik"
                        rows={data.terbaik || []}
                        icon={
                            <svg
                                className="w-4.5 h-4.5 text-amber-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499c.173-.439.817-.439.99 0l3.01 6.096 6.717.977c.48.07.672.657.325 1.002l-4.862 4.738 1.148 6.691c.083.486-.428.857-.86.63L12 20.354l-6.01 3.166c-.432.227-.943-.144-.86-.63l1.148-6.691-4.862-4.738c-.347-.345-.155-.933.325-1.002l6.717-.977 3.01-6.096z"
                                />
                            </svg>
                        }
                    />
                    {/* PERBAIKAN EMOTE: Mengganti emoji peringatan dengan SVG Alert Triangle */}
                    <SalesTable
                        title="10 Sales Terburuk"
                        rows={data.terburuk || []}
                        icon={
                            <svg
                                className="w-4.5 h-4.5 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                            </svg>
                        }
                    />
                </div>
            )}

            {selectedSales && (
                <ModalDetailSales
                    salesId={selectedSales}
                    filterTanggal={{
                        bulan: filter.bulan,
                        tahun: filter.tahun,
                        dari: filter.dari,
                        sampai: filter.sampai,
                    }}
                    onClose={() => setSelectedSales(null)}
                />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/dashboard")
            .then((res) => setDashboardData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <div className="p-10 text-center text-gray-400">
                    Memuat dashboard...
                </div>
            </AppLayout>
        );
    }

    const stats = dashboardData?.stats || {};
    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-[22px] font-semibold text-gray-900">
                    Dashboard CRM
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Ringkasan performa prospek dan pelanggan.
                </p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {/* 1. Total Target Market - Menggunakan Ikon SVG Group Tim (Biru) */}
                <StatCard
                    iconBg="bg-blue-50"
                    icon={
                        <svg
                            className="w-4.5 h-4.5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A4.63 4.63 0 0110.5 24c-1.286 0-2.47-.522-3.323-1.362M14.214 16.058A3.969 3.969 0 0012.5 15.75c-.83 0-1.612.253-2.264.687M14.214 16.058a3.971 3.971 0 01-.714 2.14M12.5 15.75a3.969 3.969 0 00-2.264.687M10.236 16.437A4.125 4.125 0 003 18.545a9.337 9.337 0 004.121.952 9.38 9.38 0 002.625-.372M10.236 16.437A4.124 4.124 0 0010.5 16.5c.243 0 .48-.022.712-.063M16.5 7.5a3 3 0 11-6 0 3 3 0 016 0zM18 11.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7.5 11.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                    }
                    badge="Total"
                    badgeClass="bg-blue-50 text-blue-700"
                    label="Total Target Market"
                    value={stats.total_target_market || 0}
                    sub="Seluruh prospek"
                />

                {/* 2. Prospek Aktif - Menggunakan Ikon SVG Siklus/Proses (Sian) */}
                <StatCard
                    iconBg="bg-cyan-50"
                    icon={
                        <svg
                            className="w-4.5 h-4.5 text-cyan-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                    }
                    badge="Aktif"
                    badgeClass="bg-cyan-50 text-cyan-700"
                    label="Prospek Aktif"
                    value={stats.prospek_aktif || 0}
                    sub="Sedang diproses"
                />

                {/* 3. Pelanggan Berhasil (Deal) - Menggunakan Ikon SVG Lencana Terverifikasi (Hijau) */}
                <StatCard
                    iconBg="bg-green-50"
                    icon={
                        <svg
                            className="w-4.5 h-4.5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                            />
                        </svg>
                    }
                    badge="Deal"
                    badgeClass="bg-green-50 text-green-700"
                    label="Pelanggan Berhasil"
                    value={stats.pelanggan_berhasil || 0}
                    sub="Berhasil dikonversi"
                />

                {/* 4. Tingkat Konversi - Menggunakan Ikon SVG Tren Grafik Naik (Oranye) */}
                <StatCard
                    iconBg="bg-orange-50"
                    icon={
                        <svg
                            className="w-4.5 h-4.5 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                            />
                        </svg>
                    }
                    badge="%"
                    badgeClass="bg-orange-50 text-orange-700"
                    label="Tingkat Konversi"
                    value={`${stats.conversion_rate || 0}%`}
                    sub="Persentase deal"
                />
            </div>

            <StatistikProspek />
            <RankingSales />
        </AppLayout>
    );
}
