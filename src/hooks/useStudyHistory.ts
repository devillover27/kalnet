import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/api/studentApi";

export function useStudyHistory() {
  return useQuery({
    queryKey: ["study-history"],
    queryFn: () => studentApi.getHistory().then((r) => r.data),
  });
}
