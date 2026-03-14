import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCourses } from "@/hooks/useCourses";
import { useEnroll } from "@/hooks/useEnrollment";
import { useAuthStore } from "@/store/authStore";
import { Search, BookOpen, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/lib/utils";

export default function CourseBrowsePage() {
  const { data: courses, isLoading } = useCourses();
  const enrollMutation = useEnroll();
  const { isAuthenticated, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = (courses || []).filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e293b", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Explore <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Courses</span>
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 500, margin: "12px auto 0" }}>
            Discover courses across various categories and start learning today
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: "#94a3b8" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="form-input"
              style={{ paddingLeft: 48 }}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  background: selectedCategory === cat ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#f1f5f9",
                  color: selectedCategory === cat ? "#fff" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: selectedCategory === cat ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="card" style={{ padding: 80, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <BookOpen style={{ width: 40, height: 40, color: "#c7d2fe" }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#475569", marginBottom: 8 }}>No courses found</h3>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{ overflow: "hidden" }}
              >
                <div style={{ height: 180, background: "linear-gradient(135deg, #eef2ff, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {course.thumbnailUrl ? (
                    <img src={getMediaUrl(course.thumbnailUrl)} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <BookOpen style={{ width: 48, height: 48, color: "#c7d2fe" }} />
                  )}
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", color: "#6366f1" }}>
                      {course.category}
                    </span>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <h3 className="line-clamp-1" style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {course.title}
                  </h3>
                  <p className="line-clamp-2" style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, lineHeight: 1.6 }}>{course.description}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#94a3b8" }}>
                      <span className="flex items-center gap-1"><BookOpen style={{ width: 14, height: 14 }} /> {course.lessons?.length || 0}</span>
                      <span className="flex items-center gap-1"><Users style={{ width: 14, height: 14 }} /> {course.enrollmentCount}</span>
                    </div>
                    {isAuthenticated && user?.role === "student" ? (
                      <button
                        onClick={() => enrollMutation.mutate(course.id)}
                        disabled={enrollMutation.isPending}
                        className="btn btn-primary"
                        style={{ padding: "8px 16px", fontSize: 12, cursor: "pointer" }}
                      >
                        Enroll
                      </button>
                    ) : (
                      <Link to="/signup" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: 12 }}>
                        Sign Up
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
