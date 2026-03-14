import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi } from "@/api/coursesApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useEnrollment() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: () => coursesApi.getEnrollments().then((r) => r.data),
  });

  return { enrollments: data || [], isLoading };
}

export function useEnroll() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (courseId: string) => coursesApi.enroll(courseId).then((r) => r.data),
    onSuccess: (_data, courseId) => {
      toast.success("Successfully enrolled! 🎉");
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      navigate(`/dashboard/student/courses/${courseId}`);
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        toast.info("Already enrolled in this course");
      } else {
        toast.error("Failed to enroll. Please try again.");
      }
    },
  });
}
