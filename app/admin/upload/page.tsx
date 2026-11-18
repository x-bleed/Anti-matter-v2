'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/components/admin/UploadDropzone';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { INSTITUTION, DEPARTMENTS, COURSES } from '@/lib/constants';
import { ResourceType } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { uploadResource } from './actions';
import { CheckCircle2, ShieldCheck, FileUp } from 'lucide-react';

export default function AdminUploadPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [institutionId, setInstitutionId] = useState(INSTITUTION.id);
  const [departmentSlug, setDepartmentSlug] = useState('cse');
  const [courseId, setCourseId] = useState(COURSES[0].id);
  const [type, setType] = useState<ResourceType>('notes');
  const [title, setTitle] = useState('');
  const [pageCount, setPageCount] = useState('12');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | undefined>(undefined);

  const filteredCourses = COURSES.filter((c) => {
    const dept = DEPARTMENTS.find((d) => d.slug === departmentSlug);
    return dept ? c.department_id === dept.id : true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(undefined);

    if (!selectedFile) {
      setFileError('Please drop or select a PDF document.');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      error('Title must be at least 3 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set('file', selectedFile);
      formData.set('courseId', courseId);
      formData.set('type', type);
      formData.set('title', title.trim());
      formData.set('pageCount', pageCount);

      const res = await uploadResource(formData);

      if (res.error) {
        error(res.error);
        setIsSubmitting(false);
      } else {
        success('Resource Uploaded Successfully', `Published under ${title}`);
        setTimeout(() => {
          router.push('/admin/resources');
        }, 800);
      }
    } catch {
      error('Failed to upload resource. Please check server logs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="font-heading text-xl font-bold text-text">Upload Academic Resource</h2>
        <p className="text-xs text-muted mt-0.5">
          Strict admin validation: only valid PDF headers and sanitized filenames are stored.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Upload form: dropzone at top (Blueprint 4.5) */}
        <UploadDropzone
          selectedFile={selectedFile}
          onFileSelect={(file) => {
            setSelectedFile(file);
            if (file && !title) {
              // Pre-fill clean title from filename
              const clean = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
              setTitle(clean.charAt(0).toUpperCase() + clean.slice(1));
            }
          }}
          error={fileError}
        />

        {/* 2 column fields (institution, department, course, type, title) (Blueprint 4.5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Institution */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">
              Institution
            </label>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="h-11 rounded-md border border-border bg-surface-2 px-3 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value={INSTITUTION.id}>{INSTITUTION.name} (IUB)</option>
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">
              Department
            </label>
            <select
              value={departmentSlug}
              onChange={(e) => {
                setDepartmentSlug(e.target.value);
                const dept = DEPARTMENTS.find((d) => d.slug === e.target.value);
                const firstCourse = COURSES.find((c) => c.department_id === dept?.id);
                if (firstCourse) setCourseId(firstCourse.id);
              }}
              className="h-11 rounded-md border border-border bg-surface-2 px-3 text-sm text-text focus:border-primary focus:outline-none"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.slug}>
                  {dept.name} ({dept.slug.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">
              Course Code
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="h-11 rounded-md border border-border bg-surface-2 px-3 text-sm text-text font-mono focus:border-primary focus:outline-none"
            >
              {filteredCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text uppercase tracking-wider">
              Resource Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ResourceType)}
              className="h-11 rounded-md border border-border bg-surface-2 px-3 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="notes">Lecture Notes</option>
              <option value="past_paper">Past Examination Paper</option>
              <option value="slides">Lecture Slides</option>
              <option value="other">Manual / Formula Sheet / Other</option>
            </select>
          </div>
        </div>

        {/* Title: Full width */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Input
              label="Resource Title (3 to 120 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Object-Oriented Programming Comprehensive Notes"
              required
            />
          </div>

          <div className="md:col-span-1">
            <Input
              label="Estimated Pages"
              type="number"
              min="1"
              max="1000"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              placeholder="e.g. 24"
            />
          </div>
        </div>

        {/* Submit button right aligned (Blueprint 4.5) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/admin')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="gap-2"
          >
            <FileUp className="h-4 w-4" />
            <span>Publish Resource</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
