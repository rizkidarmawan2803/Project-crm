import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import ProspekList from "./ProspekList";
import ProspekDetail from "./ProspekDetail";
import ModalTambahKlien from "./ModalTambahKlien";
import ModalTambahDeal from "./ModalTambahDeal";
import ModalTambahPengingat from "./ModalTambahPengingat";
import Toast from "./Toast";

export default function Index({ sales = [] }) {
    const { auth } = usePage().props;

    const [selectedProspek, setSelectedProspek] = useState(null);
    const [showTambahKlien, setShowTambahKlien] = useState(false);
    const [showTambahDeal, setShowTambahDeal] = useState(false);
    const [showPengingat, setShowPengingat] = useState(false);
    const [toast, setToast] = useState(null);
    const [prospeks, setProspeks] = useState([]);
    const [summary, setSummary] = useState({
        total: 0, baru: 0, dihubungi: 0,
        negosiasi: 0, deal: 0, ditolak: 0,
    });
    const [pagination, setPagination] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProspeks();
    }, [activeFilter]);

    const fetchProspeks = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/prospek', {
                params: { status: activeFilter, page: page }
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

    const handleViewDetail = (prospek) => setSelectedProspek(prospek);
    const handleBack = () => setSelectedProspek(null);

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus prospek ini?')) return;
        try {
            await axios.delete(`/api/prospek/${id}`);
            showToast('Prospek berhasil dihapus!');
            fetchProspeks();
        } catch (error) {
            showToast('Gagal menghapus prospek!', 'error');
        }
    };

    const handleSimpanKlien = async (data) => {
        try {
            await axios.post('/api/prospek', data);
            setShowTambahKlien(false);
            showToast("Prospek berhasil ditambahkan!");
            fetchProspeks();
        } catch (error) {
            console.error('Response error:', error.response?.data);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const pesan = Object.values(errors).flat().join('\n');
                showToast('Validasi gagal: ' + pesan, 'error');
            } else {
                showToast("Gagal menambahkan prospek!", "error");
            }
        }
    };

    return (
        <>
            {selectedProspek ? (
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
                    onFilterChange={setActiveFilter}
                    onPageChange={fetchProspeks}
                    onTambahKlien={() => setShowTambahKlien(true)}
                    onViewDetail={handleViewDetail}
                    onDelete={handleDelete}
                />
            )}

            <ModalTambahKlien
                show={showTambahKlien}
                onClose={() => setShowTambahKlien(false)}
                onSimpan={handleSimpanKlien}
                sales={sales}
            />

            <ModalTambahDeal
                show={showTambahDeal}
                onClose={() => setShowTambahDeal(false)}
            />

            <ModalTambahPengingat
                show={showPengingat}
                onClose={() => setShowPengingat(false)}
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