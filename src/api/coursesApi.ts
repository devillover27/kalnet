import api from "./axios";
import type { Course, Enrollment, CreateCoursePayload } from "@/types";

export const coursesApi = {
  getAll:         ()             => api.get<Course[]>("/courses"),
  getById:        (id: string)   => api.get<Course>(`/courses/${id}`),
  create:         (data: CreateCoursePayload) => api.post<Course>("/courses", data),
  update:         (id: string, data: Partial<CreateCoursePayload>) =>
                                    api.put<Course>(`/courses/${id}`, data),
  delete:         (id: string)   => api.delete(`/courses/${id}`),
  enroll:         (id: string)   => api.post<Enrollment>(`/courses/${id}/enroll`),
  getEnrollments: ()             => api.get<Enrollment[]>("/student/enrollments"),
  completeLesson: (courseId: string, lessonId: string) =>
                    api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
};
