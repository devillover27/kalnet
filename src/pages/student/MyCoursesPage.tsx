import { useEnrollment } from "@/hooks/useEnrollment";
import { Link } from "react-router-dom";
import { BookOpen, Loader2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function MyCoursesPage() {
  const { enrollments, isLoading } = useEnrollment();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">Continue learning where you left off</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No courses yet</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">Browse our catalog and enroll in a course to get started on your learning journey</p>
          <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {enrollments.map((enrollment, i) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/dashboard/student/courses/${enrollment.courseId}`}
                className="card block overflow-hidden group"
              >
                <div className="h-40 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #eef2ff, #ede9fe)" }}>
                  {enrollment.course?.thumbnailUrl ? (
                    <img src={enrollment.course.thumbnailUrl} alt={enrollment.course?.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-indigo-200" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <PlayCircle className="w-14 h-14 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{enrollment.course?.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{enrollment.course?.lessons?.length || 0} lessons</p>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500 font-medium">Progress</span>
                    <span className="font-bold text-indigo-600">{Math.round(enrollment.progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
