import React, { useEffect, useState } from 'react';
import {
    Shield,
    ArrowRight
} from 'lucide-react';
// import { getAuditLogs } from '../services/auditService'; // Service missing, need to create or mock
// import Modal from '../components/Modal'; // Need to create Modal component

// MOCK SERVICE for now until I restore services
const getAuditLogs = async (filters: any) => {
    return [
        { _id: '1', createdAt: new Date().toISOString(), adminId: 'admin@gmail.com', action: 'UPDATE_STATUS', targetType: 'PROBLEM_REPORT', targetId: 'PR-123', beforeValue: 'OPEN', afterValue: 'RESOLVED' },
        { _id: '2', createdAt: new Date(Date.now() - 86400000).toISOString(), adminId: 'system', action: 'SYSTEM_CONFIG_UPDATE', targetType: 'SYSTEM_CONFIG', targetId: 'GLOBAL', beforeValue: { timeout: 300 }, afterValue: { timeout: 600 } },
    ];
};

export default function Logs() {
    const [logs, setLogs] = useState<any[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [modalOpen, setModalOpen] = useState(false);
    // const [selectedLog, setSelectedLog] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            const data = await getAuditLogs({});
            setLogs(data);
            // setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="text-slate-900" /> System Audit Logs
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        compliance_v2.0 • Immutable Record • Retention: 90 Days
                    </p>
                </div>
            </div>
            {/* Table Simplified for restoration speed */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Target</th>
                            <th className="px-6 py-4">Diff</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td className="px-6 py-4">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4"><span className="font-bold text-xs bg-slate-100 px-2 py-1 rounded">{log.action}</span></td>
                                <td className="px-6 py-4">{log.targetType}</td>
                                <td className="px-6 py-4 flex gap-2 items-center">
                                    <span className="text-red-500 bg-red-50 px-1 rounded text-xs">{JSON.stringify(log.beforeValue)}</span>
                                    <ArrowRight size={12} />
                                    <span className="text-emerald-500 bg-emerald-50 px-1 rounded text-xs">{JSON.stringify(log.afterValue)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
