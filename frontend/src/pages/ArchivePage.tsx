import React, { useState, useEffect } from 'react';
import { Archive as ArchiveIcon } from 'lucide-react';
import { getMemories } from '../api/memories';
import { Memory } from '../types/memory';
import { MemoryCard } from '../components/cards/MemoryCard';
import { DetailPanel } from '../components/common/DetailPanel';

export const ArchivePage: React.FC = () => {
  const [archivedMemories, setArchivedMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    getMemories({ archived: true }).then(setArchivedMemories).catch(console.error);
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
        <ArchiveIcon className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Archive</h1>
      </div>

      {archivedMemories.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#090E1A] border border-slate-800 text-center text-slate-400 text-sm">
          No archived memories. Items you archive will be stored here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onOpenDetail={setSelectedMemory}
              onToggleFavourite={() => {}}
              onArchive={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}

      <DetailPanel
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onUpdate={async () => {}}
        onDelete={async () => {}}
      />
    </div>
  );
};

export default ArchivePage;
