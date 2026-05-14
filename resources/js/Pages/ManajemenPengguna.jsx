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
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 left-[300px] z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-[18px] bg-white shadow-2xl">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <h2 className="text-[20px] font-bold text-slate-800">
                        Tambah Data Baru
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl text-slate-500 transition hover:text-slate-800"
                    >
                        ×
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
                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Nama Depan
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
                                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-[13px] outline-none transition focus:border-blue-500"
                                />
                            </div>

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

                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Email
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
                                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-[13px] outline-none transition focus:border-blue-500"
                                />
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

                            <div>
                                <label className="mb-1 block text-[13px] font-medium text-slate-600">
                                    Kata Sandi
                                </label>

                                <input
                                    type="password"
                                    placeholder="Buat kata sandi"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    className="h-10 w-full rounded-md border border-slate-200 px-3 text-[13px] outline-none transition focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-700"
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

    const handleSubmit = async () => {
        try {
            await axios.post("/api/users", form);

            await getUsers();

            setOpenModal(false);

            setForm({
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                is_admin: 0,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppLayout>
            <div className="bg-[#F7F9FC] px-4 py-4">
                {/* HEADER */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-800">
                            Manajemen Tim & Akses
                        </h1>

                        <p className="mt-0.5 text-[13px] text-slate-500">
                            Kelola staf, role, dan distribusi pipeline tim.
                        </p>
                    </div>

                    {user.is_admin == 1 && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className="rounded-[12px] bg-[#1D4ED8] px-4 py-2 text-[13px] font-semibold text-white shadow-sm"
                        >
                            + Tambah Data
                        </button>
                    )}
                </div>

                {/* CARDS */}
                <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-start justify-between rounded-[16px] bg-white px-4 py-3 shadow-sm">
                        <div>
                            <p className="text-[13px] text-slate-500">
                                Total Staff
                            </p>

                            <h2 className="mt-1 text-[24px] font-bold text-slate-800">
                                {summary.total_staff}
                            </h2>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF1FF] text-sm">
                            👥
                        </div>
                    </div>

                    <div className="flex items-start justify-between rounded-[16px] bg-white px-4 py-3 shadow-sm">
                        <div>
                            <p className="text-[13px] text-slate-500">
                                Sales Representatives
                            </p>

                            <h2 className="mt-1 text-[24px] font-bold text-slate-800">
                                {summary.total_sales}
                            </h2>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECE9FF] text-sm">
                            🎧
                        </div>
                    </div>

                    <div className="flex items-start justify-between rounded-[16px] bg-white px-4 py-3 shadow-sm">
                        <div>
                            <p className="text-[13px] text-slate-500">
                                Account Managers
                            </p>

                            <h2 className="mt-1 text-[24px] font-bold text-slate-800">
                                {summary.total_admin}
                            </h2>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFE9E0] text-sm">
                            👨‍💼
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
                                    <th className="px-3 pb-2">
                                        Nama Staff
                                    </th>

                                    <th className="px-3 pb-2">Peran</th>

                                    <th className="px-3 pb-2">
                                        Total Pelanggan
                                    </th>

                                    <th className="px-3 pb-2">
                                        Beban Kerja
                                    </th>

                                    <th className="px-3 pb-2">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {staff.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="bg-slate-50"
                                    >
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
                                            {item.total_clients} Pelanggan
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

                {/* MODAL */}
                <TambahKlienModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    form={form}
                    setForm={setForm}
                    handleSubmit={handleSubmit}
                />
            </div>
        </AppLayout>
    );
}