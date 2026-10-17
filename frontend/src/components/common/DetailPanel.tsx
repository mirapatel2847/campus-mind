import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Archive,
  Trash2,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  Calendar,
  AlertTriangle,
  Folder,
} from 'lucide-react';
import { Memory, MemoryTag } from '../../types/memory';
import { TagChip } from './TagChip';

interface DetailPanelProps {
  memory: Memory | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Memory>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  memory,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<MemoryTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (memory) {
      setNote(memory.note || '');
      setTags(memory.tags || []);
      setIsAddingTag(false);
      setNewTagName('');
    }
  }, [memory]);

  // Handle Esc key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!memory) return null;

  const timeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleToggleFavourite = async () => {
    await onUpdate(memory.id, { is_favourite: !memory.is_favourite });
  };

  const handleToggleArchive = async () => {
    await onUpdate(memory.id, { is_archived: !memory.is_archived });
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      await onDelete(memory.id);
      onClose();
    }
  };

  const handleRemoveTag = async (tagName: string) => {
    const nextTags = tags.filter((t) => t.name !== tagName);
    setTags(nextTags);
    await onUpdate(memory.id, { tags: nextTags });
  };

  const handleAddTag = async () => {
    const trimmed = newTagName.trim().toLowerCase();
    if (!trimmed || tags.some((t) => t.name === trimmed)) {
      setIsAddingTag(false);
      setNewTagName('');
      return;
    }
    const nextTags: MemoryTag[] = [...tags, { name: trimmed, ai: false }];
    setTags(nextTags);
    setNewTagName('');
    setIsAddingTag(false);
    await onUpdate(memory.id, { tags: nextTags });
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    try {
      await onUpdate(memory.id, { note });
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#090E1A] border-l border-slate-800 h-full flex flex-col md:flex-row shadow-2xl overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Full Content & Media */}
        <div className="flex-1 flex flex-col h-full border-r border-slate-800/80 overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#090E1A]/95 backdrop-blur z-10">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                  memory.category === 'exam'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : memory.category === 'deadline'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : memory.category === 'event'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : memory.category === 'notice'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    : memory.category === 'resource'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {memory.category}
              </span>

              {memory.supersedes_id && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Updated
                </span>
              )}

              {memory.importance === 'high' && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" />
                  High Priority
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
                {memory.title}
              </h2>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                <span>Source: {memory.source_ref}</span>
                <span>•</span>
                <span>Type: {memory.source_type}</span>
              </p>
            </div>

            {/* Preview image if available */}
            {memory.preview_image_url && (
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-72 bg-slate-950">
                <img
                  src={memory.preview_image_url}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Full text content */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-normal">
              {memory.content}
            </div>

            {/* Valid Until / Deadline notice if applicable */}
            {memory.valid_until && (
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Valid until:{' '}
                  <strong>
                    {new Date(memory.valid_until).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata, Tags, Notes, Actions */}
        <div className="w-full md:w-80 flex flex-col h-full bg-[#060B14] p-5 overflow-y-auto space-y-6">
          {/* Top Actions & Close button */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleFavourite}
                title={memory.is_favourite ? 'Remove favourite' : 'Mark favourite'}
                className={`p-2 rounded-lg transition-colors ${
                  memory.is_favourite
                    ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Star className="w-4 h-4" fill={memory.is_favourite ? 'currentColor' : 'none'} />
              </button>

              <button
                type="button"
                onClick={handleToggleArchive}
                title="Archive memory"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Archive className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDelete}
                title="Delete memory"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Time & Space Metadata */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Observed
              </span>
              <span className="text-slate-200 font-medium">{timeAgo(memory.observed_at)}</span>
            </div>

            {memory.subject && (
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  Subject
                </span>
                <span className="text-slate-200 font-medium">{memory.subject}</span>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Tags</span>
              {!isAddingTag && (
                <button
                  type="button"
                  onClick={() => setIsAddingTag(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium focus:outline-none"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <TagChip
                  key={tag.name}
                  tag={tag}
                  size="sm"
                  onRemove={() => handleRemoveTag(tag.name)}
                />
              ))}

              {isAddingTag && (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    placeholder="tag-name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag();
                      if (e.key === 'Escape') setIsAddingTag(false);
                    }}
                    className="w-24 bg-slate-900 border border-blue-500 text-xs px-2 py-0.5 rounded-full text-slate-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-xs text-blue-400 hover:text-white"
                  >
                    ✓
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Note Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Personal Note
              </span>
              {isSavingNote && <span className="text-[11px] text-blue-400">Saving...</span>}
            </div>

            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={handleSaveNote}
              placeholder="Add personal notes, questions, or action items..."
              className="w-full bg-[#0D1322] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 resize-none transition-colors"
            />
          </div>

          {/* Attachments Section */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Attachments ({memory.attachments?.length || 0})
            </span>

            {(!memory.attachments || memory.attachments.length === 0) ? (
              <p className="text-xs text-slate-500 italic">No files attached.</p>
            ) : (
              <div className="space-y-2">
                {memory.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium truncate">{att.name}</div>
                        {att.size && <div className="text-[10px] text-slate-500">{att.size}</div>}
                      </div>
                    </div>
                    <a
                      href={att.url || '#'}
                      onClick={(e) => {
                        if (!att.url) {
                          e.preventDefault();
                          alert(`Mock attachment: ${att.name}`);
                        }
                      }}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                      title="Open attachment"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
