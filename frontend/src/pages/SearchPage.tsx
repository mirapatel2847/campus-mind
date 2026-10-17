import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const mode = searchParams.get('mode') || 'keyword';

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
        <Search className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Search</h1>
      </div>

      <div className="p-4 rounded-xl bg-[#090E1A] border border-slate-800 text-sm text-slate-300">
        {q ? (
          <p>
            Showing search results for <strong className="text-white">"{q}"</strong> using{' '}
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-blue-400 uppercase">
              {mode}
            </span>{' '}
            mode.
          </p>
        ) : (
          <p className="text-slate-400">Enter a search query in the top bar to search through campus memories.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
