import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await performLogin(email, password);
    };

    const performLogin = async (e: string, p: string) => {
        setError('');
        setIsLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/admin/auth/login', { email: e, password: p });
            login(data.token, { _id: data._id, email: data.email, role: data.role });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
            console.error("Login Error Details:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-900 overflow-hidden">
            {/* Left Side - Brand / Marketing */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 -left-1/4 w-full h-full bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
                <div className="absolute bottom-0 -right-1/4 w-full h-full bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

                <div className="relative z-10 text-white space-y-8 max-w-lg">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                        <span className="font-bold text-4xl">P</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            ParkHere <br />Super Admin
                        </h1>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            The central command center for managing global parking operations, partners, and fleet logistics.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                            <ShieldCheck className="text-blue-400 mb-2" size={24} />
                            <h3 className="font-bold text-sm text-slate-200">Enterprise Security</h3>
                            <p className="text-xs text-slate-500 mt-1">Role-based access control & audit logging</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                            <Globe className="text-purple-400 mb-2" size={24} />
                            <h3 className="font-bold text-sm text-slate-200">Global Operations</h3>
                            <p className="text-xs text-slate-500 mt-1">Real-time monitoring across all regions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white lg:rounded-l-[3rem] shadow-2xl z-20">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-slate-500">Sign in to your administrative account</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="block w-full rounded-xl border border-gray-200 bg-slate-50 p-3.5 pl-11 text-slate-900 placeholder-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-medium"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="block w-full rounded-xl border border-gray-200 bg-slate-50 p-3.5 pl-11 text-slate-900 placeholder-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all font-medium"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In to Dashboard <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Development Access</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => performLogin('admin@gmail.com', 'admin')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                    >
                        <Zap size={16} /> Dev Bypass Login
                    </button>
                </div>

                {/* Footer Copyright */}
                <div className="absolute bottom-6 text-center w-full text-xs text-slate-400 font-medium">
                    © 2024 ParkHere Inc. All rights reserved.
                </div>
            </div>
        </div>
    );
}
