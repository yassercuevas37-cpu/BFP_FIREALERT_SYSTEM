import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import UserDashboard from './pages/UserDashboard';
import ReportIncident from './pages/ReportIncident';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'admin' | 'user' }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/user'} /> : <Login />} />
      
      <Route path="/" element={<Layout />}>
        {/* Redirect root to appropriate dashboard */}
        <Route index element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/user') : '/login'} replace />} />
        
        {/* Admin Routes */}
        <Route 
          path="admin" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="admin/reports" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } 
        />

        {/* User Routes */}
        <Route 
          path="user" 
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="user/report" 
          element={
            <ProtectedRoute allowedRole="user">
              <ReportIncident />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ReportProvider>
        <Router>
          <AppContent />
        </Router>
      </ReportProvider>
    </AuthProvider>
  );
}

export default App;
