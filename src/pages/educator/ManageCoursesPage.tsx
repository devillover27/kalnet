import { useCourses } from "@/hooks/useCourses";
import { coursesApi } from "@/api/coursesApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, Trash2, Users, Loader2, Edit, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/lib/utils";

export default function ManageCoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setDeletingId(id);
    try {
      await coursesApi.delete(id);
      toast.success("Course deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    } catch {
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Edit or delete your published courses</p>
        </div>
        <Link to="/dashboard/educator/create-course" className="btn btn-primary">
          <PlusCircle className="w-4 h-4" /> New Course
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-10 h-10 text-violet-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No courses yet</h3>
          <p className="text-sm text-gray-400 mb-6">Create your first course to get started</p>
          <Link to="/dashboard/educator/create-course" className="btn btn-primary">Create Course</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <div className="h-36 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #ede9fe, #e0e7ff)" }}>
                {course.thumbnailUrl ? (
                  <img src={getMediaUrl(course.thumbnailUrl)} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-10 h-10 text-violet-200" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-violet-100 text-violet-700">{course.category}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Users className="w-3 h-3" /> {course.enrollmentCount}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-2">
                  <Link to={`/dashboard/educator/edit-course/${course.id}`} className="btn btn-outline text-xs py-2 px-3 cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    disabled={deletingId === course.id}
                    className="btn btn-danger text-xs py-2 px-3 cursor-pointer"
                  >
                    {deletingId === course.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
