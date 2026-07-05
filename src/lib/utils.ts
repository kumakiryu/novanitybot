import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToInt(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

export function intToHex(n: number): string {
  return "#" + n.toString(16).padStart(6, "0").toUpperCase();
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
