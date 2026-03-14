import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { BookOpen, LogOut, LayoutDashboard } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath =
    user?.role === "educator" ? "/dashboard/educator" : "/dashboard/student";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-gray-100"
      style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {APP_NAME}
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Browse Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
