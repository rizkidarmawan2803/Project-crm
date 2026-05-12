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
                <FormField label="Nama Perusahaan">
                    <input
                        className={inputCls}
                        placeholder="Masukkan nama perusahaan"
                    />
                </FormField>
                <FormField label="Domisili">
                    <input className={inputCls} placeholder="Domisili" />
                </FormField>
                <FormField label="Industri">
                    <select className={selectCls}>
                        <option value="">Pilih industri</option>
                        <option>Teknologi</option>
                        <option>Manufaktur</option>
                        <option>Ritel</option>
                        <option>Jasa</option>
                        <option>Kesehatan</option>
                    </select>
                </FormField>
                <FormField label="Email Kontak">
                    <input
                        className={inputCls}
                        type="email"
                        placeholder="email@perusahaan.com"
                    />
                </FormField>
                <FormField label="Nomor Telepon Kantor">
                    <input className={inputCls} placeholder="+62 21 XXXXXXX" />
                </FormField>
                <FormField label="Account Manager Assigned">
                    <select className={selectCls}>
                        <option>Sarah Jenkins</option>
                        <option>Andi Mahendra</option>
                        <option>Siti Aminah</option>
                        <option>Reza Darmawan</option>
                    </select>
                </FormField>
                <FormField label="Status Awal">
                    <select className={selectCls}>
                        <option>Baru</option>
                        <option>Dihubungi</option>
                        <option>Negosiasi</option>
                    </select>
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
