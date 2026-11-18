import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface p-6 shadow-card',
        hoverEffect &&
          'transition duration-250 hover:-translate-y-0.5 hover:border-primary cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
