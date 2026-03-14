import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import type { LeaderboardEntry } from "@/types";

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.get<LeaderboardEntry[]>("/leaderboard").then((r) => r.data),
  });
}
