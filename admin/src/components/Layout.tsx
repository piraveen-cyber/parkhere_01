import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Car,
    Calendar,
    AlertTriangle,
    Shield,
    Settings,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';

export default function Layout() {
    const { logout, admin } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/' },
        { icon: Users, label: 'User Management', path: '/users' },
        { icon: Briefcase, label: 'Partners', path: '/partners' },
        { icon: Car, label: 'Services', path: '/services' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: AlertTriangle, label: 'Problem Reports', path: '/problems' },
        { icon: Shield, label: 'Audit Logs', path: '/logs' },
        { icon: Settings, label: 'System Config', path: '/config' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0 flex flex-col`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 p-6 border-b border-slate-800">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        P
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">ParkHere</h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Super Admin</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} className={active ? 'text-white' : 'text-slate-500'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {(admin?.email?.[0] || 'A').toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{admin?.email || 'Admin'}</p>
                            <p className="text-xs text-slate-500 truncate">Super Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 p-2 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm z-10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium text-slate-900">Dashboard</span> / Overview
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
