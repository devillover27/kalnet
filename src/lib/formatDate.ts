import { format, parseISO } from "date-fns";

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), "d MMMM yyyy");
}

export function formatDateShort(dateString: string): string {
  return format(parseISO(dateString), "MMM d");
}

export function formatRelativeDate(dateString: string): string {
  const date = parseISO(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return format(date, "MMM d, yyyy");
}
