import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import AppLayout from "../Layouts/AppLayout";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const BULAN_OPTIONS = [
    { value: '', label: 'Semua Bulan' },
    { value: '1', label: 'Januari' },  { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },      { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },     { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },{ value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },{ value: '12', label: 'Desember' },
];

const STATUS_OPTIONS = [
    { value: 'Semua', label: 'Semua Status' },
    { value: 'Baru', label: 'Baru' },
    { value: 'Dihubungi', label: 'Dihubungi' },
    { value: 'Negosiasi', label: 'Negosiasi' },
    { value: 'Deal', label: 'Deal' },
    { value: 'Ditolak', label: 'Ditolak' },
];

const STATUS_BADGE = {
    Baru:      'bg-blue-100 text-blue-700',
    Dihubungi: 'bg-purple-100 text-purple-700',
    Negosiasi: 'bg-amber-100 text-amber-700',
    Deal:      'bg-green-100 text-green-700',
    Ditolak:   'bg-red-100 text-red-700',
};

const tahunOptions = () => {
    const tahun = [];
    const now = new Date().getFullYear();
    for (let y = now; y >= now - 5; y--) tahun.push(y);
    return tahun;
};

function selectCls() {
    return 'border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] text-gray-700 outline-none focus:border-blue-500 bg-white';
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, badge, badgeClass, label, value, sub }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>{icon}</div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>{badge}</span>
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
                <div className={`h-full rounded transition-all duration-700 ${colorBar}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// STATISTIK PROSPEK — dengan Chart.js
// ─────────────────────────────────────────────────────────────
function StatistikProspek() {
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter]   = useState({
        status: 'Semua',
        bulan:  '',
        tahun:  String(new Date().getFullYear()),
    });

    const chartRef      = useRef(null);
    const chartInstance = useRef(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/dashboard/statistik-prospek', { params: filter });
            setData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { loadData(); }, [loadData]);

    // Render / update chart setiap kali data berubah
    useEffect(() => {
        if (!data?.per_bulan || !chartRef.current) return;

        // Tunggu Chart.js tersedia (dimuat via CDN di blade)
        const renderChart = () => {
            if (!window.Chart) {
                setTimeout(renderChart, 100);
                return;
            }

            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new window.Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.per_bulan.map(b => b.label),
                    datasets: [{
                        label: 'Prospek',
                        data: data.per_bulan.map(b => b.total),
                        backgroundColor: '#378ADD',
                        borderRadius: 4,
                        borderSkipped: false,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` ${ctx.parsed.y} prospek`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                color: '#9ca3af',
                                font: { size: 11 }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: 'rgba(0,0,0,0.05)' },
                            ticks: {
                                stepSize: 1,
                                color: '#9ca3af',
                                font: { size: 11 }
                            }
                        }
                    }
                }
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
    const total     = data?.total || 0;

    const cards = [
        { label: 'Total',     value: total,                    text: 'text-gray-700' },
        { label: 'Baru',      value: breakdown.baru      || 0, text: 'text-blue-600' },
        { label: 'Dihubungi', value: breakdown.dihubungi || 0, text: 'text-purple-600' },
        { label: 'Negosiasi', value: breakdown.negosiasi || 0, text: 'text-amber-600' },
        { label: 'Deal',      value: breakdown.deal      || 0, text: 'text-green-600' },
        { label: 'Ditolak',   value: breakdown.ditolak   || 0, text: 'text-red-600' },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
            {/* Header + Filter */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-gray-800">Statistik</h2>
                <div className="flex gap-2 flex-wrap">
                    <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className={selectCls()}>
                        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select value={filter.bulan} onChange={e => setFilter(f => ({ ...f, bulan: e.target.value }))} className={selectCls()}>
                        {BULAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select value={filter.tahun} onChange={e => setFilter(f => ({ ...f, tahun: e.target.value }))} className={selectCls()}>
                        {tahunOptions().map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">Memuat statistik...</p>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
                        {cards.map((c) => (
                            <div key={c.label} className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-[11px] text-gray-400 mb-1">{c.label}</p>
                                <p className={`text-[22px] font-bold ${c.text}`}>{c.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Bar Chart */}
                    <div>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-3">
                            Tren per Bulan ({filter.tahun})
                        </p>
                        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
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
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!salesId) return;
        axios.get(`/api/dashboard/detail-sales/${salesId}`, { params: filterTanggal })
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [salesId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-[15px] font-semibold text-gray-800">
                            {loading ? 'Memuat...' : `Detail Sales: ${data?.sales?.nama}`}
                        </h3>
                        <p className="text-[12px] text-gray-400">{data?.sales?.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
                </div>
                <div className="px-6 py-5">
                    {loading ? (
                        <p className="text-sm text-gray-400 text-center py-6">Memuat data...</p>
                    ) : (
                        <>
                            <div className="bg-blue-50 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                                <span className="text-[13px] text-blue-700 font-medium">Total Prospek</span>
                                <span className="text-[22px] font-bold text-blue-700">{data?.total || 0}</span>
                            </div>
                            <table className="w-full text-[13px]">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-3 py-2 text-left text-[11px] uppercase text-gray-400 font-medium">Status</th>
                                        <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">Total</th>
                                        <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">Persen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.breakdown || []).map((row) => (
                                        <tr key={row.status} className="border-b border-gray-50 last:border-0">
                                            <td className="px-3 py-2.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_BADGE[row.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-semibold text-gray-800">{row.total}</td>
                                            <td className="px-3 py-2.5 text-right text-gray-500">{row.persen}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
                <div className="px-6 py-3 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
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
    const [data, setData]                   = useState({ terbaik: [], terburuk: [] });
    const [loading, setLoading]             = useState(true);
    const [selectedSales, setSelectedSales] = useState(null);
    const [filter, setFilter]               = useState({
        bulan:  String(new Date().getMonth() + 1),
        tahun:  String(new Date().getFullYear()),
        dari:   '',
        sampai: '',
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/dashboard/ranking-sales', { params: filter });
            setData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { loadData(); }, [loadData]);

    const SalesTable = ({ title, rows, icon }) => (
        <div className="flex-1">
            <h3 className="text-[13px] font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <span>{icon}</span> {title}
            </h3>
            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <table className="w-full text-[13px]">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-3 py-2 text-left text-[11px] uppercase text-gray-400 font-medium">No</th>
                            <th className="px-3 py-2 text-left text-[11px] uppercase text-gray-400 font-medium">Nama Sales</th>
                            <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">Prospek</th>
                            <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">Deal</th>
                            <th className="px-3 py-2 text-right text-[11px] uppercase text-gray-400 font-medium">Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400 text-[12px]">Tidak ada data</td>
                            </tr>
                        ) : rows.map((s, i) => (
                            <tr key={s.id}
                                className="border-b border-gray-100 last:border-0 hover:bg-white transition cursor-pointer"
                                onClick={() => setSelectedSales(s.id)}>
                                <td className="px-3 py-2.5 text-gray-400 font-mono">{i + 1}</td>
                                <td className="px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 flex-shrink-0">
                                            {s.nama?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-600 hover:underline">{s.nama}</p>
                                            <p className="text-[11px] text-gray-400">{s.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-2.5 text-right text-gray-600">{s.total_prospek}</td>
                                <td className="px-3 py-2.5 text-right">
                                    <span className="font-semibold text-green-600">{s.total_deal}</span>
                                </td>
                                <td className="px-3 py-2.5 text-right">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                        s.conversion_rate >= 50 ? 'bg-green-100 text-green-700' :
                                        s.conversion_rate >= 25 ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {s.conversion_rate}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-gray-800">Ranking Sales</h2>
                <div className="flex gap-2 flex-wrap">
                    <select value={filter.bulan} onChange={e => setFilter(f => ({ ...f, bulan: e.target.value }))} className={selectCls()}>
                        {BULAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <select value={filter.tahun} onChange={e => setFilter(f => ({ ...f, tahun: e.target.value }))} className={selectCls()}>
                        {tahunOptions().map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <input type="date" value={filter.dari} onChange={e => setFilter(f => ({ ...f, dari: e.target.value }))} className={selectCls()} />
                    <input type="date" value={filter.sampai} onChange={e => setFilter(f => ({ ...f, sampai: e.target.value }))} className={selectCls()} />
                </div>
            </div>

            <p className="text-[11px] text-gray-400 mb-4">Klik nama sales untuk melihat detail breakdown prospek</p>

            {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">Memuat ranking...</p>
            ) : (
                <div className="flex gap-5 flex-wrap md:flex-nowrap">
                    <SalesTable title="10 Sales Terbaik"  rows={data.terbaik  || []} icon="🏆" />
                    <SalesTable title="10 Sales Terburuk" rows={data.terburuk || []} icon="⚠️" />
                </div>
            )}

            {selectedSales && (
                <ModalDetailSales
                    salesId={selectedSales}
                    filterTanggal={{ bulan: filter.bulan, tahun: filter.tahun, dari: filter.dari, sampai: filter.sampai }}
                    onClose={() => setSelectedSales(null)}
                />
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// ACTIVITY ITEM
// ─────────────────────────────────────────────────────────────
const activityIcons = {
    WA:    <svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M8 2C5 2 3 4 3 7c0 1.5.5 2.8 1.3 3.7L3 14l3.5-1c.5.2 1 .3 1.5.3 3 0 5-2 5-5S11 2 8 2z"/></svg>,
    Email: <svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 4h12v9H2z"/><path d="M2 4l6 5 6-5"/></svg>,
    Call:  <svg className="w-4 h-4 text-purple-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 2h3l1.5 3.5-1.8 1.1a9 9 0 004.7 4.7l1.1-1.8L15 11v3a1 1 0 01-1 1A13 13 0 012 3a1 1 0 011-1z"/></svg>,
};

function ActivityItem({ channel, nama_client, company_name, contacted_at }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-50 border border-gray-100">
                {activityIcons[channel] ?? activityIcons.Call}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{nama_client || '-'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{company_name || '-'} · via {channel}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
                {contacted_at ? new Date(contacted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading]             = useState(true);

    useEffect(() => {
        axios.get('/api/dashboard')
            .then(res => setDashboardData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <div className="p-10 text-center text-gray-400">Memuat dashboard...</div>
            </AppLayout>
        );
    }

    const stats  = dashboardData?.stats || {};
    const funnel = dashboardData?.conversion_funnel || {};
    const total  = stats.total_target_market || 1;

    const funnelRows = [
        { label: 'Baru',      value: funnel.baru      || 0, percent: Math.round(((funnel.baru      || 0) / total) * 100), colorBar: 'bg-blue-500',   colorText: 'text-blue-600'   },
        { label: 'Dihubungi', value: funnel.dihubungi || 0, percent: Math.round(((funnel.dihubungi || 0) / total) * 100), colorBar: 'bg-purple-500', colorText: 'text-purple-600' },
        { label: 'Negosiasi', value: funnel.negosiasi || 0, percent: Math.round(((funnel.negosiasi || 0) / total) * 100), colorBar: 'bg-amber-500',  colorText: 'text-amber-600'  },
        { label: 'Deal',      value: funnel.deal      || 0, percent: Math.round(((funnel.deal      || 0) / total) * 100), colorBar: 'bg-green-500',  colorText: 'text-green-600'  },
        { label: 'Ditolak',   value: funnel.ditolak   || 0, percent: Math.round(((funnel.ditolak   || 0) / total) * 100), colorBar: 'bg-red-500',    colorText: 'text-red-600'    },
    ];

    return (
        <AppLayout>
            <div className="mb-5">
                <h1 className="text-[22px] font-semibold text-gray-900">Dashboard CRM</h1>
                <p className="text-sm text-gray-500 mt-1">Ringkasan performa prospek dan pelanggan.</p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard iconBg="bg-blue-50"
                    icon={<svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="8" r="6"/></svg>}
                    badge="Total" badgeClass="bg-blue-50 text-blue-700"
                    label="Total Target Market" value={stats.total_target_market || 0} sub="Seluruh prospek" />
                <StatCard iconBg="bg-cyan-50"
                    icon={<svg className="w-4 h-4 text-cyan-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="8" r="6"/></svg>}
                    badge="Aktif" badgeClass="bg-cyan-50 text-cyan-700"
                    label="Prospek Aktif" value={stats.prospek_aktif || 0} sub="Sedang diproses" />
                <StatCard iconBg="bg-green-50"
                    icon={<svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="8" r="6"/></svg>}
                    badge="Deal" badgeClass="bg-green-50 text-green-700"
                    label="Pelanggan Berhasil" value={stats.pelanggan_berhasil || 0} sub="Berhasil dikonversi" />
                <StatCard iconBg="bg-orange-50"
                    icon={<svg className="w-4 h-4 text-orange-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,12 6,7 9,10 14,4"/></svg>}
                    badge="%" badgeClass="bg-orange-50 text-orange-700"
                    label="Tingkat Konversi" value={`${stats.conversion_rate || 0}%`} sub="Persentase deal" />
            </div>

            <StatistikProspek />
            <RankingSales />

        </AppLayout>
    );
}