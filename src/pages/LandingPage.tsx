import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  Flame, BookOpen, Trophy, BarChart3, Sparkles, ArrowRight, CheckCircle2, Star,
  Users, Zap, GraduationCap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─── Hero ───────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-50 to-violet-50 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gamified Learning Experience</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <span className="text-gray-900">Master Skills with</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                Daily Streaks
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
            >
              Build consistent learning habits with our gamified streak tracker.
              Explore courses, compete on leaderboards, and unlock your full potential.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="group px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95 flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/courses"
                className="px-8 py-4 text-lg font-semibold text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
              >
                Browse Courses
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { value: "10K+", label: "Students" },
                { value: "500+", label: "Courses" },
                { value: "95%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Features ───────────────────────────── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything You Need to <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Excel</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features designed to make learning effective and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Flame,         color: "from-orange-500 to-red-500",    shadow: "shadow-orange-200", title: "Study Streaks",      desc: "Build daily habits with our gamified streak tracker. Don't break the chain!" },
              { icon: BookOpen,      color: "from-indigo-500 to-violet-500", shadow: "shadow-indigo-200", title: "Rich Course Library", desc: "Explore curated courses across programming, design, business, and more." },
              { icon: Trophy,        color: "from-yellow-500 to-amber-500",  shadow: "shadow-yellow-200", title: "Leaderboard",         desc: "Compete with peers and climb the rankings based on your study consistency." },
              { icon: BarChart3,     color: "from-emerald-500 to-teal-500",  shadow: "shadow-emerald-200",title: "Analytics",           desc: "Educators get detailed insights into student engagement and progress." },
              { icon: GraduationCap, color: "from-violet-500 to-purple-500", shadow: "shadow-violet-200", title: "Course Creator",      desc: "Educators can create and manage courses with video lessons effortlessly." },
              { icon: Zap,           color: "from-blue-500 to-cyan-500",     shadow: "shadow-blue-200",   title: "Progress Tracking",   desc: "Track lesson completion, course progress, and learning milestones." },
            ].map(({ icon: Icon, color, shadow, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} ${shadow} shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">Three simple steps to kickstart your learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up", desc: "Create your free account as a Student or Educator in seconds." },
              { step: "02", title: "Start Learning", desc: "Browse courses, enroll, and watch video lessons at your own pace." },
              { step: "03", title: "Build Streaks", desc: "Log your study sessions daily and watch your streak grow!" },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center p-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 text-2xl font-extrabold mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {title}
                </h3>
                <p className="text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────── */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Loved by <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Learners</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya S.", role: "CS Student", text: "The streak system is genius! I've been studying consistently for 45 days now.", stars: 5 },
              { name: "Rahul M.", role: "Web Developer", text: "Best LMS I've used. Clean interface and the leaderboard keeps me motivated.", stars: 5 },
              { name: "Ananya K.", role: "Educator", text: "Creating courses is so easy. The analytics dashboard helps me understand my students.", stars: 5 },
            ].map(({ name, role, text, stars }, i) => (
              <motion.div
                key={name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-semibold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-12 sm:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M20 20h20v20H20z\'/%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                Join thousands of learners building daily habits and mastering new skills.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="group px-8 py-4 text-lg font-semibold text-indigo-600 rounded-2xl bg-white hover:bg-gray-50 shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  Get Started — It's Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-6 text-indigo-200 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Free forever plan</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
