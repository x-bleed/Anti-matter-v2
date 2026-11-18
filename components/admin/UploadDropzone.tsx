'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface UploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

export function UploadDropzone({ onFileSelect, selectedFile, error }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const file = e.dataTransfer.files[0];
      validateAndSet(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSet(e.target.files[0]);
    }
  };

  const validateAndSet = (file: File) => {
    // Client-side quick check (Blueprint 5.3 Item 13: 25MB max, PDF)
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Only PDF documents are accepted.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      alert('File exceeds 25 MB limit.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Upload dropzone: Min height 200px, 32px padding, 16px radius, 2px dashed border, icon 40px centered (Blueprint 4.4) */}
      {/* Drag state fills primary at 10% */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'min-h-[200px] p-8 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition duration-200 text-center',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border bg-surface hover:border-primary-soft hover:bg-surface-2',
          error && 'border-danger/70 bg-danger/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-text">{selectedFile.name}</p>
            <p className="text-xs font-mono text-muted">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for secure upload
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="mt-2 inline-flex items-center gap-1 text-xs text-danger hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Icon 40px centered */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-soft">
              <UploadCloud className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">
                Click to browse or drop your course PDF here
              </p>
              <p className="text-xs text-muted mt-1">
                Strict server validation: Maximum 25 MB, verified <code className="font-mono text-primary-soft">%PDF-</code> magic byte header.
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
