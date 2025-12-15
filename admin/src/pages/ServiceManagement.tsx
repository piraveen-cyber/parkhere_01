import React, { useState } from 'react';
import {
    Zap,
    Settings,
    DollarSign,
    Power,
    AlertTriangle,
    CheckCircle,
    Truck,
    Wrench,
    Battery,
    Save
} from 'lucide-react';

// Mock Services Data
const INITIAL_SERVICES = [
    {
        id: 'SRV-001',
        name: 'General Mechanic',
        icon: Wrench,
        status: 'ACTIVE',
        commission: 15,
        description: 'Standard repair and maintenance services.'
    },
    {
        id: 'SRV-002',
        name: 'Towing Service',
        icon: Truck,
        status: 'ACTIVE',
        commission: 20,
        description: 'Emergency vehicle towing and transport.'
    },
    {
        id: 'SRV-003',
        name: 'Battery Jumpstart',
        icon: Battery,
        status: 'INACTIVE',
        commission: 12,
        description: 'Mobile battery replacement and jumpstart.'
    },
    {
        id: 'SRV-004',
        name: 'Emergency Roadside',
        icon: Zap,
        status: 'ACTIVE',
        commission: 18,
        description: 'Fuel delivery, lockout services, etc.'
    }
];

export default function ServiceManagement() {
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [emergencyMode, setEmergencyMode] = useState(false);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const handleToggleStatus = (id: string) => {
        setServices(services.map(s =>
            s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s
        ));
        setUnsavedChanges(true);
    };

    const handleCommissionChange = (id: string, newRate: string) => {
        const rate = parseFloat(newRate);
        if (rate < 0 || rate > 100) return;
        setServices(services.map(s =>
            s.id === id ? { ...s, commission: rate } : s
        ));
        setUnsavedChanges(true);
    };

    const handleSaveChanges = () => {
        // Here we would call the API to update config
        console.log('Saving config:', services);
        setUnsavedChanges(false);
        alert('System Configuration Updated');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Settings className="text-slate-900" /> Service & Commission Control
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Configure global service availability and revenue settings.
                    </p>
                </div>
                {unsavedChanges && (
                    <button
                        onClick={handleSaveChanges}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all animate-bounce"
                    >
                        <Save size={18} /> Save Changes
                    </button>
                )}
            </div>

            {/* Emergency Mode Banner */}
            {emergencyMode && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4 animate-in slide-in-from-top duration-300">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="text-red-900 font-bold">System Emergency Mode Active</h3>
                        <p className="text-red-700 text-sm">All new bookings are currently paused. Existing bookings are unaffected.</p>
                    </div>
                    <button
                        onClick={() => setEmergencyMode(false)}
                        className="ml-auto px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50"
                    >
                        Deactivate
                    </button>
                </div>
            )}

            {/* Service Configuration List */}
            <div className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`bg-white rounded-xl border p-6 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all ${service.status === 'ACTIVE'
                                ? 'border-gray-200 shadow-sm'
                                : 'border-slate-200 bg-slate-50/50 opacity-75 grayscale-[0.5]'
                            }`}
                    >
                        {/* Icon & Info */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${service.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'
                                }`}>
                                <service.icon size={28} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    {service.name}
                                    {service.status === 'ACTIVE' ? (
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                                    ) : (
                                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">Disabled</span>
                                    )}
                                </h3>
                                <p className="text-slate-500 text-sm">{service.description}</p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-8 w-full md:w-auto mt-4 md:mt-0">

                            {/* Commission Input */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Commission %</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        type="number"
                                        value={service.commission}
                                        onChange={(e) => handleCommissionChange(service.id, e.target.value)}
                                        className="pl-8 pr-4 py-2 w-32 border border-gray-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="flex flex-col gap-1 items-end">
                                <label className="text-xs font-bold text-slate-400 uppercase">Availability</label>
                                <button
                                    onClick={() => handleToggleStatus(service.id)}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${service.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow-sm ${service.status === 'ACTIVE' ? 'translate-x-9' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="mt-12 bg-red-50 rounded-xl border border-red-100 p-6">
                <h3 className="font-bold text-red-900 text-lg flex items-center gap-2 mb-2">
                    <AlertTriangle size={20} /> Emergency Controls
                </h3>
                <p className="text-red-700 text-sm mb-6 max-w-2xl">
                    These actions propagate globally instantly. Use only in case of critical system failure or security breach.
                    "System Lockdown" will prevent ALL new bookings across ALL services.
                </p>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setEmergencyMode(!emergencyMode)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${emergencyMode
                                ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-xl'
                                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30'
                            }`}
                    >
                        <Power size={18} />
                        {emergencyMode ? 'Deactivate Lockdown' : 'ACTIVATE SYSTEM LOCKDOWN'}
                    </button>
                    {!emergencyMode && (
                        <p className="text-xs text-red-500 font-bold italic">Double confirmation not required in prototype mode</p>
                    )}
                </div>
            </div>

        </div>
    );
}
