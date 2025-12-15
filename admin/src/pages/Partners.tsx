import React, { useEffect, useState } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Shield,
    FileText,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { getPartners, updatePartnerKYC, type Partner } from '../services/partnerService';
import Modal from '../components/Modal';

export default function Partners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, PENDING, ACTIVE, SUSPENDED
    const [search, setSearch] = useState('');

    // Modal State
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [kycModalOpen, setKycModalOpen] = useState(false);

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        try {
            const data = await getPartners();
            setPartners(data);
        } catch (error) {
            console.error('Failed to load partners', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKYCAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!window.confirm(`Are you sure you want to ${status} this partner?`)) return;
        try {
            await updatePartnerKYC(id, status);
            loadPartners(); // Refresh list
            setKycModalOpen(false);
        } catch (error) {
            alert('Action failed');
        }
    };

    const filteredPartners = partners.filter(p => {
        const matchesFilter =
            filter === 'ALL' ? true :
                filter === 'PENDING' ? p.kycStatus === 'PENDING' :
                    filter === 'ACTIVE' ? (p.isActive && p.kycStatus === 'APPROVED') :
                        filter === 'SUSPENDED' ? (!p.isActive && p.kycStatus === 'APPROVED') : true;

        const matchesSearch =
            p.businessName.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status: string, isActive: boolean) => {
        if (status === 'PENDING') return <span className="badge bg-amber-50 text-amber-600 border border-amber-100">Pending Review</span>;
        if (status === 'REJECTED') return <span className="badge bg-red-50 text-red-600 border border-red-100">Rejected</span>;
        if (!isActive) return <span className="badge bg-gray-100 text-gray-500 border border-gray-200">Suspended</span>;
        return <span className="badge bg-emerald-50 text-emerald-600 border border-emerald-100">Active Partner</span>;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-slate-900" /> Partner Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Onboard, track, and manage service providers.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search partners..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                        />
                    </div>
                    <select
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white font-medium"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Partners</option>
                        <option value="PENDING">Pending KYC</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold tracking-wider">Business / Contact</th>
                            <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                            <th className="px-6 py-4 font-bold tracking-wider">Joined</th>
                            <th className="px-6 py-4 font-bold tracking-wider">Trust Score</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-10 w-48 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded"></div></td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : filteredPartners.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No partners found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredPartners.map((partner) => (
                                <tr key={partner._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {partner.businessName[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{partner.businessName}</p>
                                                <p className="text-xs text-slate-500">{partner.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(partner.kycStatus, partner.isActive)}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {new Date(partner.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Mock Trust Score for now */}
                                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                                            <Shield size={14} /> 100/100
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => { setSelectedPartner(partner); setKycModalOpen(true); }}
                                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* KYC / Manage Modal */}
            <Modal
                isOpen={kycModalOpen}
                onClose={() => setKycModalOpen(false)}
                title={selectedPartner ? `Managing: ${selectedPartner.businessName}` : 'Partner Details'}
            >
                {selectedPartner && (
                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Current Status</p>
                                <div className="mt-1">{getStatusBadge(selectedPartner.kycStatus, selectedPartner.isActive)}</div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase font-bold">Partner ID</p>
                                <p className="font-mono text-xs text-slate-900">{selectedPartner._id}</p>
                            </div>
                        </div>

                        {/* KYC Documents */}
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                                <FileText size={16} /> KYC Documents
                            </h4>
                            <div className="grid gap-3">
                                {selectedPartner.kycDocuments.length > 0 ? (
                                    selectedPartner.kycDocuments.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 uppercase">{doc.docType}</p>
                                                    <p className="text-xs text-slate-500">Uploaded on {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1"
                                            >
                                                View <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium flex items-center gap-2">
                                        <AlertCircle size={16} /> No documents uploaded yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                            {selectedPartner.kycStatus === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleKYCAction(selectedPartner._id, 'APPROVED')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition"
                                    >
                                        <CheckCircle size={16} /> Approve Partner
                                    </button>
                                    <button
                                        onClick={() => handleKYCAction(selectedPartner._id, 'REJECTED')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition"
                                    >
                                        <XCircle size={16} /> Reject Application
                                    </button>
                                </>
                            )}
                            {selectedPartner.kycStatus === 'APPROVED' && (
                                <button className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
                                    <MoreHorizontal size={16} /> More Actions (Suspend/Edit)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
