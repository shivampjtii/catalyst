import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CourseDetail from './pages/CourseDetail';
import PlayerPage from './pages/PlayerPage';
import AddCoursePage from './pages/AddCoursePage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

const Loader = () => (
  <div style={{
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px'
  }}>
    <div style={{
      width: 48, height: 48, border: '3px solid var(--border)',
      borderTopColor: 'var(--accent)', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '14px' }}>
      Loading FocusLearn...
    </p>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
      <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
      <Route path="/learn/:courseId" element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
      <Route path="/add-course" element={<ProtectedRoute><AddCoursePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--radius-md)',
            },
            success: { iconTheme: { primary: 'var(--accent-green)', secondary: '#fff' } },
            error: { iconTheme: { primary: 'var(--accent-3)', secondary: '#fff' } }
          }}
        />
      </Router>
    </AuthProvider>
  );
}
