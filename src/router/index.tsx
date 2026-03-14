import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CourseBrowsePage from "@/pages/CourseBrowsePage";
import NotFoundPage from "@/pages/NotFoundPage";

// Student Pages
import StudentLayout from "@/components/layout/StudentLayout";
import StudentDashboard from "@/pages/student/StudentDashboard";
import MyCoursesPage from "@/pages/student/MyCoursesPage";
import CoursePlayerPage from "@/pages/student/CoursePlayerPage";
import StudyHistoryPage from "@/pages/student/StudyHistoryPage";
import LeaderboardPage from "@/pages/student/LeaderboardPage";
import StudentProfilePage from "@/pages/student/StudentProfilePage";

// Educator Pages
import EducatorLayout from "@/components/layout/EducatorLayout";
import EducatorDashboard from "@/pages/educator/EducatorDashboard";
import CreateCoursePage from "@/pages/educator/CreateCoursePage";
import ManageCoursesPage from "@/pages/educator/ManageCoursesPage";
import EditCoursePage from "@/pages/educator/EditCoursePage";
import StudentsPage from "@/pages/educator/StudentsPage";
import AnalyticsPage from "@/pages/educator/AnalyticsPage";

const router = createBrowserRouter([
  // ── Public Routes ───────────────────────────────────────
  { path: "/",              element: <LandingPage /> },
  { path: "/login",         element: <LoginPage /> },
  { path: "/signup",        element: <SignupPage /> },
  { path: "/courses",       element: <CourseBrowsePage /> },

  // ── Student Routes ──────────────────────────────────────
  {
    path: "/dashboard/student",
    element: (
      <ProtectedRoute allowedRole="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                     element: <StudentDashboard /> },
      { path: "courses",                 element: <MyCoursesPage /> },
      { path: "courses/:courseId",        element: <CoursePlayerPage /> },
      { path: "history",                 element: <StudyHistoryPage /> },
      { path: "leaderboard",             element: <LeaderboardPage /> },
      { path: "profile",                 element: <StudentProfilePage /> },
    ],
  },

  // ── Educator Routes ─────────────────────────────────────
  {
    path: "/dashboard/educator",
    element: (
      <ProtectedRoute allowedRole="educator">
        <EducatorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                     element: <EducatorDashboard /> },
      { path: "create-course",           element: <CreateCoursePage /> },
      { path: "edit-course/:courseId",   element: <EditCoursePage /> },
      { path: "manage-courses",          element: <ManageCoursesPage /> },
      { path: "students",                element: <StudentsPage /> },
      { path: "analytics",              element: <AnalyticsPage /> },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────
  { path: "*",              element: <NotFoundPage /> },
]);

export default router;
