import { format } from "date-fns";

export function formatPostDate(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), "MMM d");
}

export function getYear(iso: string): number {
  return new Date(iso).getFullYear();
}
