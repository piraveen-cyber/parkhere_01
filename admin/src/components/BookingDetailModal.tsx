import React from 'react';
import {
    X,
    User,
    Wrench,
    MapPin,
    Clock,
    CreditCard,
    CheckCircle,
    AlertCircle,
    Navigation,
    Calendar,
    Phone
} from 'lucide-react';

interface BookingDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
}

export default function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
    if (!isOpen || !booking) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-white z-10 sticky top-0">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(booking.status)}`}>
                                {booking.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs font-mono mt-1">ID: {booking.id}</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">

                    {/* Participants Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer */}
                        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <User size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Customer</span>
                                </div>
                                <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                    <Navigation size={14} />
                                </button>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">{booking.customerName}</h3>
                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <Phone size={12} /> {booking.customerPhone}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <MapPin size={12} /> {booking.location}
                                </p>
                            </div>
                        </div>

                        {/* Mechanic */}
                        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                                        <Wrench size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Mechanic</span>
                                </div>
                            </div>
                            {booking.mechanicName ? (
                                <>
                                    <h3 className="font-bold text-slate-900 text-lg">{booking.mechanicName}</h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                            <Phone size={12} /> {booking.mechanicPhone || 'N/A'}
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                            <Clock size={12} /> Arrived in 15 mins
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-2">
                                    <p className="text-sm italic">No Mechanic Assigned</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Timeline */}
                        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                                <Clock size={16} /> Booking Timeline
                            </h4>
                            <div className="space-y-6 relative pl-2">
                                {/* Vertical Line */}
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                {/* Events */}
                                <div className="relative flex items-start gap-4">
                                    <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm shrink-0 z-10"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Booking Completed</p>
                                        <p className="text-[10px] text-slate-400">12:45 PM • Validated by System</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-4">
                                    <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-sm shrink-0 z-10"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Service Started</p>
                                        <p className="text-[10px] text-slate-400">11:30 PM • Mechanic Arrived</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-4">
                                    <div className="h-4 w-4 rounded-full bg-slate-300 border-2 border-white shadow-sm shrink-0 z-10"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">Booking Created</p>
                                        <p className="text-[10px] text-slate-400">11:15 PM • Request received</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Box */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                            <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                                <CreditCard size={16} /> Payment Summary
                            </h4>

                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Service Fee</span>
                                    <span>${(booking.amount * 0.8).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Platform Fee</span>
                                    <span>${(booking.amount * 0.15).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Tax</span>
                                    <span>${(booking.amount * 0.05).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-end justify-between">
                                <span className="text-sm font-bold text-slate-700">Total Paid</span>
                                <span className="text-xl font-bold text-emerald-600">${booking.amount.toFixed(2)}</span>
                            </div>

                            <div className="mt-4 p-3 bg-emerald-50 rounded-lg flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700">Payment Verified</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
