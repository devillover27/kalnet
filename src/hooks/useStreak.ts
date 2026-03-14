import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/api/studentApi";
import { toast } from "sonner";

export function useStreak() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["streak"],
    queryFn: () => studentApi.getStreak().then((r) => r.data),
  });

  const studyMutation = useMutation({
    mutationFn: () => studentApi.studyToday().then((r) => r.data),
    onSuccess: (data) => {
      if (data.alreadyLogged) {
        toast.warning("Already logged today! ✅");
      } else {
        toast.success(`🔥 ${data.newStreak} day streak! Keep it up!`);
        refetch();
        queryClient.invalidateQueries({ queryKey: ["student-stats"] });
        queryClient.invalidateQueries({ queryKey: ["study-history"] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
    },
    onError: () => {
      toast.error("Failed to log study. Please try again.");
    },
  });

  return {
    streak: data,
    isLoading,
    studyToday: studyMutation.mutate,
    isStudying: studyMutation.isPending,
  };
}
