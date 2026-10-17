import React from 'react';
import { Layers } from 'lucide-react';

export const SpacesPage: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
        <Layers className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">All Spaces</h1>
      </div>

      <div className="p-8 rounded-xl bg-[#090E1A] border border-slate-800 text-center text-slate-400 text-sm">
        Overview of all course spaces, subject channels, and knowledge groups.
      </div>
    </div>
  );
};

export default SpacesPage;
