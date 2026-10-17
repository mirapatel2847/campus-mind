import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export type SearchMode = 'keyword' | 'hybrid' | 'semantic';

interface SearchModeOption {
  id: SearchMode;
  title: string;
  description: string;
  experimental?: boolean;
}

const SEARCH_OPTIONS: SearchModeOption[] = [
  {
    id: 'keyword',
    title: 'Keyword',
    description: 'Exact match across titles, notes, and tags.',
  },
  {
    id: 'hybrid',
    title: 'Hybrid',
    description: 'Combines exact text match with neural semantic ranking.',
    experimental: true,
  },
  {
    id: 'semantic',
    title: 'Semantic',
    description: 'Natural language search based on contextual meaning.',
    experimental: true,
  },
];

interface SearchModeDropdownProps {
  value: SearchMode;
  onChange: (mode: SearchMode) => void;
}

export const SearchModeDropdown: React.FC<SearchModeDropdownProps> = ({ value, onChange }) => {
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

  const currentOption = SEARCH_OPTIONS.find((opt) => opt.id === value) || SEARCH_OPTIONS[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white transition-colors focus:outline-none"
        title="Change search mode"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span>{currentOption.title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#090E1A] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-slate-800/80 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Search Mode
          </div>

          <div className="p-1 space-y-0.5">
            {SEARCH_OPTIONS.map((option) => {
              const isSelected = option.id === value;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${
                    isSelected ? 'bg-slate-800/70 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  {/* Selection Dot */}
                  <div className="mt-1 shrink-0">
                    <span
                      className={`block w-2 h-2 rounded-full ${
                        isSelected ? 'bg-blue-400 ring-2 ring-blue-500/30' : 'bg-transparent border border-slate-600'
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-100">{option.title}</span>
                      {option.experimental && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                          Experimental
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModeDropdown;
