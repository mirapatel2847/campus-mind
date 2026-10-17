import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { MemoryTag } from '../../types/memory';

interface TagChipProps {
  tag: MemoryTag;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export const TagChip: React.FC<TagChipProps> = ({ tag, onRemove, size = 'sm' }) => {
  const isAi = tag.ai;

  const sizeClasses =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1'
      : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-colors border select-none ${sizeClasses} ${
        isAi
          ? 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-900/30'
          : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
      }`}
    >
      {isAi && <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />}
      <span>{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:text-white rounded-full p-0.5 focus:outline-none"
          aria-label={`Remove tag ${tag.name}`}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
};

export default TagChip;
