import { useState } from "react";
import axios from "axios";
import ProductAutocomplete from "./ProductAutocomplete";

export default function UpdateStatusProspek({ prospek, onBack }) {
    const getInitialStatus = () => {
        switch (prospek.lead_status) {
            case "Baru":
                return "Dihubungi";

            case "Dihubungi":
                return "Negosiasi";

            case "Negosiasi":
                return "Deal";

            default:
                return "";
        }
    };

    const [status, setStatus] = useState("");

    const [namaClient, setNamaClient] = useState(prospek.nama_client || "");

    const [companyName, setCompanyName] = useState(prospek.company_name || "");

    const [phone, setPhone] = useState(prospek.phone || "");

    const [email, setEmail] = useState(prospek.email || "");

    const [productInterest, setProductInterest] = useState(
        prospek.product_interest || "",
    );

    const [sumber, setSumber] = useState(prospek.sumber || "");

    const [domisili, setDomisili] = useState(prospek.domisili || "");

    const [alamatLengkap, setAlamatLengkap] = useState(
        prospek.alamat_lengkap || "",
    );

    const [catatan, setCatatan] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const STATUS_OPTIONS = (() => {
        switch (prospek.lead_status) {
            case "Baru":
                return [
                    { value: "Dihubungi", label: "Dihubungi" },
                ];

            case "Dihubungi":
                return [
                    { value: "Negosiasi", label: "Negosiasi" },
                ];

            case "Negosiasi":
                return [];

            case "Belum Tertarik":
                return [
                    { value: "Dihubungi", label: "Dihubungi" },
                ];

            case "Deal":
                return [];

            default:
                return [];
        }
    })();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await axios.put(`/api/prospek/${prospek.id}`, {
                nama_client: namaClient,
                company_name: companyName,
                phone,
                email,
                product_interest: productInterest,
                sumber,
                domisili,
                alamat_lengkap: alamatLengkap,
                lead_status: status || prospek.lead_status,
                catatan: catatan || null,
            });

            alert("Data prospek berhasil diperbarui.");
            onBack();
        } catch (err) {
            const msg =
                err.response?.data?.message || "Gagal memperbarui prospek.";

            setError(msg);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Kembali
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                    Update Informasi & Status Prospek
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Nama Prospek */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Nama Prospek
                    </label>
                    <input
                        type="text"
                        value={namaClient}
                        onChange={(e) => setNamaClient(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Perusahaan */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Perusahaan
                    </label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                    {/* Telepon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Nomor Telepon
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Produk Diminati */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Produk Diminati
                        </label>
                        <ProductAutocomplete
                            value={productInterest}
                            onChange={(val) => setProductInterest(val)}
                            placeholder="Cari atau masukkan nama produk..."
                        />
                    </div>

                    {/* Sumber */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Sumber
                        </label>
                        <input
                            type="text"
                            value={sumber}
                            onChange={(e) => setSumber(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Domisili */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Domisili
                        </label>
                        <input
                            type="text"
                            value={domisili}
                            onChange={(e) => setDomisili(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Alamat Lengkap */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Alamat Lengkap
                    </label>
                    <textarea
                        value={alamatLengkap}
                        onChange={(e) => setAlamatLengkap(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status saat ini */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Status Saat Ini
                    </label>
                    <input
                        type="text"
                        value={prospek.lead_status || "-"}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                </div>

                {/* Status baru */}
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Status Baru <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={STATUS_OPTIONS.length === 0}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <option value="">Tidak mengubah status</option>

                        {STATUS_OPTIONS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Catatan (opsional) */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Catatan{" "}
                        <span className="text-gray-400 font-normal">
                            (opsional)
                        </span>
                    </label>
                    <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Tambahkan catatan perubahan status..."
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-[13px] text-red-600">
                        ⚠️ {error}
                    </div>
                )}

                {/* Tombol */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 transition"
                    >
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
