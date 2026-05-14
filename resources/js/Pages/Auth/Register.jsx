import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <>
            <Head title="Register" />

            {/* Full Screen Background */}
            <div
                className="min-h-screen w-full flex items-center justify-center px-4 py-8 relative overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/images/Background_Login.png')",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-900/40"></div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-2xl">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src="/images/Logo.png"
                            alt="Disty CRM"
                            className="h-14 w-auto object-contain"
                        />
                    </div>

                    {/* Register Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900">
                                Buat Akun Admin
                            </h1>
                            <p className="mt-3 text-gray-500">
                                Daftarkan akun administrator untuk mengelola
                                sistem Disty CRM
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-5">
                            {/* Nama */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Depan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan nama depan"
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Belakang
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData(
                                                "last_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan nama belakang"
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="admin@disty.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kata Sandi
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Minimal 6 karakter"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            data.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ulangi password"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200 disabled:opacity-50"
                            >
                                {processing
                                    ? "Mendaftarkan..."
                                    : "Daftar sebagai Admin"}
                            </button>

                            {/* Link Login */}
                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-500">
                                    Sudah memiliki akun?{" "}
                                    <Link
                                        href="/login"
                                        className="text-blue-600 font-semibold hover:underline"
                                    >
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}