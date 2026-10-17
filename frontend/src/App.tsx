import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TodayPage from './pages/TodayPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Main Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TodayPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to root (which either shows TodayPage or redirects to /signin) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
