import Modal, {
    FormGrid,
    FormField,
    inputCls,
    selectCls,
    textareaCls,
    BtnPrimary,
    BtnOutline,
} from "./Modal";

export default function ModalTambahKlien({ show, onClose }) {
    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Registrasi Klien Baru"
            width="max-w-xl"
            footer={
                <>
                    <BtnOutline onClick={onClose}>Batal</BtnOutline>
                    <BtnPrimary>Buat Klien Baru</BtnPrimary>
                </>
            }
        >
            <p className="text-[13px] font-semibold text-gray-800 mb-3.5">
                Informasi Dasar
            </p>
            <FormGrid>
                <FormField label="Nama Client">
                    <input
                        className={inputCls}
                        placeholder="Masukkan nama Client"
                    />
                </FormField>
                <FormField label="Nama Perusahaan">
                    <input className={inputCls} placeholder="Masukkan Nama Perusahaan" />
                </FormField>
                <FormField label="Nomor Telepon Kantor">
                    <input className={inputCls} placeholder="+62 21 XXXXXXX" />
                </FormField>
                <FormField label="Email Kontak">
                    <input
                        className={inputCls}
                        type="email"
                        placeholder="email@perusahaan.com"
                    />
                </FormField>
                <FormField label="Produk yang diminati">
                    <input className={inputCls} placeholder="Masukkan produk yang diminati" />
                </FormField>
                <FormField label="Sumber">
                    <input className={inputCls} placeholder="Masukkan sumber informasi client" />
                </FormField>
                <FormField label="Status Awal">
                    <select className={selectCls}>
                        <option>Baru</option>
                        <option>Dihubungi</option>
                        <option>Negosiasi</option>
                        <option>Deal</option>
                        <option>Ditolak</option>
                    </select>
                </FormField>
                <FormField label="Domisili">
                    <input className={inputCls} placeholder="Masukkan Domisili" />
                </FormField>
                <FormField label="Alamat Lengkap Perusahaan" full>
                    <textarea
                        className={textareaCls}
                        placeholder="Masukkan alamat lengkap kantor pusat..."
                        rows={3}
                    />
                </FormField>
            </FormGrid>
        </Modal>
    );
}
