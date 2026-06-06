import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import ProspekList from "./ProspekList";
import ProspekDetail from "./ProspekDetail";
import ModalTambahKlien from "./ModalTambahKlien";
import UpdateStatusProspek from "./UpdateStatusProspek";
import Toast from "./Toast";

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
    //
    useEffect(() => {
        fetchProspeks();
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
            setIsEditMode(false); // hanya lihat detail
        } catch (error) {
            showToast("Gagal memuat detail prospek!", "error");
        }
    };

    const handleBack = () => {
        setSelectedProspek(null);
        setIsEditMode(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus prospek ini?")) return;
        try {
            await axios.delete(`/api/prospek/${id}`);
            showToast("Prospek berhasil dihapus!");
            fetchProspeks();
        } catch (error) {
            showToast("Gagal menghapus prospek!", "error");
        }
    };

    // Tambahkan fungsi ini di dalam komponen Index(), setelah handleDelete

    const handleUpdate = async (prospek) => {
        try {
            const response = await axios.get(`/api/prospek/${prospek.id}`);
            setUpdateProspek(response.data.data); // buka halaman update status
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
            showToast("Prospek berhasil ditambahkan!");
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
                <UpdateStatusProspek
                    prospek={updateProspek}
                    onBack={handleBackFromUpdate}
                />
            ) : selectedProspek ? (
                <div className="max-w-5xl mx-auto px-2">
                    <ProspekDetail
                        prospek={selectedProspek}
                        onBack={handleBack}
                        onRefresh={fetchProspeks}
                    />
                </div>
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
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            )}

            <ModalTambahKlien
                show={showTambahKlien}
                onClose={() => setShowTambahKlien(false)}
                onSimpan={handleSimpanKlien}
                sales={sales}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
