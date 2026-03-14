import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/useCourses";
import { useEnrollment } from "@/hooks/useEnrollment";
import { coursesApi } from "@/api/coursesApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, CheckCircle, PlayCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/lib/utils";

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId!);
  const { enrollments } = useEnrollment();
  const queryClient = useQueryClient();
  const [completingLesson, setCompletingLesson] = useState<string | null>(null);

  const enrollment = enrollments.find((e) => e.courseId === courseId);
  const completedLessons = enrollment?.completedLessons || [];
  const sortedLessons = [...(course?.lessons || [])].sort((a, b) => a.order - b.order);
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const activeLesson = sortedLessons.find((l) => l.id === activeLessonId) || sortedLessons[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="card p-12 text-center text-gray-500">Course not found</div>;
  }

  const progress = enrollment?.progress ?? 0;

  const handleCompleteLesson = async (lessonId: string) => {
    setCompletingLesson(lessonId);
    try {
      await coursesApi.completeLesson(courseId!, lessonId);
      toast.success("Lesson completed! ✅");
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    } catch {
      toast.error("Failed to mark lesson complete");
    } finally {
      setCompletingLesson(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      {/* Course Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">{course.title}</h1>
        <p className="text-sm text-gray-500 mt-1">by {course.educatorName}</p>
      </div>

      {/* Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between text-sm mb-2.5">
          <span className="text-gray-600 font-medium">Course Progress</span>
          <span className="font-bold text-indigo-600">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completedLessons.length} of {sortedLessons.length} lessons completed</p>
      </div>

      {/* Player + Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card overflow-hidden" style={{ aspectRatio: "16/9", background: "#0f0f0f" }}>
            {activeLesson?.videoUrl ? (
              <iframe
                src={getMediaUrl(activeLesson.videoUrl)}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>

          {activeLesson && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{activeLesson.title}</h2>
              {!completedLessons.includes(activeLesson.id) ? (
                <button
                  onClick={() => handleCompleteLesson(activeLesson.id)}
                  disabled={completingLesson === activeLesson.id}
                  className="btn btn-primary cursor-pointer"
                >
                  {completingLesson === activeLesson.id ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Completing...</>
                  ) : (
                    <><CheckCircle className="w-4 h-4" /> Mark as Complete</>
                  )}
                </button>
              ) : (
                <span className="badge bg-green-100 text-green-700 py-2 px-4 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> Completed
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lesson List */}
        <div className="card overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-700">Lessons ({sortedLessons.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {sortedLessons.map((lesson, i) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isActive = lesson.id === (activeLesson?.id || "");
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-all cursor-pointer border-b border-gray-50 ${
                    isActive ? "bg-indigo-50/60" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : isActive
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-400"
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm flex-1 truncate ${isActive ? "font-semibold text-indigo-700" : "text-gray-700"}`}>
                    {lesson.title}
                  </span>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
