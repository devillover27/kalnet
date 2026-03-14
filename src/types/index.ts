// ─── Auth ──────────────────────────────────────────────────
export type UserRole = "student" | "educator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// ─── Streak ────────────────────────────────────────────────
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  lastStudyDate: string | null;
  studiedToday: boolean;
  studyDates: string[];
}

export interface StudyTodayResponse {
  success: boolean;
  alreadyLogged: boolean;
  message: string;
  newStreak: number;
  totalStudyDays: number;
}

// ─── Course ────────────────────────────────────────────────
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  educatorId: string;
  educatorName: string;
  lessons: Lesson[];
  enrollmentCount: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  order: number;
  duration?: number;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  lessons: Omit<Lesson, "id" | "courseId">[];
}

// ─── Enrollment ────────────────────────────────────────────
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  course: Course;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
}

// ─── Leaderboard ───────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  avatar?: string;
  currentStreak: number;
  totalStudyDays: number;
}

// ─── Stats ─────────────────────────────────────────────────
export interface StudentStats {
  currentStreak: number;
  totalStudyDays: number;
  coursesEnrolled: number;
  lastStudyDate: string | null;
  studiedToday: boolean;
}

export interface EducatorStats {
  totalCourses: number;
  totalStudents: number;
  activeStudents: number;
  averageStudentStreak: number;
}

// ─── Analytics ─────────────────────────────────────────────
export interface StudentAnalyticsRow {
  studentId: string;
  studentName: string;
  email: string;
  currentStreak: number;
  totalStudyDays: number;
  coursesEnrolled: number;
  lastActiveDate: string | null;
}

export type AnalyticsFilter = "all" | "top-learners" | "inactive" | "low-activity";
