import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Fairness from './pages/Fairness';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-yellow-400">
        <div className="text-center">
          <div className="text-3xl font-black tracking-wide">Aviator</div>
          <div className="mt-3 text-sm text-gray-300">Loading dashboard...</div>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/game" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/game" />} />
      </Route>
      
      <Route element={user ? <UserLayout /> : <Navigate to="/login" />}>
        <Route path="/game" element={<Game />} />
        <Route path="/fairness" element={<Fairness />} />
        <Route path="/history" element={<Game />} />
        <Route path="/profile" element={<Game />} />
      </Route>
      
      <Route element={user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/game" />}>
        <Route path="/admin/*" element={<Admin />} />
      </Route>
      
      <Route path="/" element={<Navigate to="/game" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;







