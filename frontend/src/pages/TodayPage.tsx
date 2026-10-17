import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, LogOut, CheckCircle2, User as UserIcon } from 'lucide-react';

export const TodayPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#111726]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Campus<span className="text-blue-400">Mind</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <UserIcon className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-200 font-medium">{user?.name}</span>
              <span className="text-slate-500">({user?.email})</span>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Placeholder */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/5">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Welcome to CampusMind, {user?.name || 'Student'}!
        </h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          Authentication is verified and working. You are signed in as{' '}
          <span className="text-slate-200 font-medium">{user?.email}</span>.
        </p>

        <div className="w-full bg-[#111726]/60 border border-slate-800 rounded-xl p-5 text-left text-xs text-slate-400 space-y-2">
          <div className="text-slate-200 font-medium mb-1">Session Info:</div>
          <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
            <span>User ID:</span>
            <span className="font-mono text-slate-300">{user?.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
            <span>Status:</span>
            <span className="text-emerald-400 font-medium">Authenticated</span>
          </div>
          <div className="flex justify-between pt-0.5">
            <span>Today Page:</span>
            <span className="text-slate-400 italic">Feature modules will be connected here</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TodayPage;
