import { z } from 'zod';

export const uploadSchema = z.object({
  courseId: z.string().uuid('Please select a valid course'),
  type: z.enum(['notes', 'past_paper', 'slides', 'other'], {
    errorMap: () => ({ message: 'Please select a valid resource type' }),
  }),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120, 'Title cannot exceed 120 characters'),
  pageCount: z.coerce.number().min(1).max(2000).default(10),
});

export const searchSchema = z.object({
  q: z.string().max(100).optional(),
  department: z.string().optional(),
  course: z.string().optional(),
  type: z.enum(['all', 'notes', 'past_paper', 'slides', 'other']).optional(),
  institution: z.string().optional(),
  semester: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title', 'popular']).default('newest'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const cgpaSchema = z.object({
  cgpa: z.coerce.number().min(0.0, 'CGPA cannot be negative').max(4.0, 'CGPA maximum is 4.00'),
  creditsCompleted: z.coerce.number().min(0, 'Credits cannot be negative').max(200, 'Credits limit exceeded'),
  alias: z.string().trim().max(30, 'Alias maximum 30 characters').optional(),
  showName: z.boolean().default(false),
});

export const reportSchema = z.object({
  resourceId: z.string().uuid('Invalid resource identifier'),
  reason: z.string().trim().min(10, 'Reason must be at least 10 characters').max(500, 'Reason cannot exceed 500 characters'),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  alias: z.string().trim().max(30).optional().nullable(),
  departmentId: z.string().uuid().optional().nullable(),
});
