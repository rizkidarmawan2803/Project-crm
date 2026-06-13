import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import ProspekList from "./ProspekList";
import ProspekDetail from "./ProspekDetail";
import ModalTambahKlien from "./ModalTambahKlien";
import UpdateStatusProspek from "./UpdateStatusProspek";
import Toast from "./Toast";

// KUNCI PERBAIKAN: Impor AppLayout agar dapat mengunci Sidebar & Topbar di semua kondisi layar
import AppLayout from "../../Layouts/AppLayout";

// Import komponen Modal custom
import Modal, { BtnOutline } from "./Modal";

export default function Index({ sales = [] }) {
    const { auth } = usePage().props;

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProspek, setSelectedProspek] = useState(null);
    const [updateProspek, setUpdateProspek] = useState(null);
    const [showTambahKlien, setShowTambahKlien] = useState(false);
    const [toast, setToast] = useState(null);
    const [prospeks, setProspeks] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        baru: 0,
        dihubungi: 0,
        negosiasi: 0,
        deal: 0,
        belum_setuju: 0,
    });
    const [pagination, setPagination] = useState(null);
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [prospekToDelete, setProspekToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Jeda Debounce (Jeda 500ms) untuk pencarian
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProspeks(1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [activeFilter, search]);

    const fetchProspeks = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get("/api/prospek", {
                params: {
                    status: activeFilter,
                    page: page,
                    search: search,
                },
            });
            setProspeks(response.data.prospeks.data || []);
            setSummary(response.data.summary || {});
            setPagination(response.data.prospeks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleViewDetail = async (prospek) => {
        try {
            const response = await axios.get(`/api/prospek/${prospek.id}`);
            setSelectedProspek(response.data.data);
            setIsEditMode(false);
        } catch (error) {
            showToast("Gagal memuat detail prospek!", "error");
        }
    };

    const handleBack = () => {
        setSelectedProspek(null);
        setIsEditMode(false);
    };

    const handleDeleteClick = (prospek) => {
        setProspekToDelete(prospek);
    };

    const executeDelete = async () => {
        if (!prospekToDelete) return;

        // Ambil data dengan aman (berjaga-jaga jika state berupa object atau cuma angka ID)
        const idToDelete = prospekToDelete.id || prospekToDelete;
        const namaKlien = prospekToDelete.nama_client || "Klien";

        try {
            // Tembak API hapus ke database
            await axios.delete(`/api/prospek/${idToDelete}`);

            // 1. Tutup modal konfirmasi
            setProspekToDelete(null);

            // 2. Munculkan Toast animasi Bounce
            setSuccessMessage(`${namaKlien} berhasil dihapus`);

            // 3. Hilangkan Toast setelah 3 detik
            setTimeout(() => {
                setSuccessMessage(null);
            }, 2000);

            // 4. Refresh tabel data
            fetchProspeks();
        } catch (error) {
            console.error("Error menghapus data:", error);
            alert(
                "Gagal menghapus prospek. Silakan periksa console untuk detailnya.",
            );
            setProspekToDelete(null);
        }
    };

    const handleUpdate = async (prospek) => {
        try {
            const response = await axios.get(`/api/prospek/${prospek.id}`);
            setUpdateProspek(response.data.data);
        } catch (error) {
            console.error(error);
            showToast("Gagal memuat data prospek!", "error");
        }
    };

    const handleBackFromUpdate = () => {
        setUpdateProspek(null);
        fetchProspeks();
    };

    const handleSimpanKlien = async (data) => {
        try {
            await axios.post("/api/prospek", data);
            setShowTambahKlien(false);
            const namaKlien = data.nama_client || data.nama;
            setSuccessMessage(`Klien ${namaKlien} berhasil di tambah`);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 1000);

            fetchProspeks();
        } catch (error) {
            console.error("Response error:", error.response?.data);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const pesan = Object.values(errors).flat().join("\n");
                showToast("Validasi gagal: " + pesan, "error");
            } else {
                showToast("Gagal menambahkan prospek!", "error");
            }
        }
    };

    return (
        <>
            {updateProspek ? (
                <AppLayout>
                    <UpdateStatusProspek
                        prospek={updateProspek}
                        onBack={handleBackFromUpdate}
                    />
                </AppLayout>
            ) : selectedProspek ? (
                <AppLayout>
                    <div className="max-w-5xl mx-auto px-2">
                        <ProspekDetail
                            prospek={selectedProspek}
                            onBack={handleBack}
                            onRefresh={fetchProspeks}
                        />
                    </div>
                </AppLayout>
            ) : (
                <ProspekList
                    prospeks={prospeks}
                    summary={summary}
                    pagination={pagination}
                    activeFilter={activeFilter}
                    loading={loading}
                    search={search}
                    onSearchChange={setSearch}
                    onFilterChange={setActiveFilter}
                    onPageChange={fetchProspeks}
                    onTambahKlien={() => setShowTambahKlien(true)}
                    onViewDetail={handleViewDetail}
                    onDelete={handleDeleteClick}
                    onUpdate={handleUpdate}
                />
            )}

            <ModalTambahKlien
                show={showTambahKlien}
                onClose={() => setShowTambahKlien(false)}
                onSimpan={handleSimpanKlien}
                sales={sales}
            />

            {/* MODAL KONFIRMASI HAPUS */}
            {!!prospekToDelete && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl animate-in fade-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-[18px] font-bold text-gray-900 mb-2">Hapus Prospek?</h3>
                        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                            Apakah Anda yakin ingin menghapus data prospek <b>{prospekToDelete?.nama_client}</b>? Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setProspekToDelete(null)} className="flex-1 px-4 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold text-[13px] transition">
                                Batal
                            </button>
                            <button onClick={executeDelete} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold text-[13px] transition shadow-sm">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {successMessage && (
                <div className="fixed bottom-5 right-5 z-[1000] bg-green-600 text-white text-[13px] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                    <span className="font-bold text-base">✓</span>
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}
        </>
    );
}
