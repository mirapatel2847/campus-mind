import React from 'react';
import { useParams } from 'react-router-dom';
import { Folder } from 'lucide-react';

export const SpaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
        <Folder className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Space: {id}</h1>
      </div>

      <div className="p-8 rounded-xl bg-[#090E1A] border border-slate-800 text-center text-slate-400 text-sm">
        Filtered memories, resources, and documents for space <span className="font-mono text-slate-300">{id}</span>.
      </div>
    </div>
  );
};

export default SpaceDetailPage;
