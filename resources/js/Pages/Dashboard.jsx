import React, { useEffect, useState } from "react";
import axios from "axios";
import AppLayout from "../Layouts/AppLayout";

// ─────────────────────────────────────────────────────────────
// Stat Card Component
// ─────────────────────────────────────────────────────────────

function StatCard({
    icon,
    iconBg,
    badge,
    badgeClass,
    label,
    value,
    sub,
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}
                >
                    {icon}
                </div>

                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}
                >
                    {badge}
                </span>
            </div>

            <p className="text-xs text-gray-400 mb-1">{label}</p>

            <p className="text-2xl font-semibold text-gray-800">
                {value}
            </p>

            <p className="text-xs text-gray-400 mt-1">
                {sub}
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Funnel Row
// ─────────────────────────────────────────────────────────────

function FunnelRow({
    label,
    value,
    percent,
    colorBar,
    colorText,
}) {
    return (
        <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">{label}</span>

                <span className={`font-medium ${colorText}`}>
                    {value}
                </span>
            </div>

            <div className="h-5 bg-gray-100 rounded">
                <div
                    className={`h-full rounded transition-all duration-700 ${colorBar}`}
                    style={{
                        width: `${percent}%`,
                    }}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Activity Icons
// ─────────────────────────────────────────────────────────────

const activityIcons = {
    phone: (
        <svg
            className="w-4 h-4 text-blue-600"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
        >
            <path d="M3 2h3l1.5 3.5-1.8 1.1a9 9 0 004.7 4.7l1.1-1.8L15 11v3a1 1 0 01-1 1A13 13 0 012 3a1 1 0 011-1z" />
        </svg>
    ),

    meeting: (
        <svg
            className="w-4 h-4 text-green-600"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
        >
            <circle cx="6" cy="5" r="2.5" />
            <path d="M1 13.5c0-2.5 2-4.5 5-4.5" />
            <circle cx="12" cy="5" r="2" />
            <path d="M11 9c1.5 0.3 3 1.5 3 4.5" />
        </svg>
    ),

    email: (
        <svg
            className="w-4 h-4 text-amber-600"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
        >
            <path d="M2 4h12v9H2z" />
            <path d="M2 4l6 5 6-5" />
        </svg>
    ),

    document: (
        <svg
            className="w-4 h-4 text-purple-600"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
        >
            <path d="M3 2h10v12H3z" />
            <line x1="6" y1="6" x2="10" y2="6" />
            <line x1="6" y1="9" x2="10" y2="9" />
        </svg>
    ),
};

// ─────────────────────────────────────────────────────────────
// Activity Item
// ─────────────────────────────────────────────────────────────

function ActivityItem({
    iconBg,
    iconType,
    title,
    description,
    time,
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
            >
                {activityIcons[iconType]}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                    {title}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                    {description}
                </p>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap">
                {time}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/dashboard")
            .then((response) => {
                setDashboardData(response.data);
            })
            .catch((error) => {
                console.error("Dashboard Error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Loading State
    if (loading) {
        return (
            <AppLayout>
                <div className="p-10 text-center text-gray-400">
                    Memuat dashboard...
                </div>
            </AppLayout>
        );
    }

    // Ambil stats
    const stats = dashboardData?.stats || {};

    // Conversion Funnel
    const funnel = [
        {
            label: "Prospek Baru",
            value:
                dashboardData?.conversion_funnel?.baru || 0,
            percent:
                dashboardData?.conversion_funnel?.baru || 0,
            colorBar: "bg-blue-500",
            colorText: "text-blue-600",
        },
        {
            label: "Dihubungi",
            value:
                dashboardData?.conversion_funnel?.dihubungi ||
                0,
            percent:
                dashboardData?.conversion_funnel
                    ?.dihubungi || 0,
            colorBar: "bg-cyan-500",
            colorText: "text-cyan-600",
        },
        {
            label: "Negosiasi",
            value:
                dashboardData?.conversion_funnel
                    ?.negosiasi || 0,
            percent:
                dashboardData?.conversion_funnel
                    ?.negosiasi || 0,
            colorBar: "bg-yellow-500",
            colorText: "text-yellow-600",
        },
        {
            label: "Deal",
            value:
                dashboardData?.conversion_funnel?.deal || 0,
            percent:
                dashboardData?.conversion_funnel?.deal || 0,
            colorBar: "bg-green-500",
            colorText: "text-green-600",
        },
        {
            label: "Ditolak",
            value:
                dashboardData?.conversion_funnel
                    ?.ditolak || 0,
            percent:
                dashboardData?.conversion_funnel
                    ?.ditolak || 0,
            colorBar: "bg-red-500",
            colorText: "text-red-600",
        },
    ];

    // Activities
    const activities =
        dashboardData?.activities?.map((item) => ({
            iconBg: "bg-blue-50",
            iconType: "phone",
            title:
                item.company_name ||
                item.nama_client ||
                "Aktivitas Baru",
            description:
                item.notes ||
                item.description ||
                "Aktivitas prospek",
            time: item.created_at
                ? new Date(
                      item.created_at
                  ).toLocaleDateString("id-ID")
                : "-",
        })) || [];

    // Reminder Alerts
    const alerts =
        dashboardData?.reminders?.map((item) => ({
            label: "REMINDER",
            labelColor: "text-red-600",
            title:
                item.company_name ||
                item.nama_client,
            subtitle:
                item.description ||
                "Follow up pelanggan",
            btnText: "Lihat Reminder",
            btnClass: "bg-red-500",
            cardClass:
                "bg-red-50 border-red-500",
        })) || [];

    return (
        <AppLayout>
            {/* HEADER */}
            <div className="mb-5">
                <h1 className="text-[22px] font-semibold text-gray-900">
                    Dashboard CRM
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Ringkasan performa prospek dan pelanggan.
                </p>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                    iconBg="bg-blue-50"
                    icon={
                        <svg
                            className="w-4 h-4 text-blue-600"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        >
                            <circle
                                cx="8"
                                cy="8"
                                r="6"
                            />
                        </svg>
                    }
                    badge="+"
                    badgeClass="bg-blue-50 text-blue-700"
                    label="Total Target Market"
                    value={
                        stats.total_target_market || 0
                    }
                    sub="Seluruh prospek"
                />

                <StatCard
                    iconBg="bg-cyan-50"
                    icon={
                        <svg
                            className="w-4 h-4 text-cyan-600"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        >
                            <circle
                                cx="8"
                                cy="8"
                                r="6"
                            />
                        </svg>
                    }
                    badge="Aktif"
                    badgeClass="bg-cyan-50 text-cyan-700"
                    label="Prospek Aktif"
                    value={stats.prospek_aktif || 0}
                    sub="Sedang diproses"
                />

                <StatCard
                    iconBg="bg-green-50"
                    icon={
                        <svg
                            className="w-4 h-4 text-green-600"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        >
                            <circle
                                cx="8"
                                cy="8"
                                r="6"
                            />
                        </svg>
                    }
                    badge="Deal"
                    badgeClass="bg-green-50 text-green-700"
                    label="Pelanggan Berhasil"
                    value={
                        stats.pelanggan_berhasil || 0
                    }
                    sub="Berhasil dikonversi"
                />

                <StatCard
                    iconBg="bg-orange-50"
                    icon={
                        <svg
                            className="w-4 h-4 text-orange-600"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                        >
                            <polyline points="2,12 6,7 9,10 14,4" />
                        </svg>
                    }
                    badge="%"
                    badgeClass="bg-orange-50 text-orange-700"
                    label="Tingkat Konversi"
                    value={`${stats.conversion_rate || 0}%`}
                    sub="Persentase deal"
                />
            </div>

            {/* CONVERSION FUNNEL */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
                <h2 className="text-sm font-semibold text-gray-800 mb-5">
                    Corong Konversi
                </h2>

                {funnel.map((item, i) => (
                    <FunnelRow key={i} {...item} />
                ))}
            </div>

            {/* ACTIVITIES */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">
                    Aktivitas Terkini
                </h2>

                {activities.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        Belum ada aktivitas.
                    </p>
                ) : (
                    activities.map((activity, i) => (
                        <ActivityItem
                            key={i}
                            {...activity}
                        />
                    ))
                )}
            </div>

            {/* ALERTS */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-red-600 mb-4">
                    Reminder Aktif
                </h2>

                {alerts.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        Tidak ada reminder aktif.
                    </p>
                ) : (
                    alerts.map((alert, i) => (
                        <div
                            key={i}
                            className={`rounded-lg p-3.5 mb-3 border-l-4 ${alert.cardClass}`}
                        >
                            <p
                                className={`text-[10px] font-semibold tracking-wider mb-1 ${alert.labelColor}`}
                            >
                                {alert.label}
                            </p>

                            <p className="text-sm font-semibold text-gray-800">
                                {alert.title}
                            </p>

                            <p className="text-xs text-gray-500 mt-0.5">
                                {alert.subtitle}
                            </p>

                            <button
                                className={`w-full mt-3 py-2 rounded-lg text-xs font-semibold text-white ${alert.btnClass}`}
                            >
                                {alert.btnText}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </AppLayout>
    );
}