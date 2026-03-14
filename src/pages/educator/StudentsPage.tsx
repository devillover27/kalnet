import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/api/analyticsApi";
import { Users, Loader2, Flame, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentsPage() {
  const { data: students, isLoading } = useQuery({
    queryKey: ["analytics-students"],
    queryFn: () => analyticsApi.getStudents().then((r) => r.data),
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
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500 mt-1">All students enrolled across your courses — {students?.length || 0} total</p>
      </div>

      {!students || students.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <Users className="w-10 h-10 text-violet-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No students yet</h3>
          <p className="text-sm text-gray-400">Students will appear here once they enroll in your courses</p>
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
                    <td style={{ padding: "14px 20px" }}>
                      <span className="text-sm text-gray-500">{s.email}</span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span className="badge bg-orange-50 text-orange-700">
                        <Flame className="w-3.5 h-3.5 mr-1" /> {s.currentStreak}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span className="text-sm font-semibold text-gray-600">{s.totalStudyDays}</span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "center" }}>
                      <span className="text-sm font-semibold text-gray-600">{s.coursesEnrolled}</span>
                    </td>
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
