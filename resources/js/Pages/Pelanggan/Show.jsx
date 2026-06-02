import React, { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import axios from "axios";

// ─────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────
function IconArrowLeft({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
    );
}

// ─────────────────────────────────────────────
// STATUS STYLE
// ─────────────────────────────────────────────
const STATUS_STYLE = {
    Baru:      "bg-blue-100 text-blue-700",
    Dihubungi: "bg-yellow-100 text-yellow-700",
    Negosiasi: "bg-orange-100 text-orange-700",
    Deal:      "bg-green-100 text-green-700",
    'Belum Tertarik':   "bg-red-100 text-red-700",
};

// ─────────────────────────────────────────────
// TAB RIWAYAT TRANSAKSI
// ─────────────────────────────────────────────
function TabKomunikasi({ currentLeadClientId }) {
    const [deals, setDeals]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [showForm, setShowForm]         = useState(false);
    const [formData, setFormData]         = useState({ payment_status: 'unpaid' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [errorMsg, setErrorMsg]         = useState(null);

    useEffect(() => { fetchDeals(); }, [currentLeadClientId]);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/deals', {
                params: { lead_client_id: currentLeadClientId },
                withCredentials: true,
            });
            setDeals(response.data.data || []);
        } catch (error) {
            console.error("Gagal mengambil data deal:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;
        console.log('[DEBUG] File dipilih:', file);
        setSelectedFile(file);
    };

    const handleSubmitDeal = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        // ── DEBUG ──────────────────────────────────────
        console.log('[DEBUG] currentLeadClientId:', currentLeadClientId);
        console.log('[DEBUG] formData:', formData);
        console.log('[DEBUG] selectedFile:', selectedFile);
        // ───────────────────────────────────────────────

        if (!currentLeadClientId) {
            setErrorMsg("ID pelanggan tidak ditemukan.");
            return;
        }

        if (!selectedFile) {
            setErrorMsg("Silakan pilih file dokumen deal terlebih dahulu.");
            return;
        }

        setSubmitLoading(true);

        const data = new FormData();
        data.append('lead_client_id', currentLeadClientId);
        data.append('payment_status', formData.payment_status);
        data.append('deal_file', selectedFile, selectedFile.name); // ← name eksplisit

        // DEBUG: lihat isi FormData
        for (let [key, val] of data.entries()) {
            console.log('[DEBUG] FormData -', key, ':', val);
        }

        try {
            const response = await axios.post('/api/deals', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });

            if (response.status === 201 || response.data.success) {
                setShowForm(false);
                setFormData({ payment_status: 'unpaid' });
                setSelectedFile(null);
                fetchDeals();
            }
        } catch (error) {
            console.error('[DEBUG] Error response:', error.response?.data);
            const msg = error.response?.data?.message
                || error.response?.data?.errors
                || error.message
                || "Terjadi kesalahan pada server.";
            setErrorMsg(typeof msg === 'object' ? JSON.stringify(msg) : msg);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus deal ini?')) return;
        try {
            await axios.delete(`/api/deals/${id}`, { withCredentials: true });
            fetchDeals();
        } catch (error) {
            alert('Gagal menghapus deal.');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`/api/deals/${id}/status`, { payment_status: status }, { withCredentials: true });
            fetchDeals();
        } catch (error) {
            alert('Gagal update status.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':    return 'bg-green-100 text-green-700';
            case 'partial': return 'bg-blue-100 text-blue-700';
            default:        return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid':    return 'Lunas';
            case 'partial': return 'Bayar Sebagian';
            default:        return 'Belum Bayar';
        }
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 max-w-4xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-800">Peluang Aktif & Arsip Deal</h2>
                    <p className="text-[12px] text-gray-400 mt-1">Kelola dokumen deal untuk pelanggan ini</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setErrorMsg(null); }}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white text-[12px] font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span className="text-sm">{showForm ? '✕' : '＋'}</span>
                    {showForm ? 'Batal' : 'Upload Berkas Deal'}
                </button>
            </div>

            {/* FORM TAMBAH DEAL */}
            {showForm && (
                <form onSubmit={handleSubmitDeal} className="bg-white border border-gray-200 rounded-xl p-5 mb-5 space-y-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Form Registrasi Dokumen Deal</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[12px] text-gray-500 mb-1">Status Pembayaran Kontrak</label>
                            <select
                                name="payment_status"
                                value={formData.payment_status}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            >
                                <option value="unpaid">Belum Bayar </option>
                                <option value="partial">Bayar Sebagian </option>
                                <option value="paid">Lunas </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12px] text-gray-500 mb-1">File Dokumen Deal (PDF/Docx)</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.zip"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {/* Error message */}
                    {errorMsg && (
                        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-[13px] text-red-600">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 rounded-lg transition disabled:bg-gray-400"
                    >
                        {submitLoading ? 'Sedang Mengunggah Dokumen...' : 'Simpan Deal'}
                    </button>
                </form>
            )}

            {/* LIST DATA DEAL */}
            <div className="space-y-3">
                {loading ? (
                    <p className="text-center text-sm text-gray-400 py-5">Memuat data...</p>
                ) : deals.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-5">
                        Belum ada dokumen deal dilampirkan untuk client ini.
                    </p>
                ) : (
                    deals.map((deal) => (
                        <div key={deal.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition">
                            <div>
                                <h3 className="text-[14px] font-medium text-gray-800 mb-1">
                                    Dokumen Kontrak Transaksi
                                </h3>
                                {deal.deal_file_url ? (
                                    <a href={deal.deal_file_url} target="_blank" rel="noreferrer"
                                        className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
                                        📄 Lihat Lampiran Dokumen Kontrak
                                    </a>
                                ) : (
                                    <span className="text-[12px] text-gray-400">Tidak ada file</span>
                                )}
                                {deal.user && (
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        Diupload oleh: {deal.user.first_name} {deal.user.last_name || ''}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <select
                                    value={deal.payment_status}
                                    onChange={(e) => handleUpdateStatus(deal.id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase border-0 outline-none cursor-pointer ${getStatusColor(deal.payment_status)}`}
                                >
                                    <option value="unpaid">Belum Bayar</option>
                                    <option value="partial">Bayar Sebagian</option>
                                    <option value="paid">Lunas</option>
                                </select>

                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <span>📅</span>
                                    <span>{new Date(deal.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}</span>
                                </div>

                                <button onClick={() => handleDelete(deal.id)}
                                    className="text-[11px] text-red-500 hover:text-red-700 hover:underline">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────
const TABS = [
    { key: "info",  label: "Informasi Umum"    },
    { key: "komun", label: "Riwayat Transaksi" },
];

// ─────────────────────────────────────────────
// MAIN SHOW
// ─────────────────────────────────────────────
export default function Show({ id }) {
    const [loading, setLoading]       = useState(true);
    const [pelanggan, setPelanggan]   = useState(null);
    const [tab, setTab]               = useState("info");

    useEffect(() => {
        fetch(`/api/pelanggan/${id}`, {
            headers: { Accept: "application/json" },
            credentials: "same-origin",
        })
            .then((res) => { if (!res.ok) throw new Error("Gagal"); return res.json(); })
            .then((json) => setPelanggan(json.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <AppLayout><div className="text-sm text-gray-500">Memuat detail pelanggan...</div></AppLayout>;
    if (!pelanggan) return <AppLayout><div className="text-sm text-red-500">Data pelanggan tidak ditemukan</div></AppLayout>;

    return (
        <AppLayout>
            {/* Breadcrumb */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <Link href="/pelanggan" className="flex items-center gap-1 text-blue-600 font-medium">
                        <IconArrowLeft className="w-4 h-4"/>
                        Kembali
                    </Link>
                    <span className="text-gray-300">›</span>
                    <span className="text-blue-600">Pelanggan</span>
                    <span className="text-gray-300">›</span>
                    <span className="text-gray-700">{pelanggan.nama_client}</span>
                </div>
                <div className="text-sm text-gray-400">#{pelanggan.id}</div>
            </div>

            {/* HEADER */}
            <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                        {pelanggan.nama_client?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-[30px] font-semibold text-gray-900">{pelanggan.nama_client}</h1>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[pelanggan.lead_status] || "bg-gray-100 text-gray-600"}`}>
                                {pelanggan.lead_status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                            <span>{pelanggan.company_name}</span>
                            <span>·</span>
                            <span>{pelanggan.sumber}</span>
                            <span>·</span>
                            <span>#{pelanggan.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="border-b border-gray-200 flex overflow-x-auto">
                    {TABS.map((t) => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-6 py-4 text-sm whitespace-nowrap border-b-2 transition flex-shrink-0 ${
                                tab === t.key ? "text-blue-600 border-blue-600 font-semibold" : "text-gray-500 border-transparent hover:text-blue-500"
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {tab === "info" && (
                        <>
                            <div className="mb-10">
                                <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-8">Informasi Detail Pelanggan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Nama Kontak</p><p className="text-2xl font-semibold text-gray-900">{pelanggan.nama_client}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Perusahaan</p><p className="text-2xl font-semibold text-gray-900">{pelanggan.company_name || '-'}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Email</p><p className="text-blue-600 text-xl font-medium">{pelanggan.email || '-'}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Telepon</p><p className="text-xl font-medium text-gray-900">{pelanggan.phone || '-'}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Sales PIC</p><p className="text-xl font-medium text-gray-900">{pelanggan.sales ? `${pelanggan.sales.first_name} ${pelanggan.sales.last_name || ""}` : "-"}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Domisili</p><p className="text-xl font-medium text-gray-900">{pelanggan.domisili || '-'}</p></div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-8">Informasi Tambahan</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Sumber Lead</p><p className="text-lg font-medium text-gray-900">{pelanggan.sumber || '-'}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Status</p><p className="text-lg font-medium text-gray-900">{pelanggan.lead_status || '-'}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Minat Produk</p><p className="text-lg font-medium text-gray-900">{pelanggan.product_interest || "-"}</p></div>
                                    <div><p className="text-xs font-semibold text-gray-400 uppercase mb-2">Alamat Lengkap</p><p className="text-gray-700 leading-relaxed">{pelanggan.alamat_lengkap || '-'}</p></div>
                                </div>
                            </div>
                        </>
                    )}

                    {tab === "komun" && (
                        <TabKomunikasi currentLeadClientId={pelanggan.id} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}