import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, SlidersHorizontal, Menu } from 'lucide-react';
import { SearchModeDropdown, SearchMode } from './SearchModeDropdown';
import { UserMenu } from './UserMenu';

interface TopBarProps {
  onToggleMobileSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileSidebar }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('keyword');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}&mode=${searchMode}`);
    }
  };

  return (
    <header className="h-16 bg-[#020617]/90 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
      {/* Mobile Hamburger Button */}
      <button
        type="button"
        onClick={onToggleMobileSidebar}
        className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Center Wide Search Input with Nested Mode Dropdown */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deadlines, notices, files, links..."
            className="w-full bg-[#090E1A] hover:bg-[#0E1626] border border-slate-800 focus:border-blue-500/80 rounded-xl pl-10 pr-32 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />

          <div className="absolute right-2">
            <SearchModeDropdown value={searchMode} onChange={setSearchMode} />
          </div>
        </div>
      </form>

      {/* Right Action Icons & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Filter / Sort Button */}
        <button
          type="button"
          onClick={() => alert('Filter and sorting options')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors focus:outline-none"
          title="Filter and Sort"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => alert('Settings modal')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors focus:outline-none"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
