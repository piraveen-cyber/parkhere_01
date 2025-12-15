import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';
import Logs from './pages/Logs';
import PlaceholderPage from './pages/PlaceholderPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Auth...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<PlaceholderPage title="User Management" />} />
        <Route path="partners" element={<Partners />} />
        <Route path="services" element={<PlaceholderPage title="Service Control" />} />
        <Route path="bookings" element={<PlaceholderPage title="Booking Management" />} />
        <Route path="problems" element={<PlaceholderPage title="Problem Reports" />} />
        <Route path="logs" element={<Logs />} />
        <Route path="config" element={<PlaceholderPage title="System Configuration" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
