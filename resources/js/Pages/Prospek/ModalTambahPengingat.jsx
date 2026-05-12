import Modal, {FormField, inputCls, selectCls, textareaCls, BtnPrimary,BtnOutline,} from "./Modal";

export default function ModalTambahPengingat({ show, onClose }) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Tambah Pengingat Baru"
            width="max-w-md"
            footer={
                <>
                    <BtnOutline onClick={onClose}>Batal</BtnOutline>
                    <BtnPrimary>Simpan Pengingat</BtnPrimary>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <FormField label="Judul Tugas">
                    <input
                        className={inputCls}
                        placeholder="Contoh: Konfirmasi jadwal presentasi"
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Tanggal & Waktu Tenggat">
                        <div className="relative">
                            <input
                                className={inputCls + " pr-9"}
                                type="datetime-local"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                                📅
                            </span>
                        </div>
                    </FormField>
                    <FormField label="Jenis Aktivitas">
                        <select className={selectCls}>
                            <option>Panggilan Keluar</option>
                            <option>Pertemuan</option>
                            <option>Email</option>
                            <option>Demo Produk</option>
                            <option>Pengiriman Dokumen</option>
                            <option>Lainnya</option>
                        </select>
                    </FormField>
                </div>

                <FormField label="Catatan Tambahan">
                    <textarea
                        className={textareaCls}
                        rows={4}
                        placeholder="Tambahkan detail lebih lanjut mengenai pengingat ini..."
                    />
                </FormField>
            </div>
        </Modal>
    );
}
