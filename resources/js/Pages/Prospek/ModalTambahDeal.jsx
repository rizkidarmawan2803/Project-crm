import Modal, {
    FormGrid,
    FormField,
    inputCls,
    selectCls,
    textareaCls,
    BtnPrimary,
    BtnOutline,
} from "./Modal";

export default function ModalTambahDeal({ show, onClose }) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tambah Deal Baru"
            width="max-w-lg"
            footer={
                <>
                    <BtnOutline onClick={onClose}>Batal</BtnOutline>
                    <BtnPrimary>Simpan Deal</BtnPrimary>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <FormField label="Nama Deal / Produk">
                    <input
                        className={inputCls}
                        placeholder="Contoh: Paket Implementasi Software ERP"
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Nilai Deal (Rp)">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500 font-medium pointer-events-none">
                                Rp
                            </span>
                            <input
                                className={inputCls + " pl-8 text-right"}
                                type="text"
                                placeholder="0"
                            />
                        </div>
                    </FormField>
                    <FormField label="Status Deal">
                        <select className={selectCls}>
                            <option>Prospek Awal</option>
                            <option>Proposal Dikirim</option>
                            <option>Dalam Negosiasi</option>
                            <option>Deal Berhasil</option>
                            <option>Deal Gagal</option>
                        </select>
                    </FormField>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Estimasi Tanggal Closing">
                        <div className="relative">
                            <input className={inputCls + " pr-9"} type="date" />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                                📅
                            </span>
                        </div>
                    </FormField>
                    <FormField label="Sales PIC">
                        <select className={selectCls}>
                            <option>Andi Mahendra</option>
                            <option>Siti Aminah</option>
                            <option>Budi Doremi</option>
                            <option>Rina Sari</option>
                        </select>
                    </FormField>
                </div>

                <FormField label="Catatan Deal">
                    <textarea
                        className={textareaCls}
                        rows={3}
                        placeholder="Tambahkan detail atau catatan mengenai deal ini..."
                    />
                </FormField>
            </div>
        </Modal>
    );
}
