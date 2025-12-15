import React, { useEffect, useState } from "react";
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "lucide-react";

interface Stats {
    partners: { total: number; pending: number };
    bookings: { total: number };
    revenue: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Try catch to handle if endpoint doesn't exist yet/fails
                // Use default data if fails for Dev UX
                // const { data } = await axios.get("http://localhost:5000/api/admin/stats");
                // setStats(data);

                // MOCK DATA FOR REBUILD (Until backend endpoint is verified live)
                setTimeout(() => {
                    setStats({
                        partners: { total: 124, pending: 8 },
                        bookings: { total: 8543 },
                        revenue: 125040
                    });
                    setLoading(false);
                }, 1000);

            } catch (error) {
                console.error("Failed to fetch stats", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({
        title,
        value,
        subValue,
        icon: Icon,
        trend, // 'up' | 'down' | 'neutral'
        colorClass
    }: any) => (
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.text}`}>
                <Icon size={64} />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg ${colorClass.bg} ${colorClass.text}`}>
                        <Icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">{title}</span>
                </div>

                <div>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        {trend === 'up' && <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"><ArrowUpRight size={12} /> +12.5%</span>}
                        {trend === 'down' && <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded"><ArrowDownRight size={12} /> -2.4%</span>}
                        <span className="text-xs text-slate-400 font-medium">{subValue}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading)
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
                    <p className="text-sm font-bold text-slate-400 animate-pulse">Loading Dashboard...</p>
                </div>
            </div>
        );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-2">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time metrics and performance indicators</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                    <button className="px-3 py-1.5 text-xs font-bold bg-slate-900 text-white rounded shadow-sm">Today</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded transition-colors">7 Days</button>
                    <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded transition-colors">30 Days</button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.revenue?.toLocaleString() || '0'}`}
                    subValue="Gross Volume"
                    icon={DollarSign}
                    trend="up"
                    colorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
                />

                <StatCard
                    title="Platform Net"
                    value={`$${(stats?.revenue ? stats.revenue * 0.15 : 0).toLocaleString()}`}
                    subValue="15% Commission"
                    icon={TrendingUp}
                    trend="up"
                    colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                />

                <StatCard
                    title="Total Bookings"
                    value={stats?.bookings?.total || 0}
                    subValue="All services combined"
                    icon={Calendar}
                    trend="up"
                    colorClass={{ bg: 'bg-violet-50', text: 'text-violet-600' }}
                />

                <StatCard
                    title="Active Partners"
                    value={stats?.partners?.total || 0}
                    subValue={`${stats?.partners?.pending || 0} pending review`}
                    icon={Users}
                    trend="neutral"
                    colorClass={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
                />
            </div>

            {/* ANALYTICS + ACTIVITY */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* REVENUE CHART */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
                            <p className="text-xs text-slate-500">Income trends over the last 7 days</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Parking
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div> Services
                            </span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-2 sm:gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group">
                                <div className="relative w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 opacity-80 group-hover:opacity-100 transition-all duration-300" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        ${h * 150}
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-slate-100 mt-2 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 px-2 uppercase tracking-wider">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* ACTIVITY FEED */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" /> Live Feed
                    </h3>

                    <div className="flex-1 space-y-0 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-100 group">
                                <div className={`absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-white ring-1 ring-slate-100 ${i % 2 === 0 ? "bg-emerald-500" : "bg-blue-500"}`}></div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-sm transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-bold text-slate-800">New Booking #{2024 + i}</p>
                                        <span className="text-xs font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-sm">$24.00</span>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                        <Clock size={10} /> {i * 15} mins ago • {i % 2 === 0 ? 'City Center, NY' : 'Westside Mall, LA'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm font-bold text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
