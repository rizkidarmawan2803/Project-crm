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
    const initialForm = {
        nama_client:      '',
        company_name:     '',
        phone:            '',
        email:            '',
        product_interest: '',
        sumber:           '',
        lead_status:      'Baru',
        domisili:         '',
        alamat_lengkap:   '',
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Hapus error saat user mulai mengisi
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.nama_client)    newErrors.nama_client    = 'Nama client wajib diisi';
        if (!form.phone)          newErrors.phone          = 'Nomor telepon wajib diisi';
        if (!form.sumber)         newErrors.sumber         = 'Sumber wajib diisi';
        if (!form.domisili)       newErrors.domisili       = 'Domisili wajib diisi';
        if (!form.alamat_lengkap) newErrors.alamat_lengkap = 'Alamat lengkap wajib diisi';
        return newErrors;
    };

    const handleSubmit = async () => {
        // Validasi client side
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await onSimpan(form);
            // Reset form setelah berhasil
            setForm(initialForm);
            setErrors({});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm(initialForm);
        setErrors({});
        onClose();
    };

    return (
        <Modal
            show={show}
            onClose={handleClose}
            title="Registrasi Klien Baru"
            width="max-w-xl"
            footer={
                <>
                    <BtnOutline onClick={handleClose}>Batal</BtnOutline>
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
                {/* Nama Client */}
                <FormField label="Nama Client">
                    <input
                        name="nama_client"
                        className={`${inputCls} ${errors.nama_client ? 'border-red-400' : ''}`}
                        placeholder="Masukkan nama Client"
                        value={form.nama_client}
                        onChange={handleChange}
                    />
                    {errors.nama_client && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.nama_client}</p>
                    )}
                </FormField>

                {/* Nama Perusahaan */}
                <FormField label="Nama Perusahaan">
                    <input
                        name="company_name"
                        className={inputCls}
                        placeholder="Masukkan Nama Perusahaan"
                        value={form.company_name}
                        onChange={handleChange}
                    />
                </FormField>

                {/* Nomor Telepon */}
                <FormField label="Nomor Telepon">
                    <input
                        name="phone"
                        className={`${inputCls} ${errors.phone ? 'border-red-400' : ''}`}
                        placeholder="+62 812 XXXXXXX"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                    )}
                </FormField>

                {/* Email */}
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

                {/* Produk */}
                <FormField label="Produk yang diminati">
                    <input
                        name="product_interest"
                        className={inputCls}
                        placeholder="Masukkan produk yang diminati"
                        value={form.product_interest}
                        onChange={handleChange}
                    />
                </FormField>

                {/* Sumber */}
                <FormField label="Sumber">
                    <input
                        name="sumber"
                        className={`${inputCls} ${errors.sumber ? 'border-red-400' : ''}`}
                        placeholder="Google Ads, Instagram, Referral, dll"
                        value={form.sumber}
                        onChange={handleChange}
                    />
                    {errors.sumber && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.sumber}</p>
                    )}
                </FormField>

                {/* Status */}
                <FormField label="Status Awal">
                    <select
                        name="lead_status"
                        className={selectCls}
                        value={form.lead_status}
                        onChange={handleChange}
                    >
                        <option value="Baru">Baru</option>
                        <option value="Dihubungi">Dihubungi</option>
                        <option value="Negosiasi">Negosiasi</option>
                        <option value="Deal">Deal</option>
                        <option value="Ditolak">Ditolak</option>
                    </select>
                </FormField>

                {/* Domisili */}
                <FormField label="Domisili">
                    <input
                        name="domisili"
                        className={`${inputCls} ${errors.domisili ? 'border-red-400' : ''}`}
                        placeholder="Kota / Kabupaten"
                        value={form.domisili}
                        onChange={handleChange}
                    />
                    {errors.domisili && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.domisili}</p>
                    )}
                </FormField>

                {/* Alamat Lengkap */}
                <FormField label="Alamat Lengkap Perusahaan" full>
                    <textarea
                        name="alamat_lengkap"
                        className={`${textareaCls} ${errors.alamat_lengkap ? 'border-red-400' : ''}`}
                        placeholder="Masukkan alamat lengkap kantor pusat..."
                        rows={3}
                        value={form.alamat_lengkap}
                        onChange={handleChange}
                    />
                    {errors.alamat_lengkap && (
                        <p className="text-[11px] text-red-500 mt-1">{errors.alamat_lengkap}</p>
                    )}
                </FormField>
            </FormGrid>
        </Modal>
    );
}