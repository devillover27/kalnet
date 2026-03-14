const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { authMiddleware, educatorOnly } = require("../middleware/auth");

const prisma = new PrismaClient();

router.use(authMiddleware);
router.use(educatorOnly);

// GET /api/analytics/students
router.get("/students", async (req, res) => {
  try {
    const filter = req.query.filter || "all";

    // Get all students enrolled in this educator's courses
    const educatorCourses = await prisma.course.findMany({
      where: { educatorId: req.userId },
      select: { id: true },
    });
    const courseIds = educatorCourses.map((c) => c.id);

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        student: {
          include: {
            studyDates: { orderBy: { date: "desc" } },
            enrollments: true,
          },
        },
      },
    });

    // Deduplicate students
    const studentMap = new Map();
    for (const e of enrollments) {
      const s = e.student;
      if (!studentMap.has(s.id)) {
        const dates = s.studyDates.map((d) => d.date);
        const today = new Date().toISOString().split("T")[0];

        // Calculate streak
        let currentStreak = 0;
        if (dates.length > 0) {
          const sorted = [...dates].sort().reverse();
          const todayDate = new Date(today);
          const lastDate = new Date(sorted[0]);
          const diff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diff <= 1) {
            currentStreak = 1;
            for (let i = 1; i < sorted.length; i++) {
              const prev = new Date(sorted[i - 1]);
              const curr = new Date(sorted[i]);
              const d = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
              if (d === 1) currentStreak++;
              else break;
            }
          }
        }

        studentMap.set(s.id, {
          studentId: s.id,
          studentName: s.name,
          email: s.email,
          currentStreak,
          totalStudyDays: dates.length,
          coursesEnrolled: s.enrollments.length,
          lastActiveDate: dates[0] || null,
        });
      }
    }

    let students = Array.from(studentMap.values());

    // Apply filter
    if (filter === "top-learners") {
      students = students.filter((s) => s.currentStreak >= 7).sort((a, b) => b.currentStreak - a.currentStreak);
    } else if (filter === "inactive") {
      students = students.filter((s) => s.currentStreak === 0);
    } else if (filter === "low-activity") {
      students = students.filter((s) => s.totalStudyDays < 5);
    }

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

// GET /api/analytics/stats
router.get("/stats", async (req, res) => {
  try {
    const educatorCourses = await prisma.course.findMany({
      where: { educatorId: req.userId },
      include: {
        enrollments: {
          include: {
            student: {
              include: { studyDates: { orderBy: { date: "desc" } } },
            },
          },
        },
      },
    });

    const courseIds = educatorCourses.map((c) => c.id);
    const totalCourses = educatorCourses.length;

    // Unique students
    const studentMap = new Map();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split("T")[0];
    let totalStreak = 0;

    for (const c of educatorCourses) {
      for (const e of c.enrollments) {
        const s = e.student;
        if (!studentMap.has(s.id)) {
          const dates = s.studyDates.map((d) => d.date);
          const isActive = dates.some((d) => d >= sevenDaysStr);

          // Current streak
          let streak = 0;
          if (dates.length > 0) {
            const sorted = [...dates].sort().reverse();
            const today = new Date().toISOString().split("T")[0];
            const lastDate = new Date(sorted[0]);
            const todayDate = new Date(today);
            const diff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff <= 1) {
              streak = 1;
              for (let i = 1; i < sorted.length; i++) {
                const prev = new Date(sorted[i - 1]);
                const curr = new Date(sorted[i]);
                const d = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
                if (d === 1) streak++;
                else break;
              }
            }
          }

          totalStreak += streak;
          studentMap.set(s.id, { active: isActive });
        }
      }
    }

    const totalStudents = studentMap.size;
    const activeStudents = Array.from(studentMap.values()).filter((s) => s.active).length;
    const averageStudentStreak = totalStudents > 0 ? totalStreak / totalStudents : 0;

    res.json({
      totalCourses,
      totalStudents,
      activeStudents,
      averageStudentStreak: Math.round(averageStudentStreak * 10) / 10,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

module.exports = router;
