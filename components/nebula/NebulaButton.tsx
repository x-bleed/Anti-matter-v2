'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NebulaButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function NebulaButton({ onClick, isOpen }: NebulaButtonProps) {
  return (
    // NEBULA button: 56px circle, full radius, fixed bottom right, 24px offset. Purple with glow (Blueprint 4.4)
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-drawer flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all duration-250',
        'hover:scale-105 hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/40',
        'shadow-[0_0_24px_rgba(124,58,237,0.5)]',
        isOpen && 'rotate-90 bg-primary-hover shadow-[0_0_32px_rgba(124,58,237,0.8)]'
      )}
      aria-label="Open NEBULA Assistant"
      title="Open NEBULA Smart Search"
    >
      <Sparkles className="h-6 w-6 text-white animate-pulse" />
    </button>
  );
}
