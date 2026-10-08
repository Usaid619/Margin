import { format, formatDistanceToNowStrict, subDays } from 'date-fns';

export function daysAgo(days: number, hour = 21, minute = 12): string {
  const date = subDays(new Date(), days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function formatShort(iso: string): string {
  return format(new Date(iso), 'MMM d');
}

export function formatLong(iso: string): string {
  return format(new Date(iso), 'MMMM d, yyyy');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function dayKey(iso: string): string {
  return format(new Date(iso), 'yyyy-MM-dd');
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Still awake';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}