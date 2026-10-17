import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    navigate('/signin', { replace: true });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={containerRef}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center border-2 border-slate-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm transition-all"
        title={user?.name || 'User Account'}
      >
        <span>{initial}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#090E1A] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn text-xs">
          {/* User Info Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-800/80">
            <div className="font-semibold text-slate-100 truncate text-sm">
              {user?.name || 'Campus Student'}
            </div>
            <div className="text-slate-400 truncate text-[11px] mt-0.5">
              {user?.email || 'student@campus.edu'}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-400 font-medium">
              <Shield className="w-3 h-3" />
              <span>Student Account</span>
            </div>
          </div>

          <div className="p-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
