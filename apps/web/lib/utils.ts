import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/);
  const first = parts[0] ?? "";

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }

  const last = parts[parts.length - 1] ?? "";
  return (first[0] ?? "").concat(last[0] ?? "").toUpperCase();
}
