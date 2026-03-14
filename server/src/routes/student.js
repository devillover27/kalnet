const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { authMiddleware } = require("../middleware/auth");

const prisma = new PrismaClient();

// All student routes require auth
router.use(authMiddleware);

// POST /api/student/study-today
router.post("/study-today", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    // Check if already logged
    const existing = await prisma.studyDate.findUnique({
      where: { userId_date: { userId: req.userId, date: today } },
    });

    if (existing) {
      return res.json({
        success: true,
        alreadyLogged: true,
        message: "Already logged today",
        newStreak: 0,
        totalStudyDays: 0,
      });
    }

    // Log today
    await prisma.studyDate.create({
      data: { userId: req.userId, date: today },
    });

    // Calculate streak
    const allDates = await prisma.studyDate.findMany({
      where: { userId: req.userId },
      orderBy: { date: "desc" },
    });

    const sorted = allDates.map((d) => d.date).sort().reverse();
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) streak++;
      else break;
    }

    res.json({
      success: true,
      alreadyLogged: false,
      message: `Day ${streak} streak!`,
      newStreak: streak,
      totalStudyDays: allDates.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to log study" });
  }
});

// GET /api/student/streak
router.get("/streak", async (req, res) => {
  try {
    const allDates = await prisma.studyDate.findMany({
      where: { userId: req.userId },
      orderBy: { date: "desc" },
    });

    const studyDates = allDates.map((d) => d.date);
    const today = new Date().toISOString().split("T")[0];
    const studiedToday = studyDates.includes(today);

    // Calculate current streak
    let currentStreak = 0;
    if (studyDates.length > 0) {
      const sorted = [...studyDates].sort().reverse();
      const todayDate = new Date(today);
      const lastDate = new Date(sorted[0]);
      const diffFromToday = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffFromToday <= 1) {
        currentStreak = 1;
        for (let i = 1; i < sorted.length; i++) {
          const prev = new Date(sorted[i - 1]);
          const curr = new Date(sorted[i]);
          const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) currentStreak++;
          else break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    if (studyDates.length > 0) {
      const sorted = [...studyDates].sort();
      let tempStreak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) tempStreak++;
        else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    res.json({
      currentStreak,
      longestStreak,
      totalStudyDays: studyDates.length,
      lastStudyDate: studyDates[0] || null,
      studiedToday,
      studyDates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch streak" });
  }
});

// GET /api/student/history
router.get("/history", async (req, res) => {
  try {
    const dates = await prisma.studyDate.findMany({
      where: { userId: req.userId },
      orderBy: { date: "desc" },
    });
    res.json(dates.map((d) => d.date));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

// GET /api/student/stats
router.get("/stats", async (req, res) => {
  try {
    const [studyDates, enrollments] = await Promise.all([
      prisma.studyDate.findMany({
        where: { userId: req.userId },
        orderBy: { date: "desc" },
      }),
      prisma.enrollment.findMany({
        where: { studentId: req.userId },
      }),
    ]);

    const dates = studyDates.map((d) => d.date);
    const today = new Date().toISOString().split("T")[0];
    const studiedToday = dates.includes(today);

    // Current streak
    let currentStreak = 0;
    if (dates.length > 0) {
      const sorted = [...dates].sort().reverse();
      const todayDate = new Date(today);
      const lastDate = new Date(sorted[0]);
      const diffFromToday = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffFromToday <= 1) {
        currentStreak = 1;
        for (let i = 1; i < sorted.length; i++) {
          const prev = new Date(sorted[i - 1]);
          const curr = new Date(sorted[i]);
          const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) currentStreak++;
          else break;
        }
      }
    }

    res.json({
      currentStreak,
      totalStudyDays: dates.length,
      coursesEnrolled: enrollments.length,
      lastStudyDate: dates[0] || null,
      studiedToday,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// GET /api/student/enrollments
router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.userId },
      include: {
        course: {
          include: { lessons: true, educator: true },
        },
        completedLessons: true,
      },
      orderBy: { enrolledAt: "desc" },
    });

    res.json(
      enrollments.map((e) => ({
        id: e.id,
        studentId: e.studentId,
        courseId: e.courseId,
        progress: e.progress,
        completedLessons: e.completedLessons.map((cl) => cl.lessonId),
        enrolledAt: e.enrolledAt.toISOString(),
        course: {
          id: e.course.id,
          title: e.course.title,
          description: e.course.description,
          category: e.course.category,
          thumbnailUrl: e.course.thumbnailUrl,
          educatorId: e.course.educatorId,
          educatorName: e.course.educator?.name || "",
          lessons: e.course.lessons,
          enrollmentCount: 0,
          createdAt: e.course.createdAt.toISOString(),
        },
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
});

module.exports = router;
