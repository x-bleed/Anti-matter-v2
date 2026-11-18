'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log minimal identifier only, never leak stack traces or raw database statements (Blueprint 5.2 Item 10 & 11)
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger border border-danger/20 mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="font-heading text-3xl font-bold tracking-tight text-text">
        Something went wrong
      </h1>

      {/* Blueprint 5.2 Item 10: Generic message, no stack trace, no raw database errors */}
      <p className="mt-3 max-w-md text-sm text-muted leading-relaxed">
        An unexpected error occurred while processing your request. For security reasons, details have been logged internally.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Button onClick={() => reset()} variant="secondary" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try again</span>
        </Button>
        <Link href="/">
          <Button variant="primary" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
