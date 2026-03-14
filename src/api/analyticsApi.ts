import api from "./axios";
import type { StudentAnalyticsRow, EducatorStats } from "@/types";

export const analyticsApi = {
  getStudents: (filter?: string) =>
    api.get<StudentAnalyticsRow[]>("/analytics/students", { params: { filter } }),
  getStats:    () => api.get<EducatorStats>("/analytics/stats"),
};
