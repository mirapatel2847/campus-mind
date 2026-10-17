import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  MoreHorizontal,
  Star,
  Archive,
  Trash2,
  ExternalLink,
  Flame,
  FileText,
  Globe,
} from 'lucide-react';
import { Memory } from '../../types/memory';
import { TagChip } from '../common/TagChip';

interface MemoryCardProps {
  memory: Memory;
  onOpenDetail: (memory: Memory) => void;
  onToggleFavourite: (id: string, isFav: boolean) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onOpenDetail,
  onToggleFavourite,
  onArchive,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const isLinkCard = memory.source_type === 'web' && !!memory.preview_image_url;
  const isMediaCard =
    (memory.source_type === 'image' || memory.source_type === 'pdf') &&
    !!memory.preview_image_url;

  const categoryColor = () => {
    switch (memory.category) {
      case 'exam':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'deadline':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'event':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'notice':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'resource':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <article
      onClick={() => onOpenDetail(memory)}
      className="group relative bg-[#090E1A] hover:bg-[#0E1626] border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between select-none"
    >
      <div>
        {/* Top Media Preview for Link or Image/PDF Cards */}
        {isLinkCard && memory.preview_image_url && (
          <div className="relative w-full h-36 bg-slate-950 overflow-hidden border-b border-slate-800/80">
            <img
              src={memory.preview_image_url}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase bg-black/70 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded-full border border-white/10">
              <Globe className="w-2.5 h-2.5 text-blue-400" />
              <span>{memory.source_ref}</span>
            </div>
          </div>
        )}

        {isMediaCard && memory.preview_image_url && (
          <div className="relative w-full h-40 bg-slate-950 overflow-hidden border-b border-slate-800/80">
            <img
              src={memory.preview_image_url}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase bg-black/70 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded-full border border-white/10">
              <FileText className="w-2.5 h-2.5 text-amber-400" />
              <span>{memory.source_type.toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Badges Bar: Category, Updated, High Importance */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Category Badge */}
              <span
                className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${categoryColor()}`}
              >
                {memory.category}
              </span>

              {/* Updated Badge for Superseding card */}
              {memory.supersedes_id && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  Updated
                </span>
              )}

              {/* High Importance Marker */}
              {memory.importance === 'high' && (
                <span
                  title="High Priority"
                  className="flex items-center gap-1 text-[10px] font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full border border-rose-500/20"
                >
                  <Flame className="w-2.5 h-2.5 text-rose-400" />
                  High
                </span>
              )}
            </div>

            {memory.is_favourite && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-100 text-sm leading-snug group-hover:text-blue-300 transition-colors">
            {memory.title}
          </h3>

          {/* Text Content (if not primarily a link/image card, or as description) */}
          {!isLinkCard && !isMediaCard && (
            <div className="relative max-h-40 overflow-hidden">
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {memory.content}
              </p>
              {/* Bottom Fade Gradient for Text Clamping */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#090E1A] group-hover:from-[#0E1626] to-transparent pointer-events-none transition-colors" />
            </div>
          )}

          {/* Link / Media card short summary */}
          {(isLinkCard || isMediaCard) && memory.summary && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {memory.summary}
            </p>
          )}

          {/* Tag Chips */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {memory.tags.slice(0, 4).map((tag) => (
                <TagChip key={tag.name} tag={tag} size="sm" />
              ))}
              {memory.tags.length > 4 && (
                <span className="text-[10px] text-slate-500 self-center">
                  +{memory.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Date (Left), Expand & More Menu (Right) */}
      <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-[11px] text-slate-400">
          {formatDate(memory.observed_at)}
        </span>

        <div className="flex items-center gap-1">
          {/* Expand icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(memory);
            }}
            title="Expand detail"
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* "..." Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              title="More actions"
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 bottom-full mb-1 w-36 bg-[#0E1626] border border-slate-700 rounded-lg shadow-xl py-1 z-20 animate-fadeIn text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenDetail(memory);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span>Open</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleFavourite(memory.id, !memory.is_favourite);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Star
                    className={`w-3 h-3 ${
                      memory.is_favourite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{memory.is_favourite ? 'Unfavourite' : 'Favourite'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onArchive(memory.id);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Archive className="w-3 h-3 text-slate-400" />
                  <span>{memory.is_archived ? 'Unarchive' : 'Archive'}</span>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(memory.id);
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default MemoryCard;
