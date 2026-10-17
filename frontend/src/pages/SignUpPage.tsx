import React from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SignUpForm } from '../components/auth/SignUpForm';

export const SignUpPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // If already authenticated, redirect to "/"
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-[400px] mx-auto z-10">
        {/* Card */}
        <div className="w-full bg-[#111726]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Brand Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Campus<span className="text-blue-400">Mind</span>
            </span>
          </div>

          {/* Form */}
          <SignUpForm />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
