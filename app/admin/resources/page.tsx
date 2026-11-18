'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_RESOURCES } from '@/lib/data/mock-db';
import { Resource } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { Trash2, Edit, ExternalLink, Search, Filter, Plus, FileText } from 'lucide-react';

export default function AdminResourcesPage() {
  const { success, error } = useToast();
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      success('Resource Removed', `Deleted ${title}`);
    }
  };

  const filtered = resources.filter((res) => {
    const matchesType = filterType === 'all' || res.type === filterType;
    const matchesSearch =
      res.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      res.course?.code.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Manage Repository Resources</h2>
          <p className="text-xs text-muted mt-0.5">
            {resources.length} active files across all university courses.
          </p>
        </div>

        <Link href="/admin/upload">
          <Button size="sm" variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Upload New</span>
          </Button>
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by title or course..."
            className="h-10 w-full rounded-md border border-border bg-surface-2 pl-9 pr-3 text-xs text-text focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-muted">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-md border border-border bg-surface-2 px-3 text-xs text-text focus:border-primary focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="notes">Notes</option>
            <option value="past_paper">Past Paper</option>
            <option value="slides">Slides</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Resources table: 56 px rows with status badge and edit and delete icon buttons (Blueprint 4.5) */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-2/70 text-[11px] font-mono uppercase tracking-wider text-muted">
                <th className="py-3 px-4">Title &amp; Course</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Size &amp; Pages</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filtered.slice(0, 25).map((res) => (
                // 56 px rows (Blueprint 4.5)
                <tr
                  key={res.id}
                  className="h-14 hover:bg-surface-2/40 transition-colors"
                >
                  <td className="py-2.5 px-4 max-w-[280px]">
                    <p className="font-semibold text-text truncate">{res.title}</p>
                    <span className="font-mono text-[11px] text-primary-soft">
                      {res.course?.code}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <Badge variant={res.type} className="h-6 text-[10px] px-2">
                      {res.type.replace('_', ' ')}
                    </Badge>
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap font-mono text-muted">
                    {res.file_size} • {res.page_count}p
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      {res.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-4 whitespace-nowrap text-muted">
                    {formatDate(res.created_at)}
                  </td>

                  {/* Edit and delete icon buttons (36 px hit area minimum 40 px on touch) (Blueprint 4.5) */}
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/resource/${res.id}`}
                        className="flex h-9 w-9 sm:h-9 sm:w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-md text-muted hover:text-text hover:bg-surface-2 transition"
                        title="View PDF"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(res.id, res.title)}
                        className="flex h-9 w-9 sm:h-9 sm:w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-md text-muted hover:text-danger hover:bg-danger/10 transition"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
