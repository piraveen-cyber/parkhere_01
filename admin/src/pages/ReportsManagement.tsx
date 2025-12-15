import React, { useState } from 'react';
import {
    Shield,
    AlertTriangle,
    Search,
    Filter,
    CheckCircle,
    Clock,
    XOctagon,
    ChevronRight,
    Camera,
    Mic,
    User,
    FileText
} from 'lucide-react';
import ReportDetailModal from '../components/ReportDetailModal';

// Mock Data
const MOCK_REPORTS = [
    {
        id: 'RPT-2024-001',
        type: 'CUSTOMER', // Report FROM Customer (against Mechanic/Partner)
        from: { name: 'Praveen Kumar', id: 'CUS-882' },
        against: { name: 'Auto Fix Zone', id: 'MEC-104' },
        reason: 'Overcharging',
        details: 'Mechanic demanded extra cash after service completion.',
        risk: 'HIGH',
        status: 'NEW',
        evidence: ['img', 'audio'],
        timestamp: '2 hrs ago'
    },
    {
        id: 'RPT-2024-002',
        type: 'MECHANIC', // Report FROM Mechanic (against Customer)
        from: { name: 'Quick Repair Ltd', id: 'MEC-104' },
        against: { name: 'Sarah Jones', id: 'CUS-441' },
        reason: 'Unprofessional Behavior',
        details: 'Customer refused to pay and used abusive language.',
        risk: 'MEDIUM',
        status: 'UNDER_REVIEW',
        evidence: ['img'],
        timestamp: '5 hrs ago'
    },
    {
        id: 'RPT-2024-003',
        type: 'CUSTOMER',
        from: { name: 'Mike Ross', id: 'CUS-112' },
        against: { name: 'City Parking', id: 'PARK-002' },
        reason: 'Poor Service Quality',
        details: 'Vehicle scratches found after parking.',
        risk: 'LOW',
        status: 'ACTION_TAKEN',
        evidence: [],
        timestamp: '1 day ago'
    },
    {
        id: 'RPT-2024-004',
        type: 'CUSTOMER',
        from: { name: 'Anita R', id: 'CUS-993' },
        against: { name: 'Tech Solutions', id: 'MEC-202' },
        reason: 'Fraud / Scam',
        details: 'Part was not replaced but charged.',
        risk: 'HIGH',
        status: 'NEW',
        evidence: ['img', 'img'],
        timestamp: '2 mins ago'
    }
];

export default function ReportsManagement() {
    const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'MECHANIC'>('CUSTOMER');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const filteredReports = MOCK_REPORTS.filter(rpt => {
        const matchesTab = activeTab === 'CUSTOMER' ? rpt.type === 'CUSTOMER' : rpt.type === 'MECHANIC';
        const matchesSearch =
            rpt.id.toLowerCase().includes(search.toLowerCase()) ||
            rpt.from.name.toLowerCase().includes(search.toLowerCase()) ||
            rpt.against.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || rpt.status === statusFilter;

        return matchesTab && matchesSearch && matchesStatus;
    });

    const openDetail = (report: any) => {
        setSelectedReport(report);
        setDetailOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'NEW': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200">New Report</span>;
            case 'UNDER_REVIEW': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600 border border-amber-200">Under Review</span>;
            case 'ACTION_TAKEN': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600 border border-emerald-200">Action Taken</span>;
            case 'CLOSED': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Closed</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 min-h-screen pb-20">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Shield className="text-slate-900" /> Reports Management
                    <span className="text-sm font-normal text-slate-400 border-l border-slate-300 pl-3">புகார் மேலாண்மை</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Moderation Center • Internal Use Only
                </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-amber-900">Confidentiality Warning</h3>
                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        Reports are stored securely and visible <strong>ONLY to Super Admin</strong>.
                        No notification is sent to the customer or mechanic about the existence of these reports until action is taken.
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Tabs & Search Header */}
                <div className="border-b border-gray-100 p-6 space-y-6">

                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('CUSTOMER')}
                            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'CUSTOMER' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Customer Reports
                            <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">3</span>
                            {activeTab === 'CUSTOMER' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('MECHANIC')}
                            className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'MECHANIC' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Mechanic Reports
                            <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">1</span>
                            {activeTab === 'MECHANIC' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by ID, name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-2 pr-8 py-2 text-sm border border-gray-200 rounded-lg outline-none bg-white font-medium hover:border-gray-300 transition-colors cursor-pointer"
                            >
                                <option value="ALL">All Status</option>
                                <option value="NEW">New Reports</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="ACTION_TAKEN">Action Taken</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Report List */}
                <div className="bg-slate-50 p-6 space-y-4 min-h-[400px]">
                    {filteredReports.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>No reports found matching criteria</p>
                        </div>
                    ) : (
                        filteredReports.map((report) => (
                            <div key={report.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                {/* Left Risk Accent */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${report.risk === 'HIGH' ? 'bg-red-500' :
                                        report.risk === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-300'
                                    }`} />

                                <div className="pl-4 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                                    {/* Info Block */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{report.id}</span>
                                            {getStatusBadge(report.status)}
                                            {report.risk === 'HIGH' && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                                    <XOctagon size={12} /> High Risk
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-8 text-sm">
                                            <div>
                                                <span className="text-xs text-slate-400 font-medium uppercase block mb-0.5">Report From</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{report.from.name}</span>
                                                    <span className="font-mono text-xs text-slate-400">({report.from.id})</span>
                                                </div>
                                            </div>
                                            <div className="hidden md:block w-px h-8 bg-slate-100" />
                                            <div>
                                                <span className="text-xs text-slate-400 font-medium uppercase block mb-0.5">Against</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{report.against.name}</span>
                                                    <span className="font-mono text-xs text-slate-400">({report.against.id})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reason & Evidence */}
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-sm mb-1">{report.reason}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{report.details}</p>
                                        {report.evidence.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                {report.evidence.includes('img') && <span className="p-1 bg-slate-100 text-slate-500 rounded"><Camera size={12} /></span>}
                                                {report.evidence.includes('audio') && <span className="p-1 bg-slate-100 text-slate-500 rounded"><Mic size={12} /></span>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                            <Clock size={12} /> {report.timestamp}
                                        </div>
                                        <button
                                            onClick={() => openDetail(report)}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition w-full justify-center group-hover:shadow-lg shadow-blue-500/30"
                                        >
                                            View Details <ChevronRight size={14} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* Detail Modal */}
            <ReportDetailModal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                report={selectedReport}
            />

        </div>
    );
}
