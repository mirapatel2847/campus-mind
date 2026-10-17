import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Loader2, Sparkles, X, FileText, Image as ImageIcon } from 'lucide-react';
import { createMemory } from '../../api/memories';
import { Memory } from '../../types/memory';

interface QuickCaptureProps {
  onCreated: (memory: Memory) => void;
}

export const QuickCapture: React.FC<QuickCaptureProps> = ({ onCreated }) => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global shortcut handler (⌘+E or Ctrl+E)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed && files.length === 0) return;

    setIsSubmitting(true);
    try {
      const newMemory = await createMemory({
        content: trimmed || (files[0] ? `Attached: ${files[0].name}` : 'Quick note'),
        files,
      });
      setContent('');
      setFiles([]);
      onCreated(newMemory);
    } catch (err) {
      console.error('Failed to create memory:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSave = (content.trim().length > 0 || files.length > 0) && !isSubmitting;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative bg-[#090E1A] border rounded-xl p-4 transition-all duration-200 shadow-md ${
        isDragging
          ? 'border-blue-500 bg-blue-950/20 ring-2 ring-blue-500/30'
          : 'border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Header with Label and Shortcut Badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>New Item</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md shadow-inner select-none">
          <kbd>⌘</kbd>+<kbd>E</kbd>
        </div>
      </div>

      {/* Multiline Input */}
      <textarea
        ref={textareaRef}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        placeholder="Paste a link, forward a note, or drop an image or PDF..."
        className="w-full bg-transparent border-0 resize-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 leading-relaxed font-normal"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />

      {/* Attachment Chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 pt-1">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="inline-flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg"
            >
              {file.type.includes('image') ? (
                <ImageIcon className="w-3 h-3 text-blue-400" />
              ) : (
                <FileText className="w-3 h-3 text-amber-400" />
              )}
              <span className="truncate max-w-[160px] font-medium">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-white ml-0.5 focus:outline-none"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors text-xs flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-slate-600"
            title="Attach file or document"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">Attach</span>
          </button>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Drag files directly here
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!canSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-900" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuickCapture;
