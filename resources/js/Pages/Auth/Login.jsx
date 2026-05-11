import React, { useState } from "react"; // <-- Tambahkan useState di sini
import { Head, useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // State untuk mengontrol visibilitas password
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        // post('/login');
        console.log("Data Login:", data);
    };

    return (
        <div className="bg-[#F8FAFC] font-manrope antialiased min-h-screen flex flex-col lg:flex-row w-full">
            <Head title="Login - Disty CRM" />

            {/* SISI KIRI */}
            <div className="hidden lg:flex lg:w-5/10 p-6 lg:p-4">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-2xl">
                    <img
                        src="images/Background_login.png"
                        alt="Skyscraper"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004CCA]/90 via-[#004CCA]/40 to-transparent"></div>
                    <div className="relative z-10 flex flex-col justify-end p-10 h-full text-white">
                        <h1 className="text-4xl font-extrabold mb-4 leading-tight">
                            Optimalkan Bisnis Anda
                        </h1>
                        <p className="text-blue-50 text-lg opacity-90 max-w-sm">
                            Kelola database pelanggan dan tingkatkan efisiensi
                            penjualan Anda dalam satu platform profesional.
                        </p>
                    </div>
                </div>
            </div>

            {/* SISI KANAN */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-[80px] lg:py-[100px]">
                {/* LOGO */}
                <div className="mb-8 flex justify-center">
                    <img
                        src="/images/Logo.png"
                        alt="Logo Disty CRM"
                        className="h-16 w-auto"
                    />
                </div>

                {/* CARD FORMULIR */}
                <div className="bg-white w-full max-w-full lg:w-[550px] lg:h-[600px] p-8 md:p-12 rounded-[10px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col justify-center">
                    {/* TEKS SELAMAT DATANG */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Selamat Datang
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Silakan masuk ke akun Anda untuk melanjutkan
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Input Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1 tracking-wider">
                                Alamat Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-[#004CCA]">
                                    <svg
                                        className="w-5 h-5 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[10px] focus:ring-4 focus:ring-blue-100 focus:border-[#004CCA] focus:bg-white transition-all text-slate-700"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div>
                            {/* "Lupa Kata Sandi" dihapus dari sini agar bisa disejajarkan di bawah */}
                            <label className="block text-xs font-bold text-slate-700 mb-2 ml-1  tracking-wider">
                                Kata Sandi
                            </label>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none group-focus-within:text-[#004CCA]">
                                    <svg
                                        className="w-5 h-5 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>

                                {/* Perubahan pada `type` */}
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="block w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-[10px] focus:ring-4 focus:ring-blue-100 focus:border-[#004CCA] focus:bg-white transition-all text-slate-700"
                                    placeholder="••••••••"
                                />

                                {/* Tombol Toggle Mata */}
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-400 hover:text-[#004CCA]"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        // Ikon Mata Terbuka
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        // Ikon Mata Tertutup (Dicoret)
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ingat Saya & Lupa Password Sejajar */}
                        {/* flex justify-between akan mendorongnya ke ujung kiri dan kanan */}
                        <div className="flex items-center justify-between ml-1 pt-1">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="w-4 h-4 text-[#004CCA] border-slate-300 rounded focus:ring-[#004CCA] cursor-pointer"
                                />
                                <label
                                    htmlFor="remember"
                                    className="ml-3 text-sm font-medium text-slate-600 cursor-pointer"
                                >
                                    Ingat Saya
                                </label>
                            </div>

                            <a
                                href="#"
                                className="text-sm font-bold text-[#004CCA] hover:underline"
                            >
                                Lupa Password?
                            </a>
                        </div>

                        {/* Tombol Masuk */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-[#004CCA] hover:bg-[#003da3] text-white font-extrabold text-lg rounded-[10px] shadow-lg shadow-[#004CCA]/20 transition-all active:scale-[0.98] mt-2"
                        >
                            {processing ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Belum punya akun?{" "}
                        <a
                            href="#"
                            className="font-bold text-[#004CCA] hover:underline"
                        >
                            Hubungi Admin
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
