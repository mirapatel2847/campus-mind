import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Calendar,
  Layers,
  Archive,
  Plus,
  GraduationCap,
  X,
  MoreHorizontal,
  Trash2,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { getSpaces, deleteSpace } from '../../api/spaces';
import { Space } from '../../types/memory';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeMenuSpaceId, setActiveMenuSpaceId] = useState<string | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<Space | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSpaces().then(setSpaces).catch(console.error);
  }, []);

  // Close open action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenuSpaceId(null);
      }
    };

    if (activeMenuSpaceId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuSpaceId]);

  // Auto-dismiss error toast
  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home, exact: true },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Spaces', path: '/spaces', icon: Layers, exact: true },
    { name: 'Archive', path: '/archive', icon: Archive },
  ];

  const handleAddSpace = () => {
    const spaceName = window.prompt('Enter new space name:');
    if (spaceName && spaceName.trim()) {
      const emoji = window.prompt('Enter an emoji for this space (optional):', '📁') || '📁';
      const newSpace: Space = {
        id: `space_${Date.now()}`,
        name: spaceName.trim(),
        emoji,
      };
      setSpaces((prev) => [...prev, newSpace]);
      navigate(`/spaces/${newSpace.id}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!spaceToDelete) return;

    const targetId = spaceToDelete.id;
    const targetName = spaceToDelete.name;
    const previousSpaces = [...spaces];

    // Optimistic UI update: remove space immediately
    setSpaces((prev) => prev.filter((s) => s.id !== targetId));
    setSpaceToDelete(null);
    setActiveMenuSpaceId(null);

    // If currently viewing /spaces/<that id>, redirect to /spaces
    if (location.pathname === `/spaces/${targetId}`) {
      navigate('/spaces', { replace: true });
    }

    setIsDeleting(true);
    try {
      await deleteSpace(targetId);
    } catch (err: unknown) {
      console.error('Failed to delete space:', err);
      // Roll back optimistic update with error toast
      setSpaces(previousSpaces);
      setErrorToast(`Failed to delete space "${targetName}". Changes were rolled back.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <aside className="w-[290px] h-full bg-[#020617] border-r border-slate-800/80 flex flex-col justify-between select-none relative">
        <div className="flex-1 overflow-y-auto py-5 px-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <NavLink
              to="/"
              onClick={onCloseMobile}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Campus<span className="text-blue-400">Mind</span>
              </span>
            </NavLink>

            {/* Close button for mobile */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-slate-800/80 my-5" />

          {/* Spaces Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 mb-1">
              <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                Spaces
              </span>
              <button
                type="button"
                onClick={handleAddSpace}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-md transition-colors focus:outline-none"
                title="Create new space"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5" ref={menuContainerRef}>
              {/* Dynamic User Spaces */}
              {spaces.map((space) => {
                const spacePath = `/spaces/${space.id}`;
                const isActive = location.pathname === spacePath;
                const isMenuOpen = activeMenuSpaceId === space.id;

                return (
                  <div key={space.id} className="relative group">
                    <NavLink
                      to={spacePath}
                      onClick={onCloseMobile}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <span className="text-sm shrink-0">{space.emoji}</span>
                        <span className="truncate">{space.name}</span>
                      </div>

                      {/* "..." Action button: Always visible on touch screens, visible on hover on desktop */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveMenuSpaceId((prev) => (prev === space.id ? null : space.id));
                        }}
                        className={`p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700/60 transition-opacity focus:outline-none ${
                          isMenuOpen
                            ? 'opacity-100 bg-slate-700/60 text-white'
                            : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
                        }`}
                        title="Space actions"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </NavLink>

                    {/* Space Action Menu */}
                    {isMenuOpen && (
                      <div
                        className="absolute right-2 top-full mt-1 w-36 bg-[#0E1626] border border-slate-700 rounded-xl shadow-2xl py-1 z-30 animate-fadeIn text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuSpaceId(null);
                            setSpaceToDelete(space);
                          }}
                          className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Delete space</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Built-in Unassigned Space (Always exists, cannot be deleted or renamed, no '...' menu) */}
              <NavLink
                to="/spaces/unassigned"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/spaces/unassigned'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Inbox className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Unassigned</span>
              </NavLink>

              {/* All Spaces Link */}
              <NavLink
                to="/spaces"
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/spaces'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>All Spaces</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Floating Error Toast */}
        {errorToast && (
          <div className="absolute bottom-16 inset-x-3 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-start gap-2 shadow-xl animate-fadeIn z-40">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1 font-medium">{errorToast}</span>
            <button
              onClick={() => setErrorToast(null)}
              className="text-rose-400 hover:text-rose-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>CampusMind Assistant</span>
          <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-400 font-mono">
            v0.1.0
          </span>
        </div>
      </aside>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!spaceToDelete}
        title="Delete space?"
        message={`The space '${spaceToDelete?.name || ''}' will be removed. Items inside it will not be deleted; they will move to 'Unassigned'.`}
        confirmLabel="Delete space"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setSpaceToDelete(null);
        }}
      />
    </>
  );
};

export default Sidebar;
