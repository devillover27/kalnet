import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/constants";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.token);
      toast.success("Welcome back! 🎉");
      navigate(res.data.user.role === "student" ? "/dashboard/student" : "/dashboard/educator");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, left: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <BookOpen style={{ width: 32, height: 32, color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12 }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", maxWidth: 360 }}>
            Continue your learning journey and keep your streak alive!
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: "#fff" }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ width: "100%", maxWidth: 440 }}>
          <Link to="/" className="flex items-center gap-2 lg:hidden" style={{ marginBottom: 32 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen style={{ width: 18, height: 18, color: "#fff" }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{APP_NAME}</span>
          </Link>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Log in to your account
          </h2>
          <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 14 }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ fontWeight: 600, color: "#6366f1" }}>Sign up free</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="form-label">Email</label>
              <input type="email" {...register("email")} className="form-input" placeholder="you@example.com" />
              {errors.email && <p style={{ marginTop: 6, fontSize: 13, color: "#ef4444", fontWeight: 500 }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="form-input"
                  style={{ paddingRight: 48 }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}
                >
                  {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              {errors.password && <p style={{ marginTop: 6, fontSize: 13, color: "#ef4444", fontWeight: 500 }}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: "100%", padding: "14px 0", fontSize: 15, cursor: "pointer" }}>
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Logging in...</>
              ) : "Log In"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
