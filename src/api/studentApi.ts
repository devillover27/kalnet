import api from "./axios";
import type { StreakData, StudyTodayResponse, StudentStats } from "@/types";

export const studentApi = {
  studyToday:     ()  => api.post<StudyTodayResponse>("/student/study-today"),
  getStreak:      ()  => api.get<StreakData>("/student/streak"),
  getHistory:     ()  => api.get<string[]>("/student/history"),
  getStats:       ()  => api.get<StudentStats>("/student/stats"),
};
