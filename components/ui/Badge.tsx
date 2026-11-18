import React from 'react';
import { cn } from '@/lib/utils';
import { ResourceType } from '@/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ResourceType | 'verified' | 'pending' | 'success' | 'warning' | 'danger' | 'default';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'notes':
        return 'bg-primary/15 text-primary-soft border border-primary/30';
      case 'past_paper':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
      case 'slides':
        return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
      case 'other':
        return 'bg-surface-2 text-muted border border-border';
      case 'verified':
      case 'success':
        return 'bg-success/15 text-success border border-success/30';
      case 'pending':
      case 'warning':
        return 'bg-warning/15 text-warning border border-warning/30';
      case 'danger':
        return 'bg-danger/15 text-danger border border-danger/30';
      default:
        return 'bg-surface-2 text-text border border-border';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex h-7 items-center justify-center rounded-full px-3 text-xs font-semibold uppercase tracking-[0.04em] select-none',
        getVariantStyles(),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
