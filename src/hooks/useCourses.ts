import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/api/coursesApi";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => coursesApi.getAll().then((r) => r.data),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}
