import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

function TambahKlienModal({
    isOpen = true,
    onClose = () => {},
    form,
    setForm,
    handleSubmit,
    errors = {},
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-[18px] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <h2 className="text-[20px] font-bold text-slate-800">
                        Tambah Data Baru
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl text-slate-500 transition hover:text-slate-800"
                    >
                        ✕
                    </button>
                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2">
                    {/* INFORMASI */}
                    <div>
                        <h3 className="mb-2 text-[15px] font-semibold text-slate-700">
                            Informasi Staff
                        </h3>

                        <div className="space-y-2.5">
                            {/* Input Nama Depan */}
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Nama Depan{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    placeholder="Masukkan nama depan"
                                    value={form.first_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            first_name: e.target.value,
                                        })
                                    }
                                    className={`h-10 w-full rounded-md border ${errors.first_name ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} px-3 text-[13px] outline-none transition`}
                                    required
                                />
                                {errors.first_name && (
                                    <p className="mt-1 text-xs text-red-500 font-medium">
                                        {errors.first_name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Input Nama Belakang */}
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Nama Belakang
                                </label>

                                <input
                                    type="text"
                                    placeholder="Masukkan nama belakang"
                                    value={form.last_name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            last_name: e.target.value,
                                        })
                                    }
                                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-[13px] outline-none transition focus:border-blue-500"
                                />
                            </div>

                            {/* Input Email */}
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    className={`h-10 w-full rounded-md border ${errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} px-3 text-[13px] outline-none transition`}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500 font-medium">
                                        {errors.email[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AKSES */}
                    <div>
                        <h3 className="mb-2 text-[15px] font-semibold text-slate-700">
                            Akses & Peran
                        </h3>

                        <div className="space-y-2.5">
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Peran / Hak Akses
                                </label>

                                <select
                                    value={form.is_admin}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            is_admin: Number(e.target.value),
                                        })
                                    }
                                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-[13px] outline-none transition focus:border-blue-500"
                                >
                                    <option value={0}>
                                        Sales Representative
                                    </option>

                                    <option value={1}>Admin</option>
                                </select>
                            </div>

                            {/* Input Kata Sandi */}
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Kata Sandi (Minimal 8 karakter){" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="password"
                                    placeholder="Buat kata sandi baru"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    className={`h-10 w-full rounded-md border ${errors.password ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-blue-500"} px-3 text-[13px] outline-none transition`}
                                    required
                                    minLength={8}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500 font-medium">
                                        {errors.password[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Batal
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="rounded-md bg-blue-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-blue-700"
                    >
                        Simpan Data Baru
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ManajemenPengguna() {
    const page = usePage();
    const auth = page.props.auth || {};
    const user = auth.user || {};

    const [openModal, setOpenModal] = useState(false);
    const [staff, setStaff] = useState([]);
    const [summary, setSummary] = useState({
        total_staff: 0,
        total_sales: 0,
        total_admin: 0,
    });

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        is_admin: 0,
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

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
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            setErrors({});
            await axios.post("/api/users", form);
            await getUsers();

            const roleText = form.is_admin === 1 ? "Admin" : "Sales";
            const namaText = form.first_name;

            handleCloseModal();

            setSuccessMessage(`${roleText} ${namaText} telah ditambahkan!`);
            setTimeout(() => setSuccessMessage(null), 3500);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.log(error);
            }
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setErrors({});
        setForm({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            is_admin: 0,
        });
    };

    return (
        <AppLayout>
            <div className="bg-[#F7F9FC] px-4 py-4 min-h-screen relative">
                {/* TOAST ALERT */}
                {successMessage && (
                    <div className="fixed bottom-5 right-5 z-50 bg-green-600 text-white text-[13px] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                        <span>✓</span>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* HEADER */}
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h1 className="text-[22px] font-semibold text-gray-900">
                            Manajemen Tim & Akses
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Kelola staf, role, dan distribusi pipeline tim.
                        </p>
                    </div>

                    {user.is_admin == 1 && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="rounded-[12px] bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-800 transition"
                        >
                            + Tambah Data
                        </button>
                    )}
                </div>

                {/* CARDS */}
                <div className="grid gap-3 md:grid-cols-3">
                    {/* Card 1: Total Staff */}
                    <div className="flex items-start justify-between rounded-[16px] bg-white px-4 py-4 shadow-sm border border-slate-100">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium">
                                Total Staff
                            </p>
                            <h2 className="mt-1 text-[24px] font-bold text-slate-800">
                                {summary.total_staff}
                            </h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            {/* SVG Icon: Users Group */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Card 2: Sales Representatives */}
                    <div className="flex items-start justify-between rounded-[16px] bg-white px-4 py-4 shadow-sm border border-slate-100">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium">
                                Sales Representatives
                            </p>
                            <h2 className="mt-1 text-[24px] font-bold text-slate-800">
                                {summary.total_sales}
                            </h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            {/* SVG Icon: Briefcase */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: Account Managers */}
                    <div className="flex items-start justify-between rounded-[16px] bg-white px-4 py-4 shadow-sm border border-slate-100">
                        <div>
                            <p className="text-[13px] text-slate-500 font-medium">
                                Account Managers
                            </p>
                            <h2 className="mt-1 text-[24px] font-bold text-slate-800">
                                {summary.total_admin}
                            </h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            {/* SVG Icon: Shield Check */}
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* TABLE */}
                <div className="mt-4 rounded-[16px] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#EEF2F7] px-4 py-3">
                        <h2 className="text-[16px] font-bold text-slate-800">
                            Daftar Staff Aktif
                        </h2>
                    </div>

                    <div className="overflow-x-auto px-4 py-1">
                        <table className="min-w-[850px] w-full border-separate border-spacing-y-1">
                            <thead>
                                <tr className="text-left text-[13px] font-medium text-slate-500">
                                    <th className="px-3 pb-2">Nama Staff</th>
                                    <th className="px-3 pb-2">Peran</th>
                                    <th className="px-3 pb-2">
                                        Total Pelanggan
                                    </th>
                                    <th className="px-3 pb-2">Beban Kerja</th>
                                    <th className="px-3 pb-2">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {staff.map((item, index) => (
                                    <tr key={index} className="bg-slate-50">
                                        <td className="rounded-l-lg px-3 py-2.5">
                                            <h3 className="text-[14px] font-semibold text-slate-800">
                                                {item.first_name}{" "}
                                                {item.last_name}
                                            </h3>
                                            <p className="text-[12px] text-slate-500">
                                                {item.email}
                                            </p>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span
                                                className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                                                    item.is_admin
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {item.is_admin
                                                    ? "Admin"
                                                    : "Sales"}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-[13px] text-slate-700">
                                            {item.total_pelanggan} Pelanggan
                                        </td>
                                        <td className="px-3 py-2.5 text-[13px] text-slate-700">
                                            {item.total_leads} Leads Aktif
                                        </td>
                                        <td className="rounded-r-lg px-3 py-2.5">
                                            <span
                                                className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                                                    item.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {item.status === "active"
                                                    ? "Aktif"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#EEF2F7] px-4 py-3">
                        <p className="text-[12px] text-slate-500">
                            Menampilkan {staff.length} staff
                        </p>
                    </div>
                </div>

                {/* MODAL TAMBAH DATA */}
                <TambahKlienModal
                    isOpen={openModal}
                    onClose={handleCloseModal}
                    form={form}
                    setForm={setForm}
                    handleSubmit={handleSubmit}
                    errors={errors}
                />
            </div>
        </AppLayout>
    );
}
