import React, { useState } from 'react';
import {
    Calendar,
    Search,
    Filter,
    MapPin,
    Clock,
    User,
    Wrench,
    MoreHorizontal,
    ChevronRight,
    CreditCard,
    CheckCircle,
    XCircle,
    AlertCircle,
    Navigation,
    Layers
} from 'lucide-react';
import BookingDetailModal from '../components/BookingDetailModal';

// Mock Data
const MOCK_BOOKINGS = [
    {
        id: 'BKG-9876',
        customerName: 'Alice Johnson',
        customerPhone: '+94 77 000 1111',
        mechanicName: 'Auto Fix Zone',
        mechanicPhone: '+94 77 888 9999',
        service: 'Engine Failure',
        status: 'PENDING',
        location: 'Colombo 03',
        time: '10 mins ago',
        amount: 85.00,
        paymentStatus: 'PENDING'
    },
    {
        id: 'BKG-9875',
        customerName: 'Bob Smith',
        customerPhone: '+94 71 222 3333',
        mechanicName: 'City Garage',
        mechanicPhone: '+94 77 444 5555',
        service: 'Flat Tire',
        status: 'IN_PROGRESS',
        location: 'Kandy Road',
        time: '45 mins ago',
        amount: 45.00,
        paymentStatus: 'PENDING'
    },
    {
        id: 'BKG-9874',
        customerName: 'Charlie Brown',
        customerPhone: '+94 76 666 7777',
        mechanicName: 'Speedy Motors',
        mechanicPhone: '+94 70 123 1234',
        service: 'Oil Change',
        status: 'COMPLETED',
        location: 'Galle Face',
        time: '2 hours ago',
        amount: 35.00,
        paymentStatus: 'PAID'
    },
    {
        id: 'BKG-9870',
        customerName: 'David Lee',
        customerPhone: '+94 77 555 6666',
        mechanicName: null,
        service: 'Battery Jump',
        status: 'CANCELLED',
        location: 'Negombo',
        time: 'Yesterday',
        amount: 25.00,
        paymentStatus: 'VOID'
    }
];

export default function BookingsManagement() {
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filteredBookings = MOCK_BOOKINGS.filter(b => {
        const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
        const matchesSearch =
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.customerName.toLowerCase().includes(search.toLowerCase()) ||
            (b.mechanicName && b.mechanicName.toLowerCase().includes(search.toLowerCase())) ||
            b.service.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleViewDetails = (booking: any) => {
        setSelectedBooking(booking);
        setDetailOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Calendar className="text-slate-900" /> Bookings Management
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Monitor live operations, track assignments, and review histories.
                </p>
            </div>

            {/* Filter Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Pending', value: '12', status: 'PENDING', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
                    { label: 'In Progress', value: '45', status: 'IN_PROGRESS', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                    { label: 'Completed', value: '892', status: 'COMPLETED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                    { label: 'Cancelled', value: '34', status: 'CANCELLED', color: 'bg-red-50 text-red-600 border-red-100' }
                ].map((card) => (
                    <button
                        key={card.status}
                        onClick={() => setStatusFilter(card.status)}
                        className={`p-4 rounded-xl border flex flex-col items-start transition-all ${statusFilter === card.status
                                ? 'ring-2 ring-slate-900 shadow-md transform scale-[1.02]'
                                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                            }`}
                    >
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${card.color}`}>
                            {card.status.replace('_', ' ')}
                        </span>
                        <span className="text-2xl font-bold text-slate-900">{card.value}</span>
                        <span className="text-xs text-slate-500 font-medium">{card.label}</span>
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search bookings by ID, customer, mechanic..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {statusFilter !== 'ALL' && (
                        <button
                            onClick={() => setStatusFilter('ALL')}
                            className="px-3 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Clear Filter
                        </button>
                    )}
                    <div className="px-3 py-2 bg-slate-100 text-slate-500 text-sm font-bold rounded-lg border border-slate-200">
                        {filteredBookings.length} Results
                    </div>
                </div>
            </div>

            {/* Booking Cards Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">

                        {/* Card Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-700 font-bold border border-slate-200">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900">{booking.service}</h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getStatusStyle(booking.status)}`}>
                                            {booking.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{booking.id} • {booking.time}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">${booking.amount.toFixed(2)}</p>
                                <p className={`text-[10px] font-bold ${booking.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-slate-400'
                                    }`}>
                                    {booking.paymentStatus}
                                </p>
                            </div>
                        </div>

                        {/* Middle: Participants */}
                        <div className="flex items-stretch gap-2 bg-slate-50 p-2 rounded-lg border border-gray-100">
                            {/* Customer Side */}
                            <div className="flex-1 p-3 bg-white rounded border border-gray-200 shadow-sm">
                                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1 flex items-center gap-1">
                                    <User size={10} /> Customer
                                </p>
                                <p className="font-bold text-slate-900 text-sm">{booking.customerName}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin size={10} /> {booking.location}
                                </p>
                            </div>

                            {/* Mechanic Side */}
                            <div className="flex-1 p-3 bg-white rounded border border-gray-200 shadow-sm relative overflow-hidden">
                                <p className="text-[10px] font-bold text-amber-600 uppercase mb-1 flex items-center gap-1">
                                    <Wrench size={10} /> Mechanic
                                </p>
                                {booking.mechanicName ? (
                                    <>
                                        <p className="font-bold text-slate-900 text-sm">{booking.mechanicName}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-xs text-slate-500">Assigned</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col justify-center">
                                        <p className="text-xs text-slate-400 italic">Pending Assignment</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer: Actions */}
                        <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 mt-auto">
                            {booking.status === 'PENDING' && !booking.mechanicName && (
                                <button className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-lg shadow-sm transition-colors">
                                    Assign Mechanic
                                </button>
                            )}

                            {booking.status === 'IN_PROGRESS' && (
                                <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 hover:border-blue-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
                                    <Navigation size={14} /> Track Live
                                </button>
                            )}

                            <button
                                onClick={() => handleViewDetails(booking)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                                View Details <ChevronRight size={14} />
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            <BookingDetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                booking={selectedBooking}
            />

        </div>
    );
}
