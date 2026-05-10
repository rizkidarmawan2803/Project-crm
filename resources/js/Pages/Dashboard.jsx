import React from 'react';
import AppLayout from '../Layouts/AppLayout';

// Stat Card Component
function StatCard({ icon, iconBg, badge, badgeClass, label, value, sub }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
                    {icon}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
                    {badge}
                </span>
            </div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
    );
}

// Funnel Row Component
function FunnelRow({ label, value, suffix, percent, colorBar, colorText }) {
    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">{label}</span>
                <span className={`font-medium ${colorText}`}>{value} {suffix}</span>
            </div>
            <div className="h-5 bg-gray-100 rounded">
                <div
                    className={`h-full rounded transition-all duration-700 ${colorBar}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

// Activity Item Component
function ActivityItem({ iconBg, icon, title, description, time }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
        </div>
    );
}

// Alert Card Component
function AlertCard({ label, labelColor, title, subtitle, btnText, btnClass, cardClass }) {
    return (
        <div className={`rounded-lg p-3.5 mb-3 border-l-4 ${cardClass}`}>
            <p className={`text-[10px] font-semibold tracking-wider mb-1 ${labelColor}`}>{label}</p>
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            <button className={`w-full mt-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90 ${btnClass}`}>
                {btnText}
            </button>
        </div>
    );
}

export default function Dashboard({ stats, funnel, activities, alerts, weekly_trend, peak_performance }) {
    return (
        <AppLayout>

            {/* STAT CARDS */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard
                    iconBg="bg-blue-50"
                    icon={<svg className="w-4 h-4 text-blue-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="8" r="6"/><path d="M4 8a4 4 0 014-4"/></svg>}
                    badge="+4.2%"
                    badgeClass="bg-green-50 text-green-700"
                    label="Total Target Market"
                    value={stats.total_target_market.toLocaleString()}
                    sub="dibandingkan bulan lalu"
                />
                <StatCard
                    iconBg="bg-teal-50"
                    icon={<svg className="w-4 h-4 text-teal-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M8 2C5 2 3 4 3 7c0 1.5.5 2.8 1.3 3.7L3 14l3.5-1c.5.2 1 .3 1.5.3 3 0 5-2 5-5S11 2 8 2z"/></svg>}
                    badge={`+${stats.prospek_today} today`}
                    badgeClass="bg-blue-50 text-blue-700"
                    label="Prospek Aktif"
                    value={stats.prospek_aktif}
                    sub="status aktif"
                />
                <StatCard
                    iconBg="bg-green-50"
                    icon={<svg className="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="8" cy="6" r="3"/><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>}
                    badge="Sesuai rencana"
                    badgeClass="bg-green-50 text-green-700"
                    label="Pelanggan Berhasil"
                    value={stats.pelanggan_berhasil}
                    sub="melampaui target"
                />
                <StatCard
                    iconBg="bg-red-50"
                    icon={<svg className="w-4 h-4 text-red-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="2,12 6,7 9,10 14,4"/></svg>}
                    badge="-0.4%"
                    badgeClass="bg-red-50 text-red-600"
                    label="Tingkat Konversi"
                    value={`${stats.tingkat_konversi}%`}
                    sub="rata rata bulanan"
                />
            </div>

            {/* CORONG KONVERSI */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold text-gray-800">Corong Konversi</h2>
                    <a href="#" className="text-xs text-blue-600 hover:underline">Lihat Laporan Lengkap →</a>
                </div>
                {funnel.map((item, i) => (
                    <FunnelRow key={i} {...item} />
                ))}
            </div>

            {/* AKTIVITAS TERKINI */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
                <h2 className="text-sm font-semibold text-gray-800 mb-2">Aktivitas Terkini</h2>
                <div className="divide-y divide-gray-50">
                    {activities.map((activity, i) => (
                        <ActivityItem key={i} {...activity} />
                    ))}
                </div>
            </div>

            {/* BARIS BAWAH */}
            <div className="grid grid-cols-2 gap-5">

                {/* Peringatan Mendesak */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <h2 className="text-sm font-semibold text-red-600 mb-4 flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="8" cy="8" r="6"/>
                            <path d="M8 5v3M8 10.5v0.5" strokeLinecap="round"/>
                        </svg>
                        Peringatan Mendesak
                    </h2>
                    {alerts.map((alert, i) => (
                        <AlertCard key={i} {...alert} />
                    ))}
                </div>

                {/* Tren Mingguan */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <h2 className="text-sm font-semibold text-gray-800 mb-4">Tren Mingguan</h2>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-2 h-28">
                        {weekly_trend.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className={`w-full rounded-t transition-all duration-500 ${day.active ? 'bg-blue-500' : 'bg-gray-100'}`}
                                    style={{ height: `${day.height}px` }}
                                />
                                <span className={`text-[10px] ${day.active ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                                    {day.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Performa Puncak */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400">Performa Puncak</p>
                            <p className="text-sm font-semibold text-gray-800">{peak_performance}</p>
                        </div>
                        <svg className="w-10 h-5" viewBox="0 0 40 20" fill="none">
                            <polyline points="2,16 10,12 18,14 28,6 38,4" stroke="#3B6D11" strokeWidth="1.5" fill="none"/>
                        </svg>
                    </div>
                </div>
            </div>

        </AppLayout>
    );
}
