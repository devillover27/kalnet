import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { coursesApi } from "@/api/coursesApi";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, GripVertical, Loader2, Upload, BookOpen, Video } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  videoUrl: z.string().url("Must be a valid URL"),
  order: z.number(),
  duration: z.number().optional(),
});

const courseSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  lessons: z.array(lessonSchema).min(1, "At least one lesson is required"),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      thumbnailUrl: "",
      lessons: [{ title: "", videoUrl: "", order: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lessons" });

  const onSubmit = async (data: CourseForm) => {
    setIsSubmitting(true);
    try {
      await coursesApi.create(data);
      toast.success("Course created successfully! 🎉");
      navigate("/dashboard/educator/manage-courses");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Create New Course</h1>
        <p className="text-gray-500 mt-1 text-sm">Fill in the details below to publish a new course for your students</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Course Details Card */}
        <div className="card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Course Details</h2>
              <p className="text-xs text-gray-400">Basic information about your course</p>
            </div>
          </div>

          <div>
            <label className="form-label">Course Title</label>
            <input
              {...register("title")}
              className="form-input"
              placeholder="e.g. Introduction to React"
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.title.message}</p>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="form-input"
              style={{ resize: "none" }}
              placeholder="What will students learn in this course?"
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Category</label>
              <select {...register("category")} className="form-select">
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.category.message}</p>}
            </div>
            <div>
              <label className="form-label">Thumbnail URL <span className="text-gray-300 font-normal">(optional)</span></label>
              <input
                {...register("thumbnailUrl")}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Lessons Card */}
        <div className="card p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Video className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Lessons</h2>
                <p className="text-xs text-gray-400">{fields.length} lesson{fields.length !== 1 ? "s" : ""} added</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => append({ title: "", videoUrl: "", order: fields.length + 1 })}
              className="btn btn-outline text-xs py-2 px-4 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Lesson
            </button>
          </div>

          {errors.lessons?.message && (
            <p className="text-sm text-red-500 font-medium">{errors.lessons.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-300 mt-3 cursor-grab"><GripVertical className="w-4 h-4" /></div>
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-2">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <input
                      {...register(`lessons.${index}.title`)}
                      className="form-input"
                      placeholder={`Lesson ${index + 1} title`}
                    />
                    {errors.lessons?.[index]?.title && (
                      <p className="mt-1 text-xs text-red-500">{errors.lessons[index]?.title?.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register(`lessons.${index}.videoUrl`)}
                      className="form-input"
                      placeholder="Video URL (YouTube, Vimeo, etc.)"
                    />
                    {errors.lessons?.[index]?.videoUrl && (
                      <p className="mt-1 text-xs text-red-500">{errors.lessons[index]?.videoUrl?.message}</p>
                    )}
                  </div>
                  <input type="hidden" {...register(`lessons.${index}.order`, { valueAsNumber: true })} value={index + 1} />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all mt-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-4 text-base cursor-pointer"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Publishing Course...</>
          ) : (
            <><Upload className="w-5 h-5" /> Publish Course</>
          )}
        </button>
      </form>
    </motion.div>
  );
}
