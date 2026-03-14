import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Calendar, Trophy, User, LogOut, Flame, ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { APP_NAME } from "@/lib/constants";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard/student",             icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/student/courses",     icon: BookOpen,        label: "My Courses" },
  { to: "/dashboard/student/history",     icon: Calendar,        label: "History" },
  { to: "/dashboard/student/leaderboard", icon: Trophy,          label: "Leaderboard" },
  { to: "/dashboard/student/profile",     icon: User,            label: "Profile" },
];

export default function StudentSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-72 h-screen bg-[#fcfcfd] border-r border-gray-200/60 flex flex-col fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="px-8 py-7 flex items-center justify-center border-b border-gray-100/80">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-white">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {APP_NAME}
          </span>
        </div>
      </div>

      {/* User Info (Floating Card style) */}
      <div className="px-5 pt-6 pb-2">
        <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-3 group hover:border-indigo-200 transition-colors cursor-pointer">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-base border-2 border-white shadow-sm ring-1 ring-gray-100">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{user?.name}</p>
            <p className="text-xs font-medium text-indigo-500/80 truncate uppercase tracking-wider mt-0.5">Learner</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard/student"}
            className={({ isActive }) =>
              `relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                isActive
                  ? "text-white shadow-md shadow-indigo-500/25 ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/80"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-student-nav-bg"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 !text-white' : 'group-hover:scale-110 group-hover:text-indigo-600'}`} />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-gray-100/80 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="group flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-red-600 bg-white border border-gray-200 shadow-sm hover:shadow hover:border-red-200 transition-all duration-300 w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
