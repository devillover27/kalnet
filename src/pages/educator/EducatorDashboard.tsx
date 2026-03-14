import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analyticsApi";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { BookOpen, Users, UserCheck, Flame, Loader2, PlusCircle, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function StatsCard({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: string | number; accent: string;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: accent + "18" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-gray-900 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

export default function EducatorDashboard() {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["educator-stats"],
    queryFn: () => analyticsApi.getStats().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 40%, #a78bfa 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10 p-8">
          <p className="text-violet-200 text-sm font-medium">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {user?.name?.split(" ")[0]}! 📚
          </h1>
          <p className="text-violet-100 mt-2 text-sm sm:text-base">Here's an overview of your courses and students</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<BookOpen className="w-6 h-6 text-violet-500" />} label="Total Courses" value={stats?.totalCourses ?? 0} accent="#8b5cf6" />
        <StatsCard icon={<Users className="w-6 h-6 text-indigo-500" />} label="Total Students" value={stats?.totalStudents ?? 0} accent="#6366f1" />
        <StatsCard icon={<UserCheck className="w-6 h-6 text-emerald-500" />} label="Active Students" value={stats?.activeStudents ?? 0} accent="#10b981" />
        <StatsCard icon={<Flame className="w-6 h-6 text-orange-500" />} label="Avg Streak" value={stats?.averageStudentStreak ? `${Math.round(stats.averageStudentStreak)} days` : "0 days"} accent="#f97316" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/dashboard/educator/create-course" className="card p-6 flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", boxShadow: "0 6px 20px rgba(139, 92, 246, 0.3)" }}>
            <PlusCircle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900">Create New Course</h3>
            <p className="text-sm text-gray-400 mt-0.5">Add video lessons and publish to students</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>

        <Link to="/dashboard/educator/analytics" className="card p-6 flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 6px 20px rgba(99, 102, 241, 0.3)" }}>
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-400 mt-0.5">See student engagement and progress data</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
      </div>
    </motion.div>
  );
}
