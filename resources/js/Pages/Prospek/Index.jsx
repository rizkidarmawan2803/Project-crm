import { useState } from "react";
import ProspekList from "./ProspekList";
import ProspekDetail from "./ProspekDetail";
import ModalTambahKlien from "./ModalTambahKlien";
import ModalTambahDeal from "./ModalTambahDeal";
import ModalTambahPengingat from "./ModalTambahPengingat";
import Toast from "./Toast";

export default function Index({ prospeks = [] }) {
    const [selectedProspek, setSelectedProspek] = useState(null);
    const [showTambahKlien, setShowTambahKlien] = useState(false);
    const [showTambahDeal, setShowTambahDeal] = useState(false);
    const [showPengingat, setShowPengingat] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleViewDetail = (prospek) => {
        setSelectedProspek(prospek);
    };

    const handleBack = () => {
        setSelectedProspek(null);
    };

    const handleKonversi = (prospek) => {
        // TODO: kirim ke backend
        console.log("Konversi prospek:", prospek);
        showToast(`${prospek.nama} berhasil dikonversi ke Client!`);
    };

    const handleSimpanKlien = (data) => {
        console.log("Klien baru:", data);
        setShowTambahKlien(false);
        showToast("Prospek berhasil ditambahkan!");
    };

    return (
        <>
            {selectedProspek ? (
                // Wrapper agar ProspekDetail ikut max-width & centered
                <div className="max-w-5xl mx-auto px-2">
                    <ProspekDetail
                        prospek={selectedProspek}
                        onBack={handleBack}
                        onKonversi={handleKonversi}
                    />
                </div>
            ) : (
                <ProspekList
                    prospeks={prospeks}
                    onTambahKlien={() => setShowTambahKlien(true)}
                    onViewDetail={handleViewDetail}
                />
            )}

            {/* Modal tambah klien */}
            <ModalTambahKlien
                show={showTambahKlien}
                onClose={() => setShowTambahKlien(false)}
                onSimpan={handleSimpanKlien}
            />

            {/* Modal tambah deal */}
            <ModalTambahDeal
                show={showTambahDeal}
                onClose={() => setShowTambahDeal(false)}
            />

            {/* Modal tambah pengingat */}
            <ModalTambahPengingat
                show={showPengingat}
                onClose={() => setShowPengingat(false)}
            />

            {/* Toast notifikasi */}
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
