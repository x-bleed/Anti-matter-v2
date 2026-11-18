'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-6 border-b border-border overflow-x-auto no-scrollbar', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              // Height 44px, 0 16px padding, underline style, 2px primary indicator (Blueprint 4.4)
              'relative flex h-11 items-center px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-150',
              isActive
                ? 'text-primary-soft'
                : 'text-muted hover:text-text'
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'ml-2 rounded-full px-2 py-0.5 text-xs',
                  isActive ? 'bg-primary/20 text-primary-soft' : 'bg-surface-2 text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
            {/* 2px primary indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
