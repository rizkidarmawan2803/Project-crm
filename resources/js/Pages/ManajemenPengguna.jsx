import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

// --- KOMPONEN IKON ---
const IconEye = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const IconPencil = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);
const IconKey = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);
const IconTrash = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default function ManajemenPengguna() {
    const page = usePage();
    const auth = page.props.auth || {};
    const currentUser = auth.user || {};

    const [staff, setStaff] = useState([]);
    const [summary, setSummary] = useState({ total_staff: 0, total_sales: 0, total_admin: 0 });
    const [searchTerm, setSearchTerm] = useState("");

    // State Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

    // Form States
    const initialForm = { first_name: "", last_name: "", email: "", password: "", is_admin: 0, status: "active" };
    const [form, setForm] = useState(initialForm);
    const [resetForm, setResetForm] = useState({ password: "", password_confirmation: "" });

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get("/api/users");
            setStaff(response.data.users || []);
            setSummary({
                total_staff: response.data.total_staff || 0,
                total_sales: response.data.total_sales || 0,
                total_admin: response.data.total_admin || 0,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const displaySuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
        getUsers();
    };

    // --- ACTIONS ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.post("/api/users", form);
            setShowAddModal(false);
            setForm(initialForm);
            displaySuccess("Pengguna baru berhasil ditambahkan!");
        } catch (error) {
            if (error.response?.status === 422) setErrors(error.response.data.errors);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.put(`/api/users/${selectedUser.id}`, form);
            setShowEditModal(false);
            displaySuccess("Data pengguna berhasil diperbarui!");
        } catch (error) {
            if (error.response?.status === 422) setErrors(error.response.data.errors);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await axios.put(`/api/users/${selectedUser.id}/reset-password`, resetForm);
            setShowResetModal(false);
            displaySuccess("Kata sandi berhasil direset!");
        } catch (error) {
            if (error.response?.status === 422) setErrors(error.response.data.errors);
        }
    };

    const executeDelete = async () => {
        if (!userToDelete) return;
        try {
            await axios.delete(`/api/users/${userToDelete.id}`);
            setUserToDelete(null);
            displaySuccess("Pengguna berhasil dihapus permanen!");
        } catch (error) {
            alert("Gagal menghapus pengguna.");
            setUserToDelete(null);
        }
    };

    // --- MODAL TRIGGERS ---
    const openEdit = (user) => {
        setSelectedUser(user);
        setForm({
            first_name: user.first_name,
            last_name: user.last_name || "",
            email: user.email,
            is_admin: user.is_admin,
            status: user.status,
            password: "", 
        });
        setErrors({});
        setShowEditModal(true);
    };

    const openReset = (user) => {
        setSelectedUser(user);
        setResetForm({ password: "", password_confirmation: "" });
        setErrors({});
        setShowResetModal(true);
    };

    const openDetail = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    // --- RENDER FILTER ---
    const filteredStaff = staff.filter(s => 
        (s.first_name + " " + s.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="bg-[#F7F9FC] px-4 py-4 min-h-screen relative">
                
                {/* TOAST ALERT */}
                {successMessage && (
                    <div className="fixed bottom-5 right-5 z-[9999] bg-green-600 text-white text-[13px] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                        <span>✓</span>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* HEADER */}
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[22px] font-semibold text-gray-900">Manajemen Tim & Akses</h1>
                        <p className="mt-1 text-sm text-gray-500">Kelola staf, role, dan distribusi pipeline tim.</p>
                    </div>

                    {currentUser.is_admin == 1 && (
                        <button
                            onClick={() => { setForm(initialForm); setErrors({}); setShowAddModal(true); }}
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Data
                        </button>
                    )}
                </div>

                {/* CARDS */}
                <div className="grid gap-3 md:grid-cols-3 mb-5">
                    <div className="flex items-start justify-between rounded-2xl bg-white px-5 py-4 shadow-sm border border-slate-100">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium">Total Staff</p>
                            <h2 className="mt-1 text-[26px] font-bold text-slate-800">{summary.total_staff}</h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-start justify-between rounded-2xl bg-white px-5 py-4 shadow-sm border border-slate-100">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium">Sales Representative</p>
                            <h2 className="mt-1 text-[26px] font-bold text-slate-800">{summary.total_sales}</h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-start justify-between rounded-2xl bg-white px-5 py-4 shadow-sm border border-slate-100">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium">Admin & Manager</p>
                            <h2 className="mt-1 text-[26px] font-bold text-slate-800">{summary.total_admin}</h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* TABLE & SEARCH */}
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 px-5 py-4 gap-3">
                        <h2 className="text-[15px] font-bold text-slate-800">Daftar Staff Sistem</h2>
                        
                        {/* Input Pencarian */}
                        <div className="relative w-full sm:max-w-xs">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-5 py-3 text-[12px] font-semibold text-gray-500">Info Staff</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-gray-500">Peran / Role</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-gray-500 text-center">Beban Kerja</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-gray-500 text-center">Status</th>
                                    <th className="px-5 py-3 text-[12px] font-semibold text-gray-500 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredStaff.length === 0 ? (
                                    <tr><td colSpan={5} className="py-10 text-center text-[13px] text-gray-400">Tidak ada data pengguna.</td></tr>
                                ) : filteredStaff.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3">
                                            <p className="text-[14px] font-semibold text-slate-800">{item.first_name} {item.last_name}</p>
                                            <p className="text-[12px] text-slate-500">{item.email}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${item.is_admin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                                {item.is_admin ? "Admin" : "Sales"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-[12px] text-slate-600 text-center">
                                            <b>{item.total_pelanggan || 0}</b> Pelanggan <br/>
                                            <span className="text-gray-400">({item.total_leads || 0} Prospek Aktif)</span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {item.status === "active" ? "Aktif" : "Non-aktif"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {/* TOMBOL AKSI DENGAN BORDER & SUBTLE ACCENT */}
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button 
                                                    onClick={() => openDetail(item)} 
                                                    title="Lihat Detail" 
                                                    className="p-1.5 text-blue-600  border border-gray-200 hover:bg-gray-100 rounded-lg "
                                                >
                                                    <IconEye />
                                                </button>
                                                <button 
                                                    onClick={() => openEdit(item)} 
                                                    title="Edit Data" 
                                                    className="p-1.5 text-amber-600 border border-gray-200 hover:bg-gray-100 rounded-lg "
                                                >
                                                    <IconPencil />
                                                </button>
                                                <button 
                                                    onClick={() => openReset(item)} 
                                                    title="Reset Password" 
                                                    className="p-1.5 text-slate-600 border border-gray-200 hover:bg-gray-100 rounded-lg "
                                                >
                                                    <IconKey />
                                                </button>
                                                <button 
                                                    onClick={() => setUserToDelete(item)} 
                                                    title="Hapus Permanen" 
                                                    className="p-1.5 text-red-600 border border-gray-200 hover:bg-gray-100 rounded-lg "
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SEMUA MODAL DI BAWAH SINI */}

                {/* TAMBAH & EDIT */}
                {(showAddModal || showEditModal) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <h2 className="text-[18px] font-bold text-slate-800">
                                    {showAddModal ? "Tambah Pengguna Baru" : "Edit Data Pengguna"}
                                </h2>
                                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-slate-700">✕</button>
                            </div>

                            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit}>
                                <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Nama Depan <span className="text-red-500">*</span></label>
                                            <input type="text" name="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                                className={`h-10 w-full rounded-lg border ${errors.first_name ? 'border-red-400' : 'border-slate-200'} px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
                                                required placeholder="Masukkan nama depan..." />
                                            {errors.first_name && <p className="text-[11px] text-red-500 mt-1">{errors.first_name[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Nama Belakang</label>
                                            <input type="text" name="last_name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                                placeholder="Opsional..." />
                                        </div>
                                        <div>
                                            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Email <span className="text-red-500">*</span></label>
                                            <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className={`h-10 w-full rounded-lg border ${errors.email ? 'border-red-400' : 'border-slate-200'} px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
                                                required placeholder="contoh@crm.com" />
                                            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email[0]}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[12px] font-semibold text-slate-600 mb-1">Hak Akses (Role)</label>
                                            <select value={form.is_admin} onChange={(e) => setForm({ ...form, is_admin: Number(e.target.value) })}
                                                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition">
                                                <option value={0}>Sales Representative</option>
                                                <option value={1}>Admin</option>
                                            </select>
                                        </div>
                                        
                                        {showEditModal && (
                                            <div>
                                                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Status Akun</label>
                                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition">
                                                    <option value="active">Aktif (Bisa Login)</option>
                                                    <option value="inactive">Non-aktif (Akses Ditutup)</option>
                                                </select>
                                            </div>
                                        )}

                                        {showAddModal && (
                                            <div>
                                                <label className="block text-[12px] font-semibold text-slate-600 mb-1">Kata Sandi Awal <span className="text-red-500">*</span></label>
                                                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={8} required
                                                    className={`h-10 w-full rounded-lg border ${errors.password ? 'border-red-400' : 'border-slate-200'} px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
                                                    placeholder="Minimal 8 karakter" />
                                                {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password[0]}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
                                    <button type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} 
                                        className="px-4 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold text-[13px] transition">
                                        Batal
                                    </button>
                                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 font-semibold text-[13px] text-white hover:bg-blue-700 transition shadow-sm">
                                        Simpan Data
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL RESET PASSWORD */}
                {showResetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <div>
                                    <h2 className="text-[18px] font-bold text-slate-800">Ubah Kata Sandi</h2>
                                    <p className="text-[12px] text-slate-500 mt-0.5">Untuk akun: {selectedUser?.email}</p>
                                </div>
                                <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                            </div>

                            <form onSubmit={handleResetSubmit}>
                                <div className="px-5 py-5 space-y-4">
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-600 mb-1">Kata Sandi Baru <span className="text-red-500">*</span></label>
                                        <input type="password" value={resetForm.password} onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })} minLength={8} required
                                            className={`h-10 w-full rounded-lg border ${errors.password ? 'border-red-400' : 'border-slate-200'} px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`}
                                            placeholder="Minimal 8 karakter" />
                                        {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password[0]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-semibold text-slate-600 mb-1">Konfirmasi Kata Sandi <span className="text-red-500">*</span></label>
                                        <input type="password" value={resetForm.password_confirmation} onChange={(e) => setResetForm({ ...resetForm, password_confirmation: e.target.value })} minLength={8} required
                                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                            placeholder="Ketik ulang sandi" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
                                    <button type="button" onClick={() => setShowResetModal(false)} 
                                        className="px-4 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold text-[13px] transition">
                                        Batal
                                    </button>
                                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 font-semibold text-[13px] text-white hover:bg-blue-700 transition shadow-sm">
                                        Simpan Sandi Baru
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL DETAIL PENGGUNA */}
                {showDetailModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                                <h2 className="text-[18px] font-bold text-slate-800">Detail Informasi Staff</h2>
                                <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                            </div>
                            
                            <div className="px-5 py-5 space-y-4">
                                <div>
                                    <p className="text-[12px] font-semibold text-slate-500 mb-1">Nama Lengkap</p>
                                    <p className="text-[14px] font-medium text-slate-900">{selectedUser.first_name} {selectedUser.last_name}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold text-slate-500 mb-1">Alamat Email</p>
                                    <p className="text-[14px] font-medium text-slate-900">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold text-slate-500 mb-1">Hak Akses (Role)</p>
                                    <p className="text-[14px] font-medium text-slate-900">
                                        {selectedUser.is_admin ? "Administrator" : "Sales Representative"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold text-slate-500 mb-1">Status Akun</p>
                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-medium ${selectedUser.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {selectedUser.status === "active" ? "Aktif" : "Non-aktif"}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-gray-100 flex gap-6">
                                    <div>
                                        <p className="text-[12px] font-semibold text-slate-500 mb-1">Total Klien</p>
                                        <p className="text-[16px] font-bold text-slate-800">{selectedUser.total_pelanggan || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold text-slate-500 mb-1">Prospek Aktif</p>
                                        <p className="text-[16px] font-bold text-slate-800">{selectedUser.total_leads || 0}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-5 py-4">
                                <button onClick={() => setShowDetailModal(false)} 
                                    className="px-4 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold text-[13px] transition">
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL KONFIRMASI HAPUS */}
                {userToDelete && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl animate-in fade-in zoom-in-95">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-[18px] font-bold text-gray-900 mb-2">Hapus Akun Permanen?</h3>
                            <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                                Apakah Anda yakin ingin menghapus akun pengguna <b>{userToDelete.first_name}</b>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setUserToDelete(null)} className="flex-1 px-4 py-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold text-[13px] transition">
                                    Batal
                                </button>
                                <button onClick={executeDelete} className="flex-1 px-4 py-2.5 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold text-[13px] transition shadow-sm">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}