import { useState } from "react";
import Modal, {
    FormGrid,
    FormField,
    inputCls,
    selectCls,
    textareaCls,
    BtnPrimary,
    BtnOutline,
} from "./Modal";

export default function ModalTambahKlien({ show, onClose, onSimpan, sales = [] }) {
    const [form, setForm] = useState({
        nama_client:      '',
        company_name:     '',
        phone:            '',
        email:            '',
        product_interest: '',
        sumber:           '',
        lead_status:      'Baru',
        domisili:         '',
        alamat_lengkap:   '',
        sales_id:         '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSimpan(form);
            setForm({
                nama_client:      '',
                company_name:     '',
                phone:            '',
                email:            '',
                product_interest: '',
                sumber:           '',
                lead_status:      'Baru',
                domisili:         '',
                alamat_lengkap:   '',
                sales_id:         '',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            title="Registrasi Klien Baru"
            width="max-w-xl"
            footer={
                <>
                    <BtnOutline onClick={onClose}>Batal</BtnOutline>
                    <BtnPrimary onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Buat Klien Baru'}
                    </BtnPrimary>
                </>
            }
        >
            <p className="text-[13px] font-semibold text-gray-800 mb-3.5">
                Informasi Dasar
            </p>
            <FormGrid>
                <FormField label="Nama Client">
                    <input
                        name="nama_client"
                        className={inputCls}
                        placeholder="Masukkan nama Client"
                        value={form.nama_client}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Nama Perusahaan">
                    <input
                        name="company_name"
                        className={inputCls}
                        placeholder="Masukkan Nama Perusahaan"
                        value={form.company_name}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Nomor Telepon Kantor">
                    <input
                        name="phone"
                        className={inputCls}
                        placeholder="+62 21 XXXXXXX"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Email Kontak">
                    <input
                        name="email"
                        className={inputCls}
                        type="email"
                        placeholder="email@perusahaan.com"
                        value={form.email}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Produk yang diminati">
                    <input
                        name="product_interest"
                        className={inputCls}
                        placeholder="Masukkan produk yang diminati"
                        value={form.product_interest}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Sumber">
                    <input
                        name="sumber"
                        className={inputCls}
                        placeholder="Masukkan sumber informasi client"
                        value={form.sumber}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Status Awal">
                    <select
                        name="lead_status"
                        className={selectCls}
                        value={form.lead_status}
                        onChange={handleChange}
                    >
                        <option>Baru</option>
                        <option>Dihubungi</option>
                        <option>Negosiasi</option>
                        <option>Deal</option>
                        <option>Ditolak</option>
                    </select>
                </FormField>

                <FormField label="Domisili">
                    <input
                        name="domisili"
                        className={inputCls}
                        placeholder="Masukkan Domisili"
                        value={form.domisili}
                        onChange={handleChange}
                    />
                </FormField>

                <FormField label="Sales PIC">
                    <select
                        name="sales_id"
                        className={selectCls}
                        value={form.sales_id}
                        onChange={handleChange}
                    >
                        <option value="">Pilih Sales</option>
                        {sales.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.first_name} {s.last_name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Alamat Lengkap Perusahaan" full>
                    <textarea
                        name="alamat_lengkap"
                        className={textareaCls}
                        placeholder="Masukkan alamat lengkap kantor pusat..."
                        rows={3}
                        value={form.alamat_lengkap}
                        onChange={handleChange}
                    />
                </FormField>
            </FormGrid>
        </Modal>
    );
}