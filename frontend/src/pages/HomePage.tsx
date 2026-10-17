import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Inbox, AlertCircle } from 'lucide-react';
import { getMemories, updateMemory, deleteMemory } from '../api/memories';
import { Memory } from '../types/memory';
import { QuickCapture } from '../components/common/QuickCapture';
import { MemoryCard } from '../components/cards/MemoryCard';
import { DetailPanel } from '../components/common/DetailPanel';

export const HomePage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMemories({ status: 'active', archived: false });
      // Extra guard: Ensure superseded memories never appear on Home
      const activeOnly = data.filter((m) => m.status !== 'superseded' && !m.is_archived);
      setMemories(activeOnly);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load memories. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const handleCreated = (newMemory: Memory) => {
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleToggleFavourite = async (id: string, isFav: boolean) => {
    try {
      const updated = await updateMemory(id, { is_favourite: isFav });
      setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selectedMemory?.id === id) {
        setSelectedMemory(updated);
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateMemory(id, { is_archived: true });
      // Remove from active list on home
      setMemories((prev) => prev.filter((m) => m.id !== id));
      if (selectedMemory?.id === id) {
        setSelectedMemory(null);
      }
    } catch (err) {
      console.error('Failed to archive memory:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
      if (selectedMemory?.id === id) {
        setSelectedMemory(null);
      }
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Memory>) => {
    try {
      const updated = await updateMemory(id, updates);
      setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selectedMemory?.id === id) {
        setSelectedMemory(updated);
      }
    } catch (err) {
      console.error('Failed to update memory:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Page Heading */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Home Feed
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time feed of campus deadlines, exam notices, and study resources.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMemories}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors focus:outline-none disabled:opacity-50"
          title="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchMemories}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-44 bg-[#090E1A] border border-slate-800 rounded-xl animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-64 bg-[#090E1A] border border-slate-800 rounded-xl p-4 space-y-3 animate-pulse"
            >
              <div className="w-20 h-4 bg-slate-800 rounded-full" />
              <div className="w-3/4 h-5 bg-slate-800 rounded" />
              <div className="w-full h-20 bg-slate-850 rounded" />
              <div className="flex gap-2 pt-2">
                <div className="w-14 h-4 bg-slate-800 rounded-full" />
                <div className="w-14 h-4 bg-slate-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid: QuickCapture + Memory Cards */}
      {!loading && !error && (
        <>
          {memories.length === 0 ? (
            <div className="space-y-6">
              {/* QuickCapture still available in empty state */}
              <div className="max-w-lg mx-auto">
                <QuickCapture onCreated={handleCreated} />
              </div>

              {/* Empty State Banner */}
              <div className="py-16 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-200 mb-1">
                  Nothing saved yet
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Forward something to the CampusMind bot or paste it in the box above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {/* First cell is the QuickCapture box */}
              <div className="w-full">
                <QuickCapture onCreated={handleCreated} />
              </div>

              {/* Following cells: Memory Cards */}
              {memories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onOpenDetail={setSelectedMemory}
                  onToggleFavourite={handleToggleFavourite}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Right Slide-over Detail Panel */}
      <DetailPanel
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HomePage;
