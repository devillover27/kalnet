import api from "./axios";
import type { AuthResponse, LoginPayload, SignupPayload } from "@/types";

export const authApi = {
  login:  (data: LoginPayload)  => api.post<AuthResponse>("/auth/login", data),
  signup: (data: SignupPayload) => api.post<AuthResponse>("/auth/signup", data),
  logout: ()                    => api.post("/auth/logout"),
  me:     ()                    => api.get<AuthResponse["user"]>("/auth/me"),
};
