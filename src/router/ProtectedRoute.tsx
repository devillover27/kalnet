import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";

interface Props {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRole, children }: Props) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    const redirect =
      user.role === "student" ? "/dashboard/student" : "/dashboard/educator";
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
