import React, { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

// ─────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────

function IconArrowLeft({ className }) {
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
                d="M15 19l-7-7 7-7"
            />
        </svg>
    );
}

// ─────────────────────────────────────────────
// STATUS STYLE
// ─────────────────────────────────────────────

const STATUS_STYLE = {
    Baru: "bg-blue-100 text-blue-700",
    Dihubungi: "bg-yellow-100 text-yellow-700",
    Negosiasi: "bg-orange-100 text-orange-700",
    Deal: "bg-green-100 text-green-700",
    Ditolak: "bg-red-100 text-red-700",
};

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// HELPERS & SUB-COMPONENTS
// ─────────────────────────────────────────────

// Icon per channel
function ChannelIcon({ channel }) {
    const map = {
        WA: { emoji: "💬", bg: "bg-green-500" },
        Email: { emoji: "✉️", bg: "bg-blue-500" },
        Call: { emoji: "📞", bg: "bg-purple-500" },
        Status: { emoji: "🔄", bg: "bg-amber-500" },
    };

    const { emoji, bg } = map[channel] ?? {
        emoji: "📌",
        bg: "bg-gray-400",
    };

    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-sm ${bg}`}
        >
            {emoji}
        </div>
    );
}

// Format tanggal ke lokal Indonesia
function formatTanggal(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}


// TAB RIWAYAT TRANSAKSI (STYLE BARU)
// ─────────────────────────────────────────────

function formatRupiah(value) {
    if (!value) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatTanggalShort(dateStr) {
    if (!dateStr) return "-";

    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
    });
}

function StatusBadge({ status }) {
    const map = {
        Baru: "bg-blue-100 text-blue-700",
        Dihubungi: "bg-yellow-100 text-yellow-700",
        Negosiasi: "bg-purple-100 text-purple-700",
        Deal: "bg-green-100 text-green-700",
        Ditolak: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold ${map[status] || "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
}

// Asumsi: b_id (ID Client) dikirim dari komponen parent saat melihat detail client tertentu
function TabKomunikasi({ currentLeadClientId = 1 }) {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk Form Tambah Deal Baru
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        payment_status: 'unpaid', // Hanya menyisakan status transaksi
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Ambil Data Dari Backend Laravel saat komponen dimuat
    useEffect(() => {
        fetchDeals();
    }, [currentLeadClientId]);

    const fetchDeals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/deals');
            if (response.data.success) {
                // Opsional: Memfilter data deal agar hanya menampilkan milik client ini saja
                const filteredDeals = response.data.data.filter(
                    deal => deal.lead_client_id === currentLeadClientId
                );
                setDeals(filteredDeals);
            }
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
        setSelectedFile(e.target.files[0]);
    };

    // Logika Submit Data Otomatis + Upload File
    const handleSubmitDeal = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Silakan pilih file dokumen deal (PDF) terlebih dahulu!");
            return;
        }

        setSubmitLoading(true);

        // OTOMATISASI DATA: Ambil data user login dari localStorage
        const userInfo = JSON.parse(localStorage.getItem('user_info'));
        const currentUserId = userInfo?.id || 1; // Fallback ke ID 1 jika auth belum dipasang

        const data = new FormData();
        data.append('payment_status', formData.payment_status);
        data.append('deal_file', selectedFile);
        
        // Disisipkan secara otomatis tanpa input dari user UI
        data.append('lead_client_id', currentLeadClientId); 
        data.append('user_id', currentUserId);

        try {
            const response = await axios.post('http://localhost:8000/api/deals', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 201 || response.data.success) {
                alert("Deal Berhasil Ditambahkan secara Otomatis!");
                setShowForm(false);
                setFormData({ payment_status: 'unpaid' });
                setSelectedFile(null);
                fetchDeals(); 
            }
        } catch (error) {
            console.error("Gagal menyimpan deal:", error);
            alert(error.response?.data?.message || "Terjadi kesalahan pada server.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'partial': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
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
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white text-[12px] font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span className="text-sm">{showForm ? '✕' : '＋'}</span>
                    {showForm ? 'Batal' : 'Upload Berkas Deal'}
                </button>
            </div>

            {/* FORM TAMBAH DEAL (Hanya Status & File) */}
            {showForm && (
                <form onSubmit={handleSubmitDeal} className="bg-white border border-gray-200 rounded-xl p-5 mb-5 space-y-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Form Registrasi Dokumen Deal</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[12px] text-gray-500 mb-1">Status Pembayaran Kontrak</label>
                            <select 
                                name="payment_status" value={formData.payment_status} onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            >
                                <option value="unpaid">Belum Bayar (Unpaid)</option>
                                <option value="partial">Bayar Sebagian (Partial)</option>
                                <option value="paid">Lunas (Paid)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12px] text-gray-500 mb-1">File Dokumen Deal (PDF/Docx)</label>
                            <input 
                                type="file" accept=".pdf,.doc,.docx,.zip" onChange={handleFileChange} required
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={submitLoading}
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
                    <p className="text-center text-sm text-gray-400 py-5">Belum ada dokumen deal dilampirkan untuk client ini.</p>
                ) : (
                    deals.map((deal) => (
                        <div key={deal.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition">
                            <div>
                                <h3 className="text-[14px] font-medium text-gray-800 mb-1">
                                    Dokumen Kontrak Transaksi #{deal.id}
                                </h3>
                                <a 
                                    href={`http://localhost:8000/storage/${deal.deal_file}`} 
                                    target="_blank" rel="noreferrer"
                                    className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    📄 Lihat Lampiran Dokumen Kontrak (PDF)
                                </a>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase ${getStatusColor(deal.payment_status)}`}>
                                    {deal.payment_status}
                                </span>
                                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                                    <span>📅 Tanggal:</span>
                                    <span>{new Date(deal.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

const TABS = [
    { key: "info", label: "Informasi Umum" },
    { key: "komun", label: "Riwayat Transaksi" },
];

export default function Show({ id }) {
    const [loading, setLoading] = useState(true);
    const [pelanggan, setPelanggan] = useState(null);
    const [tab, setTab] = useState("info");

    useEffect(() => {
        fetch(`/api/pelanggan/${id}`, {
            headers: {
                Accept: "application/json",
            },
            credentials: "same-origin",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Gagal memuat detail pelanggan");
                }

                return res.json();
            })
            .then((json) => {
                setPelanggan(json.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <AppLayout>
                <div className="text-sm text-gray-500">
                    Memuat detail pelanggan...
                </div>
            </AppLayout>
        );
    }

    if (!pelanggan) {
        return (
            <AppLayout>
                <div className="text-sm text-red-500">
                    Data pelanggan tidak ditemukan
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {/* Breadcrumb */}
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <Link
                        href="/pelanggan"
                        className="flex items-center gap-1 text-blue-600 font-medium"
                    >
                        <IconArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>

                    <span className="text-gray-300">›</span>

                    <span className="text-blue-600">
                        Pelanggan
                    </span>

                    <span className="text-gray-300">›</span>

                    <span className="text-gray-700">
                        {pelanggan.nama_client}
                    </span>
                </div>

                <div className="text-sm text-gray-400">
                    #{pelanggan.id}
                </div>
            </div>

            {/* HEADER */}
            <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                        {pelanggan.nama_client?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-[30px] font-semibold text-gray-900">
                                {pelanggan.nama_client}
                            </h1>

                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[
                                    pelanggan.lead_status
                                    ] || "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {pelanggan.lead_status}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                            <span>
                                {pelanggan.company_name}
                            </span>

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
                {/* Tabs */}
                <div className="border-b border-gray-200 flex overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-6 py-4 text-sm whitespace-nowrap border-b-2 transition flex-shrink-0 ${tab === t.key
                                    ? "text-blue-600 border-blue-600 font-semibold"
                                    : "text-gray-500 border-transparent hover:text-blue-500"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* BODY */}
                <div className="p-8">
                    {tab === "info" && (
                        <>
                            {/* INFORMASI DETAIL */}
                            <div className="mb-10">
                                <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-8">
                                    Informasi Detail Pelanggan
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Nama Kontak
                                        </p>

                                        <p className="text-2xl font-semibold text-gray-900">
                                            {pelanggan.nama_client}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Perusahaan
                                        </p>

                                        <p className="text-2xl font-semibold text-gray-900">
                                            {pelanggan.company_name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Email
                                        </p>

                                        <p className="text-blue-600 text-xl font-medium">
                                            {pelanggan.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Telepon
                                        </p>

                                        <p className="text-xl font-medium text-gray-900">
                                            {pelanggan.phone}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Sales PIC
                                        </p>

                                        <p className="text-xl font-medium text-gray-900">
                                            {pelanggan.sales
                                                            ? `${pelanggan.sales.first_name} ${pelanggan.sales.last_name || ""}`
                                                            : "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Domisili
                                        </p>

                                        <p className="text-xl font-medium text-gray-900">
                                            {pelanggan.domisili}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* TAMBAHAN */}
                            <div className="border-t border-gray-100 pt-8">
                                <h2 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-8">
                                    Informasi Tambahan
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Sumber Lead
                                        </p>

                                        <p className="text-lg font-medium text-gray-900">
                                            {pelanggan.sumber}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Status
                                        </p>

                                        <p className="text-lg font-medium text-gray-900">
                                            {pelanggan.lead_status}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Minat Produk
                                        </p>

                                        <p className="text-lg font-medium text-gray-900">
                                            {pelanggan.product_interest || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                            Alamat Lengkap
                                        </p>

                                        <p className="text-gray-700 leading-relaxed">
                                            {pelanggan.alamat_lengkap}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {tab === "komun" && (
                        <TabKomunikasi prospekId={pelanggan.id} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}