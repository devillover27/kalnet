import { useStudyHistory } from "@/hooks/useStudyHistory";
import { formatDate } from "@/lib/formatDate";
import { Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function StudyHistoryPage() {
  const { data: dates, isLoading } = useStudyHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const sortedDates = [...(dates || [])].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Study History</h1>
        <p className="text-sm text-gray-500 mt-1">Your complete learning timeline — {sortedDates.length} sessions logged</p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No study history yet</h3>
          <p className="text-sm text-gray-400">Start logging your daily study sessions to build your streak!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {sortedDates.map((date, i) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{formatDate(date)}</p>
                <p className="text-xs text-gray-400 mt-0.5">Study session logged</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
