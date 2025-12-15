import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Shield,
    User,
    AlertTriangle,
    CheckCircle,
    XOctagon,
    MoreHorizontal,
    Star,
    ChevronRight,
    Clock,
    CreditCard
} from 'lucide-react';
import CustomerDetailModal from '../components/CustomerDetailModal';

// Mock Data for Customers
const MOCK_CUSTOMERS = [
    {
        id: 'CUS-5001',
        name: 'Sarah Jenkins',
        email: 'sarah.j@gmail.com',
        phone: '+94 77 111 2222',
        status: 'ACTIVE', // ACTIVE, BLOCKED
        risk: 'LOW',
        totalBookings: 12,
        totalSpent: 450.00,
        lastBooking: '2 days ago',
        reportsCount: 0,
        recentBookings: [
            { id: 'BKG-101', date: '12 Dec', service: 'Oil Change', mechanicName: 'Auto Fix Zone', amount: 45.00 },
            { id: 'BKG-098', date: '10 Nov', service: 'Car Wash', mechanicName: 'City Garage', amount: 15.00 }
        ]
    },
    {
        id: 'CUS-5002',
        name: 'David Miller',
        email: 'd.miller@yahoo.com',
        phone: '+94 71 333 4444',
        status: 'ACTIVE',
        risk: 'HIGH',
        totalBookings: 3,
        totalSpent: 85.00,
        lastBooking: '1 week ago',
        reportsCount: 4,
        recentBookings: [
            { id: 'BKG-202', date: '05 Dec', service: 'Tire Repair', mechanicName: 'Speedy Motors', amount: 25.00 }
        ]
    },
    {
        id: 'CUS-5099',
        name: 'John Doe',
        email: 'jon.doe@scammer.com',
        phone: '+94 70 666 0000',
        status: 'BLOCKED',
        risk: 'HIGH',
        totalBookings: 1,
        totalSpent: 0.00,
        lastBooking: '3 months ago',
        reportsCount: 6,
        recentBookings: []
    }
];

export default function CustomerManagement() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ACTIVE, BLOCKED
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.id.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search);

        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openDetail = (customer: any) => {
        setSelectedCustomer(customer);
        setDetailOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pb-20">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Users className="text-slate-900" /> Customer Management
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Manage customer accounts, monitor activity, and prevent platform abuse.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Customers</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">1,240</h3>
                    </div>
                    <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <CheckCircle size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">8,543</h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <CreditCard size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blocked Users</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">24</h3>
                    </div>
                    <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                        <XOctagon size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-orange-400">
                    <div>
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">High Risk</p>
                        <h3 className="text-2xl font-bold text-orange-900 mt-1">12</h3>
                    </div>
                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 animate-pulse">
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
                            placeholder="Search by ID, name, email..."
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
                            <option value="BLOCKED">Blocked Only</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Contact</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Bookings</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Total Spent (LTV)</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {c.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{c.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-900">{c.phone}</p>
                                        <p className="text-xs text-slate-500">{c.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 font-bold">{c.totalBookings}</div>
                                        <p className="text-[10px] text-slate-400">Last: {c.lastBooking}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-emerald-600">${c.totalSpent.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            {c.status === 'ACTIVE' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>}
                                            {c.status === 'BLOCKED' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700">Blocked</span>}

                                            {c.risk === 'HIGH' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600">
                                                    <AlertTriangle size={10} /> High Risk
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openDetail(c)}
                                            className="px-4 py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Detail Modal */}
            <CustomerDetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                customer={selectedCustomer}
            />

        </div>
    );
}
