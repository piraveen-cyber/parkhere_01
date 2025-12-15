import React from 'react';
import {
    Users,
    Wrench, // For Mechanic
    Activity,
    AlertTriangle,
    ArrowUpRight,
    ArrowRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

// Mock Data for Charts
const bookingData = [
    { name: 'Mon', bookings: 45 },
    { name: 'Tue', bookings: 52 },
    { name: 'Wed', bookings: 48 },
    { name: 'Thu', bookings: 70 },
    { name: 'Fri', bookings: 65 },
    { name: 'Sat', bookings: 85 },
    { name: 'Sun', bookings: 90 },
];

const revenueData = [
    { name: 'W1', revenue: 4000 },
    { name: 'W2', revenue: 3000 },
    { name: 'W3', revenue: 5500, active: true }, // Current week
    { name: 'W4', revenue: 2000 },
];

// Mock Alerts Data
const priorityAlerts = [
    { id: 1, name: 'John Doe', type: 'Mechanic', risk: 'High Risk', reason: 'Multiple recent reports', color: 'red' },
    { id: 2, name: 'Sarah Smith', type: 'Customer', risk: 'Warning', reason: 'Repeated cancellations', color: 'yellow' },
    { id: 3, name: 'Mike Johnson', type: 'Mechanic', risk: 'Pending', reason: 'Document verification', color: 'blue' },
];

export default function Dashboard() {
    return (
        <div className="animate-in fade-in duration-500 space-y-8">

            {/* 1. Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Total Customers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Customers</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">24,593</h3>
                        <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">
                            <ArrowUpRight size={12} /> +12% from last month
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Users size={24} />
                    </div>
                </div>

                {/* Card 2: Total Mechanics */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Mechanics</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">1,284</h3>
                        <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">
                            <ArrowUpRight size={12} /> +5.4% growth
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                        <Wrench size={24} />
                    </div>
                </div>

                {/* Card 3: Active Bookings */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Bookings</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">482</h3>
                        <p className="text-emerald-500 text-xs font-bold mt-2 flex items-center gap-1">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live System Status
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Activity size={24} />
                    </div>
                </div>

                {/* Card 4: New Reports (Critical) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-start justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                    </div>
                    <div>
                        <p className="text-red-600 text-sm font-bold">Critical Reports</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">7</h3>
                        <p className="text-red-500 text-xs font-bold mt-2">
                            Requires immediate attention
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            {/* 2. Analytics & Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Daily Bookings Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900">Daily Bookings Overview</h3>
                            <select className="text-sm border-gray-200 rounded-lg text-slate-500 bg-slate-50">
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={bookingData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke="#3B82F6"
                                        strokeWidth={4}
                                        dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Overview */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900">Revenue Overview</h3>
                                <p className="text-sm text-slate-500">Weekly platform earnings</p>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">$14,500 <span className="text-sm text-emerald-500 font-medium">+8%</span></h3>
                        </div>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                        {revenueData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.active ? '#10B981' : '#F59E0B'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column: Priority Alerts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" size={20} /> Priority Alerts
                        </h3>
                        <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All →</a>
                    </div>

                    <div className="space-y-4">
                        {priorityAlerts.map(alert => (
                            <div key={alert.id} className="p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-slate-50/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${alert.color === 'red' ? 'bg-red-500' : alert.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{alert.type}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.color === 'red' ? 'bg-red-100 text-red-600' :
                                            alert.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {alert.risk}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm">{alert.name}</h4>
                                <p className="text-xs text-slate-500 mt-1 mb-3">{alert.reason}</p>
                                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Review Case
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <h4 className="font-bold text-blue-900 text-sm">System Status</h4>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                                <div className="h-full w-[98%] bg-blue-500 rounded-full" />
                            </div>
                            <span className="text-xs font-bold text-blue-600">98%</span>
                        </div>
                        <p className="text-[10px] text-blue-400 mt-1">All services operational</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
