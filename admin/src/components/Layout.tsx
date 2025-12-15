import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Wrench, // Mechanic
    Calendar,
    CreditCard,
    Bell,
    Shield,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    UserCog
} from 'lucide-react';

export default function Layout() {
    const { logout, admin } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: FileText, label: 'Reports Management', path: '/problems', badge: true },
        { icon: Wrench, label: 'Mechanic Management', path: '/partners' }, // Mapped to Partners
        { icon: Users, label: 'Customer Management', path: '/users' },
        { icon: Calendar, label: 'Bookings', path: '/bookings' },
        { icon: CreditCard, label: 'Payments & Comm.', path: '/services' }, // Mapped to Services/Revenue
        { icon: Bell, label: 'Notification Center', path: '/notifications' },
        { icon: UserCog, label: 'Admin Roles', path: '/roles' },
        { icon: Settings, label: 'App Settings', path: '/config' },
        { icon: Shield, label: 'Audit Logs', path: '/logs' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-blue-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0 flex flex-col shadow-2xl`}
            >
                {/* Logo */}
                <div className="flex items-center gap-4 p-6 border-b border-white/10">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-orange-500/20">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white">Super Admin</h1>
                        <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Full Control</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                                        ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/20 translate-x-1'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} className={active ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'} />
                                    {item.label}
                                </div>
                                {item.badge && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                        3
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-inner border border-white/10">
                            {(admin?.email?.[0] || 'A').toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{admin?.email || 'Super Admin'}</p>
                            <p className="text-xs text-blue-300 truncate">System Owner</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/50 p-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 relative">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Super Admin Dashboard</h2>
                            <p className="text-sm text-slate-500">Complete system overview and control</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Bell className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" size={22} />
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
