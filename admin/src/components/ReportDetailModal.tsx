import React, { useState } from 'react';
import {
    X,
    Shield,
    AlertTriangle,
    Clock,
    FileText,
    Camera,
    Mic,
    CheckCircle,
    XOctagon,
    AlertOctagon,
    MessageSquare,
    ArrowLeft,
    Send
} from 'lucide-react';

interface ReportDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: any; // Using any for rough prototyping, moving to strictly typed interfaces later
}

type ActionView = 'DETAILS' | 'CONFIRM_WARNING' | 'CONFIRM_SUSPEND' | 'CONFIRM_BLOCK' | 'CONFIRM_RESOLVE';

export default function ReportDetailModal({ isOpen, onClose, report }: ReportDetailModalProps) {
    const [view, setView] = useState<ActionView>('DETAILS');
    const [adminNote, setAdminNote] = useState('');
    const [actionReason, setActionReason] = useState('');
    const [suspensionDuration, setSuspensionDuration] = useState('24h');
    const [blockConfirmation, setBlockConfirmation] = useState('');

    if (!isOpen || !report) return null;

    // Reset state when closing or changing report
    const handleClose = () => {
        setView('DETAILS');
        setAdminNote('');
        setActionReason('');
        setBlockConfirmation('');
        onClose();
    };

    const handleActionSubmit = (actionType: string) => {
        // Logic to submit action to backend would go here
        console.log(`Action Submitted: ${actionType}`, {
            reportId: report.id,
            reason: actionReason,
            adminNote,
            suspensionDuration: actionType === 'SUSPEND' ? suspensionDuration : null
        });
        handleClose();
    };

    const renderHeader = () => {
        if (view === 'DETAILS') {
            return (
                <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 bg-white rounded-t-2xl z-10 sticky top-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            Report Details
                            <span className="text-sm font-normal text-slate-400 border-l border-slate-200 pl-3">
                                {report.id}
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                            <Clock size={12} /> {new Date().toLocaleString()} • AUDIT LOG ENABLED
                        </p>
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

        switch (view) {
            case 'CONFIRM_WARNING':
                title = 'Send Official Warning';
                colorClass = 'text-yellow-600';
                icon = <AlertTriangle className="text-yellow-500" />;
                break;
            case 'CONFIRM_SUSPEND':
                title = 'Suspend Temporarily';
                colorClass = 'text-orange-600';
                icon = <Clock className="text-orange-500" />;
                break;
            case 'CONFIRM_BLOCK':
                title = 'Permanently Block User';
                colorClass = 'text-red-600';
                icon = <XOctagon className="text-red-500" />;
                break;
            case 'CONFIRM_RESOLVE':
                title = 'Mark as Resolved';
                colorClass = 'text-emerald-600';
                icon = <CheckCircle className="text-emerald-500" />;
                break;
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

    const renderActionContent = () => {
        switch (view) {
            case 'CONFIRM_WARNING':
                return (
                    <div className="space-y-6 max-w-lg mx-auto py-8">
                        <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl flex gap-3">
                            <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Warning Action</h4>
                                <p className="text-xs text-yellow-700 mt-1">
                                    The user will receive an official warning notification. No access will be restricted, but their risk score will increase (+1).
                                </p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Warning Reason (Required)</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="e.g., Reports of overcharging"
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button onClick={() => setView('DETAILS')} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('WARNING')}
                                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-lg shadow-lg shadow-yellow-500/20 transition-all flex items-center gap-2"
                            >
                                Send Warning <Send size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 'CONFIRM_SUSPEND':
                return (
                    <div className="space-y-6 max-w-lg mx-auto py-8">
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3">
                            <Clock className="text-orange-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-orange-800 text-sm">Temporary Suspension</h4>
                                <p className="text-xs text-orange-700 mt-1">
                                    The user will be blocked from accepting new bookings for the duration. Risk score increases (+3).
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
                            <div className="flex gap-4">
                                {['24h', '3 Days', '7 Days'].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setSuspensionDuration(d)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${suspensionDuration === d
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Suspension Reason (Required)</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none resize-none h-24"
                                placeholder="Explain why this suspension is necessary..."
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button onClick={() => setView('DETAILS')} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('SUSPEND')}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
                            >
                                Suspend Account
                            </button>
                        </div>
                    </div>
                );

            case 'CONFIRM_BLOCK':
                return (
                    <div className="space-y-6 max-w-lg mx-auto py-8">
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3">
                            <XOctagon className="text-red-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-red-800 text-sm">Permanent Block</h4>
                                <p className="text-xs text-red-700 mt-1">
                                    This is a destructive action. The user will be permanently banned and cannot re-register. Risk score maxed.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Final Reason (Required)</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-400 outline-none resize-none h-24"
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

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button onClick={() => setView('DETAILS')} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('BLOCK')}
                                disabled={blockConfirmation !== 'BLOCK'}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                            >
                                Permanently Block
                            </button>
                        </div>
                    </div>
                );

            case 'CONFIRM_RESOLVE':
                return (
                    <div className="space-y-6 max-w-lg mx-auto py-8">
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3">
                            <CheckCircle className="text-emerald-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-emerald-800 text-sm">Resolve Report</h4>
                                <p className="text-xs text-emerald-700 mt-1">
                                    The report will be closed. No action will be taken against the mechanic.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Resolution Note (Optional)</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none resize-none h-24"
                                placeholder="Internal note on why this was resolved..."
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button onClick={() => setView('DETAILS')} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                            <button
                                onClick={() => handleActionSubmit('RESOLVED')}
                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                            >
                                Mark Resolved
                            </button>
                        </div>
                    </div>
                );

            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            {/* Modal Panel */}
            <div className="relative w-full max-w-4xl transform rounded-2xl bg-white text-left shadow-2xl transition-all flex flex-col max-h-[90vh]">

                {renderHeader()}

                {/* Content Logic */}
                {view === 'DETAILS' ? (
                    <div className="p-8 overflow-y-auto space-y-8 bg-slate-50/50">

                        {/* 1. Participant Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* FROM - Customer */}
                            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <FileText size={40} className="text-blue-200" />
                                </div>
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Report From</p>
                                <h3 className="text-lg font-bold text-slate-900">{report.from.name}</h3>
                                <p className="text-xs font-mono text-slate-500 mb-3">{report.from.id}</p>
                                <span className="bg-blue-200 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">CUSTOMER</span>
                            </div>

                            {/* AGAINST - Mechanic */}
                            <div className="rounded-xl border border-red-100 bg-red-50/50 p-5 relative overflow-hidden group hover:border-red-200 transition-colors">
                                <div className="absolute top-0 right-0 p-2 opacity-50">
                                    <AlertOctagon size={40} className="text-red-200" />
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            Report Against <span className="text-[10px] opacity-70">(குற்றம் சாட்டப்பட்டவர்)</span>
                                        </p>
                                        <h3 className="text-lg font-bold text-slate-900">{report.against.name}</h3>
                                        <p className="text-xs font-mono text-slate-500 mb-3">{report.against.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="bg-red-200 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">MECHANIC</span>
                                    {report.risk === 'HIGH' && (
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">HIGH RISK USER</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Report Content & Evidence */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Details Column */}
                            <div className="md:col-span-2 space-y-6">

                                {/* Description Box */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Report Description</h4>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                            Booking: #BKG-9876
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                            "{report.details}"
                                        </p>
                                    </div>
                                </div>

                                {/* Evidence */}
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide mb-3">Evidence Attached</h4>
                                    {report.evidence && report.evidence.length > 0 ? (
                                        <div className="flex gap-4">
                                            {report.evidence.includes('img') && (
                                                <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg hover:border-blue-300 cursor-pointer transition-colors shadow-sm">
                                                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                                        <Camera size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">3 Images</p>
                                                        <p className="text-[10px] text-slate-500">JPG, PNG</p>
                                                    </div>
                                                </div>
                                            )}
                                            {report.evidence.includes('audio') && (
                                                <div className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-lg hover:border-blue-300 cursor-pointer transition-colors shadow-sm">
                                                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                                                        <Mic size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">Audio Clip</p>
                                                        <p className="text-[10px] text-slate-500">0:45 min • MP3</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No evidence uploaded.</p>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar: History & Notes */}
                            <div className="space-y-6">

                                {/* History Panel */}
                                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5">
                                    <h4 className="font-bold text-yellow-900 text-sm flex items-center gap-2 mb-3">
                                        <Clock size={16} /> Past History & Risk
                                    </h4>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs text-yellow-800">Previous Reports</span>
                                        <span className="text-lg font-bold text-yellow-900">4</span>
                                    </div>
                                    <div className="bg-white/60 p-3 rounded-lg border border-yellow-200/50">
                                        <p className="text-[10px] font-bold text-yellow-800 uppercase mb-1">System Insight</p>
                                        <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                                            <AlertTriangle size={12} /> AUTO SUSPENSION SUGGESTED
                                        </p>
                                    </div>
                                </div>

                                {/* Admin Note */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Internal Admin Note</label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white min-h-[120px]"
                                            placeholder="Add internal reasoning for your decision..."
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                        />
                                        <MessageSquare className="absolute bottom-3 right-3 text-gray-300" size={16} />
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                ) : (
                    renderActionContent()
                )}

                {/* Footer: Actions */}
                {view === 'DETAILS' && (
                    <div className="border-t border-gray-100 bg-white p-6 rounded-b-2xl">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <button
                                onClick={() => setView('CONFIRM_WARNING')}
                                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-300 transition-all font-bold text-sm"
                            >
                                <span className="flex items-center gap-2"><AlertTriangle size={16} /> Send Warning</span>
                                <span className="text-[10px] opacity-70">எச்சரிக்கை அனுப்பு</span>
                            </button>

                            <button
                                onClick={() => setView('CONFIRM_SUSPEND')}
                                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-all font-bold text-sm"
                            >
                                <span className="flex items-center gap-2"><Clock size={16} /> Suspend Temp</span>
                                <span className="text-[10px] opacity-70">தற்காலிக தடை</span>
                            </button>

                            <button
                                onClick={() => setView('CONFIRM_BLOCK')}
                                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm shadow-lg shadow-red-500/20"
                            >
                                <span className="flex items-center gap-2"><XOctagon size={16} /> Block Permanently</span>
                                <span className="text-[10px] opacity-80">நிரந்தர முடக்கம்</span>
                            </button>

                            <button
                                onClick={() => setView('CONFIRM_RESOLVE')}
                                className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-500/20"
                            >
                                <span className="flex items-center gap-2"><CheckCircle size={16} /> Mark Resolved</span>
                                <span className="text-[10px] opacity-80">தீர்க்கப்பட்டது</span>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
