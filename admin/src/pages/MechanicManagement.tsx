import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Shield,
    Wrench,
    AlertTriangle,
    CheckCircle,
    XOctagon,
    MoreHorizontal,
    Star,
    ChevronRight,
    Clock
} from 'lucide-react';
import MechanicDetailModal from '../components/MechanicDetailModal';

// Mock Data for Mechanics
const MOCK_MECHANICS = [
    {
        id: 'MEC-1001',
        name: 'Auto Fix Zone',
        email: 'contact@autofix.com',
        phone: '+94 77 123 4567',
        status: 'ACTIVE', // ACTIVE, SUSPENDED, BLOCKED
        isVerified: true,
        risk: 'LOW',
        rating: 4.8,
        totalJobs: 142,
        experience: '5 Years',
        skills: ['Engine Repair', 'Brake System', 'Oil Change'],
        reportsCount: 0
    },
    {
        id: 'MEC-1002',
        name: 'Quick Repairs Ltd',
        email: 'quick@repairs.lk',
        phone: '+94 71 999 8888',
        status: 'ACTIVE',
        isVerified: false,
        risk: 'MEDIUM',
        rating: 3.5,
        totalJobs: 24,
        experience: '2 Years',
        skills: ['Tire Change', 'Battery'],
        reportsCount: 1
    },
    {
        id: 'MEC-1045',
        name: 'Speedy Motors',
        email: 'speedy@gmail.com',
        phone: '+94 76 555 1234',
        status: 'SUSPENDED',
        isVerified: true,
        risk: 'HIGH',
        rating: 2.1,
        totalJobs: 56,
        experience: '3 Years',
        skills: ['General Service'],
        reportsCount: 5
    },
    {
        id: 'MEC-1099',
        name: 'City Garage',
        email: 'admin@citygarage.com',
        phone: '+94 11 222 3333',
        status: 'BLOCKED',
        isVerified: true,
        risk: 'HIGH',
        rating: 1.5,
        totalJobs: 12,
        experience: '1 Year',
        skills: ['Car Wash', 'Interior Cleaning'],
        reportsCount: 8
    }
];

export default function MechanicManagement() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filteredMechanics = MOCK_MECHANICS.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.id.toLowerCase().includes(search.toLowerCase()) ||
            m.phone.includes(search);

        const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openDetail = (mechanic: any) => {
        setSelectedMechanic(mechanic);
        setDetailOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pb-20">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Wrench className="text-slate-900" /> Mechanic Management
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Manage service providers, verify credentials, and control access.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Mechanics</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">124</h3>
                    </div>
                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <CheckCircle size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">98</h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Shield size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suspended</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">5</h3>
                    </div>
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
                    <div>
                        <p className="text-xs font-bold text-red-400 uppercase tracking-wider">High Risk</p>
                        <h3 className="text-2xl font-bold text-red-900 mt-1">3</h3>
                    </div>
                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 animate-pulse">
                        <AlertTriangle size={20} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Search & Filter */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full shadow-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 md:flex-none pl-2 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white font-medium hover:border-gray-300 transition-colors cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active Only</option>
                            <option value="SUSPENDED">Suspended</option>
                            <option value="BLOCKED">Blocked</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-wider">Mechanic</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Skills</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Rating</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMechanics.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {m.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{m.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{m.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-900">{m.phone}</p>
                                        <p className="text-xs text-slate-500">{m.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {m.skills.slice(0, 2).map((skill: string) => (
                                                <span key={skill} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded textxs text-slate-600 text-[10px]">
                                                    {skill}
                                                </span>
                                            ))}
                                            {m.skills.length > 2 && (
                                                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded textxs text-slate-600 text-[10px]">
                                                    +{m.skills.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 font-bold text-slate-900">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400" /> {m.rating}
                                        </div>
                                        <p className="text-[10px] text-slate-400">{m.totalJobs} jobs</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {m.status === 'ACTIVE' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>}
                                            {m.status === 'SUSPENDED' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-orange-100 text-orange-700">Suspended</span>}
                                            {m.status === 'BLOCKED' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700">Blocked</span>}

                                            {m.risk === 'HIGH' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                                                    <AlertTriangle size={10} /> High Risk
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openDetail(m)}
                                            className="px-4 py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Detail Modal */}
            <MechanicDetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                mechanic={selectedMechanic}
            />

        </div>
    );
}
