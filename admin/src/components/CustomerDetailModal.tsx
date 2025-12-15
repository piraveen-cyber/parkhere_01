import React, { useState } from 'react';
import {
    X,
    Shield,
    AlertTriangle,
    Clock,
    FileText,
    CheckCircle,
    XOctagon,
    User,
    Phone,
    Mail,
    CreditCard,
    Calendar,
    ArrowLeft,
    AlertOctagon,
    Banknote
} from 'lucide-react';

interface CustomerDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: any; // Using any for prototyping
}

type ActionView = 'DETAILS' | 'CONFIRM_WARNING' | 'CONFIRM_BLOCK';

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
    const [view, setView] = useState<ActionView>('DETAILS');
    const [actionReason, setActionReason] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [blockConfirmation, setBlockConfirmation] = useState('');

    if (!isOpen || !customer) return null;

    const handleClose = () => {
        setView('DETAILS');
        setActionReason('');
        setAdminNote('');
        setBlockConfirmation('');
        onClose();
    };

    const handleActionSubmit = (actionType: string) => {
        console.log(`Action Submitted: ${actionType}`, {
            customerId: customer.id,
            reason: actionReason,
            adminNote
        });
        handleClose();
    };

    const toggleView = (v: ActionView) => {
        setActionReason('');
        setBlockConfirmation('');
        setView(v);
    };

    const renderHeader = () => {
        if (view === 'DETAILS') {
            return (
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 bg-white rounded-t-2xl z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-slate-200">
                            {customer.name[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {customer.name}
                                {customer.status === 'ACTIVE' && <CheckCircle size={16} className="text-emerald-500" />}
                            </h2>
                            <p className="text-xs text-slate-400 font-mono">ID: {customer.id}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            );
        }

        // Action Headers
        let title = '';
        let colorClass = '';
        let icon = null;

        if (view === 'CONFIRM_WARNING') {
            title = 'Send Formal Warning';
            colorClass = 'text-yellow-600';
            icon = <AlertTriangle className="text-yellow-500" />;
        } else if (view === 'CONFIRM_BLOCK') {
            title = 'Block Customer Account';
            colorClass = 'text-red-600';
            icon = <XOctagon className="text-red-500" />;
        }

        return (
            <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 bg-white rounded-t-2xl z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView('DETAILS')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${colorClass}`}>
                            {icon} {title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Action will be logged in audit trail
                        </p>
                    </div>
                </div>
                <button onClick={handleClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors">
                    <X size={20} />
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            {/* Centered Modal Panel */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

                {renderHeader()}

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">

                    {view === 'DETAILS' ? (
                        <>
                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${mechanicStatusClass(customer.status)}`}>
                                    {customer.status}
                                </span>

                                {customer.risk === 'HIGH' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 flex items-center gap-1 animate-pulse">
                                        <AlertOctagon size={12} /> High Risk ({customer.reportsCount} Reports)
                                    </span>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Phone size={14} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Contact</span>
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm">{customer.phone}</p>
                                    <p className="text-xs text-slate-500">{customer.email}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Banknote size={14} className="text-emerald-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Total Spent</span>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-bold text-slate-900">${customer.totalSpent}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Across {customer.totalBookings} bookings</p>
                                </div>
                            </div>

                            {/* Recent Booking History */}
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                    <Clock size={16} /> Recent Activity
                                </h4>
                                <div className="space-y-3">
                                    {customer.recentBookings && customer.recentBookings.length > 0 ? (
                                        customer.recentBookings.map((booking: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs">
                                                        {booking.date.split(' ')[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{booking.service}</p>
                                                        <p className="text-xs text-slate-500">{booking.mechanicName}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-slate-900">${booking.amount}</p>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{booking.id}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No recent bookings found.</p>
                                    )}
                                </div>
                            </div>

                        </>
                    ) : view === 'CONFIRM_WARNING' ? (
                        <div className="space-y-6 py-4">
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                                <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-yellow-800 text-sm">Send Warning</h4>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        The customer will be marked for misuse. No booking access will be blocked, but their risk score will increase.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Warning Reason</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                    placeholder="e.g., Rude behavior to mechanic"
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Internal Note (Optional)</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none h-24"
                                    placeholder="Private admin note..."
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                                <XOctagon className="text-red-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-red-800 text-sm">Block Customer</h4>
                                    <p className="text-xs text-red-700 mt-1">
                                        This customer will be strictly blocked from creating new bookings or making payments. Existing bookings may be auto-cancelled.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Block Reason (Required)</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-400 outline-none resize-none h-32"
                                    placeholder="Detailed Reason for blocking..."
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmation</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-red-200 bg-red-50 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none font-mono"
                                    placeholder="Type 'BLOCK' to confirm"
                                    value={blockConfirmation}
                                    onChange={(e) => setBlockConfirmation(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-100 bg-white p-6">
                    {view === 'DETAILS' ? (
                        <div className="grid grid-cols-2 gap-4">
                            {customer.status === 'ACTIVE' ? (
                                <>
                                    <button
                                        onClick={() => toggleView('CONFIRM_WARNING')}
                                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-bold text-sm transition-all"
                                    >
                                        <AlertTriangle size={18} /> Send Warning
                                    </button>
                                    <button
                                        onClick={() => toggleView('CONFIRM_BLOCK')}
                                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-bold text-sm transition-all"
                                    >
                                        <XOctagon size={18} /> Block Customer
                                    </button>
                                </>
                            ) : (
                                <button
                                    disabled
                                    className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm cursor-not-allowed"
                                >
                                    <XOctagon size={18} /> Account is Blocked
                                </button>
                            )}
                        </div>
                    ) : view === 'CONFIRM_WARNING' ? (
                        <div className="flex gap-4">
                            <button onClick={() => toggleView('DETAILS')} className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('WARNING')}
                                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-500/20 transition-all"
                            >
                                Send Warning
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <button onClick={() => toggleView('DETAILS')} className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('BLOCK')}
                                disabled={blockConfirmation !== 'BLOCK'}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Block
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function mechanicStatusClass(status: string) {
    switch (status) {
        case 'ACTIVE': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        case 'BLOCKED': return 'bg-red-50 text-red-600 border-red-200';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
}
