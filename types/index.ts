export type ResourceType = 'notes' | 'past_paper' | 'slides' | 'other';
export type ResourceStatus = 'draft' | 'published' | 'flagged';
export type UserRole = 'student' | 'admin';
export type CGPAStatus = 'pending' | 'verified' | 'rejected';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Institution {
  id: string;
  name: string;
  slug: string;
  domain: string;
  created_at?: string;
}

export interface Department {
  id: string;
  institution_id: string;
  name: string;
  slug: string;
  file_count?: number;
  created_at?: string;
}

export interface Course {
  id: string;
  department_id: string;
  code: string;
  title: string;
  semester: string;
  created_at?: string;
  department?: Department;
}

export interface Resource {
  id: string;
  course_id: string;
  title: string;
  type: ResourceType;
  file_path: string;
  file_size?: string;
  page_count?: number;
  uploaded_by?: string;
  status: ResourceStatus;
  created_at: string;
  search_vector?: string;
  course?: Course;
  download_count?: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department_id?: string;
  alias?: string;
  avatar_url?: string;
  department?: Department;
  created_at?: string;
}

export interface CGPASubmission {
  id: string;
  profile_id: string;
  cgpa: number;
  credits_completed: number;
  proof_path: string;
  status: CGPAStatus;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  profile?: Profile;
}

export interface LeaderboardEntry {
  rank: number;
  profile_id: string;
  name: string;
  alias?: string;
  avatar_url?: string;
  department_code: string;
  department_name: string;
  cgpa: number;
  credits_completed: number;
  verified: boolean;
  semester?: string;
}

export interface Report {
  id: string;
  resource_id: string;
  reporter_id?: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  resource?: Resource;
  reporter?: Profile;
}

export interface SearchFilterState {
  q?: string;
  institution?: string;
  department?: string;
  course?: string;
  type?: ResourceType | 'all';
  semester?: string;
  sort?: 'newest' | 'oldest' | 'title' | 'popular';
  page?: number;
}
