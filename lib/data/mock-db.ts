import { Resource, Course, Department, LeaderboardEntry, Profile, CGPASubmission, Report } from '@/types';
import { INSTITUTION, DEPARTMENTS, COURSES } from '@/lib/constants';

// Realistic sample PDF data URL for preview fallback
export const SAMPLE_PDF_BLOB = `data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFIvUmVzb3VyY2VzPDw+Pj4+ZW5kb2JqCjQgMCBvYmo8PC9MZW5ndGggNTQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzEyIFRECihBTlRJLU1BVFRFUiB2MiAtIEFjYWRlbWljIFJlc291cmNlIFByZXZpZXcpIFRqCkUKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1NiAwMDAwMCBuIAowMDAwMDAwMTExIDAwMDAwIG4gCjAwMDAwMDAyMTIgMDAwMDAgbiAKdHJhaWxlcjw8L1NpemUgNT4+CnN0YXJ0eHJlZgoxMjM0CiUlRU9G`;

// Production clean state: starts empty until real files are uploaded to Supabase
export const INITIAL_RESOURCES: Resource[] = [];

export const INITIAL_PROFILES: Profile[] = [];

// Production clean state: starts empty until students opt in and verify
export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [];

export const INITIAL_CGPA_SUBMISSIONS: CGPASubmission[] = [];

export const INITIAL_REPORTS: Report[] = [];
