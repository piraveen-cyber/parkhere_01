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
    Star,
    Wrench,
    ArrowLeft,
    AlertOctagon
} from 'lucide-react';

interface MechanicDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    mechanic: any; // Using any for prototyping
}

type ActionView = 'DETAILS' | 'CONFIRM_SUSPEND' | 'CONFIRM_BLOCK';

export default function MechanicDetailModal({ isOpen, onClose, mechanic }: MechanicDetailModalProps) {
    const [view, setView] = useState<ActionView>('DETAILS');
    const [actionReason, setActionReason] = useState('');
    const [suspensionDuration, setSuspensionDuration] = useState('24h');
    const [blockConfirmation, setBlockConfirmation] = useState('');

    if (!isOpen || !mechanic) return null;

    const handleClose = () => {
        setView('DETAILS');
        setActionReason('');
        setBlockConfirmation('');
        onClose();
    };

    const handleActionSubmit = (actionType: string) => {
        console.log(`Action Submitted: ${actionType}`, {
            mechanicId: mechanic.id,
            reason: actionReason,
            suspensionDuration: actionType === 'SUSPEND' ? suspensionDuration : null
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
                            {mechanic.name[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {mechanic.name}
                                {mechanic.isVerified && <CheckCircle size={16} className="text-blue-500" />}
                            </h2>
                            <p className="text-xs text-slate-400 font-mono">ID: {mechanic.id}</p>
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

        if (view === 'CONFIRM_SUSPEND') {
            title = 'Suspend Mechanic Access';
            colorClass = 'text-orange-600';
            icon = <Clock className="text-orange-500" />;
        } else if (view === 'CONFIRM_BLOCK') {
            title = 'Permanently Block Mechanic';
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
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${mechanic.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    mechanic.status === 'SUSPENDED' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                        'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                    {mechanic.status === 'ACTIVE' ? 'Active Partner' : mechanic.status}
                                </span>

                                {mechanic.risk === 'HIGH' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 border border-red-200 flex items-center gap-1 animate-pulse">
                                        <AlertOctagon size={12} /> High Risk ({mechanic.reportsCount} Reports)
                                    </span>
                                )}

                                {mechanic.isVerified ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                                        <Shield size={12} /> Verified
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                                        <Clock size={12} /> Verification Pending
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
                                    <p className="font-bold text-slate-900 text-sm">{mechanic.phone}</p>
                                    <p className="text-xs text-slate-500">{mechanic.email}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Performance</span>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-bold text-slate-900">{mechanic.rating}</span>
                                        <span className="text-xs text-slate-400 mb-1">/ 5.0</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{mechanic.totalJobs} Lifetime Jobs</p>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                    <Wrench size={16} /> Skills & Expertise
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {mechanic.skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                    <FileText size={16} /> Document Verification
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white border border-emerald-100 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
                                                <CheckCircle size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Government ID</p>
                                                <p className="text-[10px] text-slate-400">Verified on 12 Dec 2024</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Verified</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white border border-amber-100 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-amber-50 rounded flex items-center justify-center text-amber-600">
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">Mechanic Cert.</p>
                                                <p className="text-[10px] text-slate-400">Uploaded 2 hours ago</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Pending</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : view === 'CONFIRM_SUSPEND' ? (
                        <div className="space-y-6 py-4">
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
                                <Clock className="text-orange-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-orange-800 text-sm">Temporary Suspension</h4>
                                    <p className="text-xs text-orange-700 mt-1">
                                        The mechanic will be blocked from accepting new bookings for the duration. Existing bookings must be cancelled manually if needed.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Suspension Duration</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['24 Hours', '3 Days', '7 Days'].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setSuspensionDuration(d)}
                                            className={`py-2 px-3 rounded-lg text-sm font-bold border transition-all ${suspensionDuration === d
                                                ? 'bg-orange-100 border-orange-300 text-orange-800'
                                                : 'bg-white border-gray-200 text-slate-500 hover:border-gray-300'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Reason (Required)</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none resize-none h-32"
                                    placeholder="Explain why this suspension is necessary..."
                                    value={actionReason}
                                    onChange={(e) => setActionReason(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                                <XOctagon className="text-red-500 shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-red-800 text-sm">Permanent Block</h4>
                                    <p className="text-xs text-red-700 mt-1">
                                        Strict Action: This mechanic will be permanently banned from the platform. Identity documents will be blacklisted.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Final Reason (Required)</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-400 outline-none resize-none h-32"
                                    placeholder="Detailed justification for permanent ban..."
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
                            {mechanic.status === 'ACTIVE' && (
                                <button
                                    onClick={() => toggleView('CONFIRM_SUSPEND')}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold text-sm transition-all"
                                >
                                    <Clock size={18} /> Suspend Access
                                </button>
                            )}
                            <button
                                onClick={() => toggleView('CONFIRM_BLOCK')}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-bold text-sm transition-all col-span-1"
                            >
                                <XOctagon size={18} /> Block Permanently
                            </button>
                        </div>
                    ) : view === 'CONFIRM_SUSPEND' ? (
                        <div className="flex gap-4">
                            <button onClick={() => toggleView('DETAILS')} className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('SUSPEND')}
                                disabled={!actionReason}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Suspension
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
