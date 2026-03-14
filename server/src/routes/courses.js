const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { authMiddleware, educatorOnly } = require("../middleware/auth");

const prisma = new PrismaClient();

// GET /api/courses — Public: list all courses
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: { orderBy: { order: "asc" } },
        educator: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      courses.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        thumbnailUrl: c.thumbnailUrl,
        educatorId: c.educatorId,
        educatorName: c.educator?.name || "",
        lessons: c.lessons,
        enrollmentCount: c._count.enrollments,
        createdAt: c.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// GET /api/courses/:id — Public: get single course
router.get("/:id", async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        lessons: { orderBy: { order: "asc" } },
        educator: true,
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnailUrl: course.thumbnailUrl,
      educatorId: course.educatorId,
      educatorName: course.educator?.name || "",
      lessons: course.lessons,
      enrollmentCount: course._count.enrollments,
      createdAt: course.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

// POST /api/courses — Educator: create course
router.post("/", authMiddleware, educatorOnly, async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl, lessons } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        thumbnailUrl: thumbnailUrl || null,
        educatorId: req.userId,
        lessons: {
          create: (lessons || []).map((l, i) => ({
            title: l.title,
            videoUrl: l.videoUrl,
            order: l.order || i + 1,
            duration: l.duration || null,
          })),
        },
      },
      include: {
        lessons: { orderBy: { order: "asc" } },
        educator: true,
      },
    });

    res.json({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnailUrl: course.thumbnailUrl,
      educatorId: course.educatorId,
      educatorName: course.educator?.name || "",
      lessons: course.lessons,
      enrollmentCount: 0,
      createdAt: course.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create course" });
  }
});

// PUT /api/courses/:id — Educator: update course
router.put("/:id", authMiddleware, educatorOnly, async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl } = req.body;

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { title, description, category, thumbnailUrl },
      include: { lessons: true, educator: true },
    });

    res.json({
      id: course.id,
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnailUrl: course.thumbnailUrl,
      educatorId: course.educatorId,
      educatorName: course.educator?.name || "",
      lessons: course.lessons,
      enrollmentCount: 0,
      createdAt: course.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update course" });
  }
});

// DELETE /api/courses/:id — Educator: delete course
router.delete("/:id", authMiddleware, educatorOnly, async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

// POST /api/courses/:id/enroll — Student: enroll in course
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: req.userId, courseId: req.params.id },
      },
    });

    if (existing) {
      return res.status(409).json({ message: "Already enrolled" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.userId,
        courseId: req.params.id,
      },
      include: {
        course: { include: { lessons: true, educator: true } },
        completedLessons: true,
      },
    });

    res.json({
      id: enrollment.id,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: enrollment.enrolledAt.toISOString(),
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        category: enrollment.course.category,
        thumbnailUrl: enrollment.course.thumbnailUrl,
        educatorId: enrollment.course.educatorId,
        educatorName: enrollment.course.educator?.name || "",
        lessons: enrollment.course.lessons,
        enrollmentCount: 0,
        createdAt: enrollment.course.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to enroll" });
  }
});

// POST /api/courses/:id/lessons/:lid/complete — Student: mark lesson complete
router.post("/:id/lessons/:lid/complete", authMiddleware, async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId: req.userId, courseId: req.params.id },
      },
      include: { course: { include: { lessons: true } } },
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Mark lesson complete (upsert to be idempotent)
    await prisma.completedLesson.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: req.params.lid,
        },
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: req.params.lid,
      },
      update: {},
    });

    // Recalculate progress
    const completedCount = await prisma.completedLesson.count({
      where: { enrollmentId: enrollment.id },
    });
    const totalLessons = enrollment.course.lessons.length;
    const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress },
    });

    res.json({ message: "Lesson completed", progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete lesson" });
  }
});

module.exports = router;
