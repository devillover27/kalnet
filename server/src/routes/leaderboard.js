const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// GET /api/leaderboard
router.get("/", async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "student" },
      include: {
        studyDates: { orderBy: { date: "desc" } },
      },
    });

    const today = new Date().toISOString().split("T")[0];

    const leaderboard = students.map((s) => {
      const dates = s.studyDates.map((d) => d.date);

      // Calculate current streak
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

      return {
        studentId: s.id,
        studentName: s.name,
        avatar: s.avatar,
        currentStreak,
        totalStudyDays: dates.length,
      };
    });

    // Sort by streak (desc), then by total days (desc)
    leaderboard.sort((a, b) => {
      if (b.currentStreak !== a.currentStreak) return b.currentStreak - a.currentStreak;
      return b.totalStudyDays - a.totalStudyDays;
    });

    // Add rank
    const ranked = leaderboard.map((entry, i) => ({
      rank: i + 1,
      ...entry,
    }));

    res.json(ranked.slice(0, 50)); // Top 50
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
