import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/api/studentApi";
import { useAuthStore } from "@/store/authStore";
import { useStreak } from "@/hooks/useStreak";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from "date-fns";
import { motion } from "framer-motion";
import { getMotivationMessage } from "@/lib/streak";
import {
  Flame, Calendar, BookOpen, Clock, Loader2, CheckCircle, TrendingUp,
} from "lucide-react";
import { useState } from "react";

/* ── Stats Card ── */
function StatsCard({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: string | number; accent: string;
}) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: accent + "18" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-gray-900 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

/* ── Study Button ── */
function StudyButton({ studiedToday, onStudy, loading }: {
  studiedToday: boolean; onStudy: () => void; loading: boolean;
}) {
  if (studiedToday) {
    return (
      <div className="card p-5 flex items-center gap-4 border-green-200 bg-green-50/60">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-base font-bold text-green-800">You studied today! 🎉</p>
          <p className="text-sm text-green-600 mt-0.5">Come back tomorrow to keep your streak going</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onStudy}
      disabled={loading}
      className="w-full card p-5 flex items-center gap-4 border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 transition-all cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
        {loading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Flame className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="text-left">
        <p className="text-base font-bold text-gray-900">
          {loading ? "Logging your study..." : "I Studied Today!"}
        </p>
        <p className="text-sm text-gray-500 mt-0.5">Click to log today's study session and build your streak</p>
      </div>
    </button>
  );
}

/* ── Calendar ── */
function StreakCalendar({ studyDates }: { studyDates: string[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const isStudied = (day: Date) => studyDates.includes(format(day, "yyyy-MM-dd"));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={prevMonth} className="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">←</button>
        <h3 className="text-sm font-bold text-gray-700">{format(currentDate, "MMMM yyyy")}</h3>
        <button onClick={nextMonth} className="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[11px] text-gray-400 font-semibold py-1">{d}</div>
        ))}
        {Array.from({ length: startPadding }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map((day) => {
          const studied = isStudied(day);
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center text-xs font-semibold transition-all ${
                studied
                  ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm shadow-green-200"
                  : today
                    ? "ring-2 ring-indigo-400 text-indigo-600 bg-indigo-50"
                    : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-emerald-500" />
          Studied
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-3 rounded ring-2 ring-indigo-400" />
          Today
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { streak, isLoading, studyToday, isStudying } = useStreak();

  const { data: stats } = useQuery({
    queryKey: ["student-stats"],
    queryFn: () => studentApi.getStats().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const currentStreak = streak?.currentStreak ?? stats?.currentStreak ?? 0;
  const totalStudyDays = streak?.totalStudyDays ?? stats?.totalStudyDays ?? 0;
  const coursesEnrolled = stats?.coursesEnrolled ?? 0;
  const studiedToday = streak?.studiedToday ?? stats?.studiedToday ?? false;
  const lastStudyDate = streak?.lastStudyDate ?? stats?.lastStudyDate;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 100%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10 p-8">
          <p className="text-indigo-200 text-sm font-medium">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-indigo-100 mt-2 text-sm sm:text-base max-w-lg">{getMotivationMessage(currentStreak)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={<Flame className="w-6 h-6 text-orange-500" />} label="Current Streak" value={`${currentStreak} days`} accent="#f97316" />
        <StatsCard icon={<Calendar className="w-6 h-6 text-indigo-500" />} label="Total Study Days" value={totalStudyDays} accent="#6366f1" />
        <StatsCard icon={<BookOpen className="w-6 h-6 text-violet-500" />} label="Courses Enrolled" value={coursesEnrolled} accent="#8b5cf6" />
        <StatsCard icon={<Clock className="w-6 h-6 text-emerald-500" />} label="Last Study Date" value={lastStudyDate ? format(new Date(lastStudyDate), "MMM d") : "—"} accent="#10b981" />
      </div>

      {/* Study Button */}
      <StudyButton studiedToday={studiedToday} onStudy={() => studyToday()} loading={isStudying} />

      {/* Streak + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streak Display */}
        <div className="card p-8 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", boxShadow: "0 8px 30px rgba(249, 115, 22, 0.3)" }}>
            <Flame className="w-12 h-12 text-white" />
          </div>
          <div className="text-5xl font-extrabold text-gray-900">{currentStreak}</div>
          <p className="text-gray-500 mt-1 font-medium">Day Streak 🔥</p>
          {streak?.longestStreak !== undefined && (
            <div className="mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-orange-50 text-orange-700">
              <TrendingUp className="w-4 h-4" />
              Longest: {streak.longestStreak} days
            </div>
          )}
        </div>

        {/* Calendar */}
        <StreakCalendar studyDates={streak?.studyDates || []} />
      </div>
    </motion.div>
  );
}
