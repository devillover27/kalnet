import { differenceInCalendarDays, parseISO, format } from "date-fns";

export function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0;

  const sorted = [...dates]
    .map((d) => parseISO(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  const diffFromToday = differenceInCalendarDays(today, sorted[0]);

  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(sorted[i - 1], sorted[i]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getMotivationMessage(streak: number): string {
  if (streak === 0)   return "Start your learning journey today! 🚀";
  if (streak === 1)   return "Great start! Keep the momentum going! 💪";
  if (streak <= 4)    return "You're building a habit! Keep it up! 🌱";
  if (streak <= 9)    return "You're on fire! Don't break the streak! 🔥";
  if (streak <= 20)   return "Incredible consistency! You're a learning machine! ⚡";
  if (streak <= 29)   return "3-week warrior! Almost a full month! 🏆";
  return               "Legendary learner! You're unstoppable! 👑";
}

export function wasStudied(date: Date, studyDates: string[]): boolean {
  const formatted = format(date, "yyyy-MM-dd");
  return studyDates.includes(formatted);
}
