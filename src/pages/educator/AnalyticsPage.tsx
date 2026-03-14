import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analyticsApi";
import type { AnalyticsFilter } from "@/types";
import { BarChart3, Loader2, Flame } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const filters: { value: AnalyticsFilter; label: string }[] = [
  { value: "all",          label: "All Students" },
  { value: "top-learners", label: "Top Learners" },
  { value: "inactive",     label: "Inactive" },
  { value: "low-activity", label: "Low Activity" },
];

export default function AnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState<AnalyticsFilter>("all");

  const { data: students, isLoading } = useQuery({
    queryKey: ["analytics-students", activeFilter],
    queryFn: () => analyticsApi.getStudents(activeFilter).then((r) => r.data),
  });

  const chartData = (students || []).slice(0, 10).map((s) => ({
    name: s.studentName?.split(" ")[0] || "—",
    streak: s.currentStreak,
    studyDays: s.totalStudyDays,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Student engagement and activity insights</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className="cursor-pointer"
            style={{
              padding: "8px 16px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background: activeFilter === f.value ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "#f1f5f9",
              color: activeFilter === f.value ? "#fff" : "#64748b",
              boxShadow: activeFilter === f.value ? "0 4px 12px rgba(139, 92, 246, 0.3)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">Student Engagement (Top 10)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  padding: "10px 14px",
                }}
              />
              <Bar dataKey="streak" fill="#8b5cf6" name="Streak" radius={[6, 6, 0, 0]} />
              <Bar dataKey="studyDays" fill="#6366f1" name="Study Days" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      {!students || students.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <BarChart3 className="w-10 h-10 text-violet-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No data available</h3>
          <p className="text-sm text-gray-400">Student analytics will appear here</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Student</th>
                  <th style={{ textAlign: "left", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Streak</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Study Days</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Courses</th>
                  <th style={{ textAlign: "center", padding: "14px 20px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.studentId} style={{ borderBottom: "1px solid #f8fafc" }} className="hover:bg-gray-50/50 transition-colors">
                    <td style={{ padding: "14px 20px" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                          {s.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{s.studentName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}><span className="text-sm text-gray-500">{s.email}</span></td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span className="badge bg-orange-50 text-orange-700"><Flame className="w-3.5 h-3.5 mr-1" /> {s.currentStreak}</span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}><span className="text-sm font-semibold text-gray-600">{s.totalStudyDays}</span></td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}><span className="text-sm font-semibold text-gray-600">{s.coursesEnrolled}</span></td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}><span className="text-sm text-gray-400">{s.lastActiveDate || "Never"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
