import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import axios from "axios";
import Modal, {
    FormGrid,
    FormField,
    inputCls,
    textareaCls,
    BtnPrimary,
    BtnOutline,
} from "../Prospek/Modal";

function IconBox({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
        </svg>
    );
}

function IconSearch({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );
}

function IconChevronLeft({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
    );
}

function IconChevronRight({ className }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
            />
        </svg>
    );
}

export default function Index() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [form, setForm] = useState({ nama_product: "", deskripsi: "" });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/products");
            setProducts(response.data.data || []);
        } catch (error) {
            console.error("Gagal memuat produk:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: null });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!form.nama_product.trim()) {
            errors.nama_product = "Nama produk wajib diisi.";
        } else if (form.nama_product.length > 100) {
            errors.nama_product = "Nama produk maksimal 100 karakter.";
        }
        return errors;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSubmitting(true);
        setApiError(null);
        try {
            const response = await axios.post("/api/products", form);
            setProducts([response.data.data, ...products]);
            setShowModal(false);
            setForm({ nama_product: "", deskripsi: "" });

            // Show toast success
            setSuccessMessage("Produk berhasil ditambahkan!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            if (error.response?.status === 422) {
                setFormErrors(error.response.data.errors || {});
            } else {
                setApiError(
                    error.response?.data?.message ||
                        "Terjadi kesalahan saat menyimpan produk.",
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) {
            return;
        }

        try {
            await axios.delete(`/api/products/${id}`);

            setProducts((prev) => prev.filter((item) => item.id !== id));

            setSuccessMessage("Produk berhasil dihapus!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Gagal menghapus produk.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (e) {
            return dateString;
        }
    };

    // Filter products
    const filteredProducts = products.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (
            product.nama_product.toLowerCase().includes(term) ||
            (product.deskripsi &&
                product.deskripsi.toLowerCase().includes(term))
        );
    });

    // Paginated items
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPerPage),
    );
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    // Reset current page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <AppLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-[19px] font-semibold text-gray-900 flex items-center gap-2">
                        <IconBox className="w-5 h-5 text-blue-600" />
                        Manajemen Produk
                    </h1>
                    <p className="text-[13px] text-gray-500 mt-0.5">
                        Kelola daftar produk yang ditawarkan kepada calon
                        pelanggan.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setForm({ nama_product: "", deskripsi: "" });
                        setFormErrors({});
                        setApiError(null);
                        setShowModal(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium text-[13px] px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Tambah Produk
                </button>
            </div>

            {/* Toast Alert */}
            {successMessage && (
                <div className="fixed bottom-5 right-5 z-50 bg-green-600 text-white text-[13px] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                    <span>✓</span>
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Stat Card */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between mb-5 shadow-sm">
                <div>
                    <p className="text-[12px] text-gray-400 mb-1">
                        Total Jenis Produk
                    </p>
                    <p className="text-[26px] font-semibold text-gray-900 leading-none">
                        {loading ? "..." : products.length}
                    </p>
                </div>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
                    <IconBox className="w-[18px] h-[18px]" />
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {/* Search Bar & Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 border-b border-gray-100 gap-3">
                    <span className="text-[14px] font-semibold text-gray-855">
                        Daftar Produk
                    </span>

                    <div className="relative w-full sm:max-w-xs">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-3 text-[12px] font-semibold text-gray-400 w-1/4">
                                    Nama Produk
                                </th>
                                <th className="px-6 py-3 text-[12px] font-semibold text-gray-400 w-1/2">
                                    Deskripsi
                                </th>
                                <th className="px-6 py-3 text-[12px] font-semibold text-gray-400 w-1/4">
                                    Tanggal Dibuat
                                </th>

                                <th className="px-6 py-3 text-[12px] font-semibold text-gray-400 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-[13px] text-gray-400"
                                    >
                                        Belum ada data produk...
                                    </td>
                                </tr>
                            ) : paginatedProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-10 text-center text-[13px] text-gray-400"
                                    >
                                        {searchTerm
                                            ? "Tidak ada produk yang cocok dengan pencarian."
                                            : "Belum ada data produk."}
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-[13.5px] text-gray-800 font-semibold">
                                            {product.nama_product}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-gray-500 whitespace-pre-line leading-relaxed max-w-md">
                                            {product.deskripsi || (
                                                <span className="italic text-gray-300">
                                                    Tidak ada deskripsi
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-gray-400">
                                            {formatDate(product.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                                className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition text-[12px] font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white">
                        <span className="text-[12px] text-gray-400">
                            Menampilkan{" "}
                            {Math.min(
                                filteredProducts.length,
                                (currentPage - 1) * itemsPerPage + 1,
                            )}{" "}
                            -{" "}
                            {Math.min(
                                filteredProducts.length,
                                currentPage * itemsPerPage,
                            )}{" "}
                            dari {filteredProducts.length} produk
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
                            >
                                <IconChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                            </button>

                            <span className="text-[12px] text-gray-500 px-2 font-medium">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
                            >
                                <IconChevronRight className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah Produk */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Tambah Produk Baru"
                width="max-w-md"
                footer={
                    <>
                        <BtnOutline onClick={() => setShowModal(false)}>
                            Batal
                        </BtnOutline>
                        <BtnPrimary
                            onClick={handleFormSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "Menyimpan..." : "Simpan Produk"}
                        </BtnPrimary>
                    </>
                }
            >
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {apiError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[12px] rounded-lg">
                            {apiError}
                        </div>
                    )}

                    <FormGrid>
                        {/* Nama Produk */}
                        <FormField label="Nama Produk *" full>
                            <input
                                type="text"
                                name="nama_product"
                                className={`${inputCls} ${formErrors.nama_product ? "border-red-400" : ""}`}
                                placeholder="Masukkan nama produk"
                                value={form.nama_product}
                                onChange={handleInputChange}
                                maxLength={100}
                                required
                            />
                            {formErrors.nama_product && (
                                <p className="text-[11px] text-red-500 mt-0.5">
                                    {formErrors.nama_product}
                                </p>
                            )}
                        </FormField>

                        {/* Deskripsi */}
                        <FormField label="Deskripsi" full>
                            <textarea
                                name="deskripsi"
                                className={textareaCls}
                                placeholder="Tuliskan deskripsi singkat produk..."
                                rows={4}
                                value={form.deskripsi}
                                onChange={handleInputChange}
                            />
                        </FormField>
                    </FormGrid>
                </form>
            </Modal>
        </AppLayout>
    );
}
