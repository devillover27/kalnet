import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuthStore } from "@/store/authStore";
import { Trophy, Loader2, Flame, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { data: entries, isLoading } = useLeaderboard();
  const { user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const getRankBg = (rank: number) => {
    if (rank === 1) return "linear-gradient(135deg, #fef3c7, #fde68a)";
    if (rank === 2) return "linear-gradient(135deg, #f1f5f9, #e2e8f0)";
    if (rank === 3) return "linear-gradient(135deg, #ffedd5, #fed7aa)";
    return "#ffffff";
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return "#fbbf24";
    if (rank === 2) return "#94a3b8";
    if (rank === 3) return "#fb923c";
    return "#f1f5f9";
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-1">Top learners ranked by study streaks</p>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-yellow-50 flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Leaderboard is empty</h3>
          <p className="text-sm text-gray-400">Start studying daily to claim the top spot!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => {
            const isCurrentUser = entry.studentId === user?.id;
            return (
              <motion.div
                key={entry.studentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all"
                style={{
                  background: getRankBg(entry.rank),
                  border: `2px solid ${getRankBorder(entry.rank)}`,
                  boxShadow: isCurrentUser ? "0 0 0 3px rgba(99, 102, 241, 0.2)" : undefined,
                }}
              >
                <div className="text-2xl font-extrabold min-w-[44px] text-center">
                  {getRankEmoji(entry.rank)}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  {entry.studentName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {entry.studentName}
                    {isCurrentUser && <span className="text-indigo-500 ml-1.5">(You)</span>}
                  </p>
                </div>
                <div className="flex items-center gap-5 text-sm shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-gray-800">{entry.currentStreak}</span>
                    <span className="text-gray-400 text-xs hidden sm:inline">streak</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-gray-800">{entry.totalStudyDays}</span>
                    <span className="text-gray-400 text-xs hidden sm:inline">days</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
