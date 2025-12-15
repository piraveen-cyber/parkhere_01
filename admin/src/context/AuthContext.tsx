import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    token: string | null;
    admin: any | null;
    login: (token: string, adminData: any) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
    const [admin, setAdmin] = useState<any | null>(JSON.parse(localStorage.getItem('adminData') || 'null'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                // Restore session
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('adminToken', token);
                setLoading(false);
            } else {
                // AUTO LOGIN FOR DEV MODE (Per Prompt Req)
                // In a real prod environment, remove this block.
                try {
                    const { data } = await axios.post('http://localhost:5000/api/admin/auth/login', {
                        email: 'admin@gmail.com',
                        password: 'admin'
                    });
                    login(data.token, { _id: data._id, email: data.email, role: data.role });
                } catch (error) {
                    console.error('Auto-login failed', error);
                    delete axios.defaults.headers.common['Authorization'];
                    localStorage.removeItem('adminToken');
                } finally {
                    setLoading(false);
                }
            }
        };

        initializeAuth();
    }, []);

    const login = (newToken: string, newAdminData: any) => {
        setToken(newToken);
        setAdmin(newAdminData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        localStorage.setItem('adminToken', newToken);
        localStorage.setItem('adminData', JSON.stringify(newAdminData));
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
    };

    return (
        <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
