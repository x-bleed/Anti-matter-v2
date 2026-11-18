import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary-soft border border-primary/20 mb-6">
        <FileQuestion className="h-8 w-8" />
      </div>

      <h1 className="font-heading text-4xl font-bold tracking-tight text-text">
        404 - Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm text-muted leading-relaxed">
        The course resource, route, or document you are looking for does not exist or has been relocated.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Link href="/library">
          <Button variant="secondary" className="gap-2">
            <Search className="h-4 w-4" />
            <span>Search Library</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="primary" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
