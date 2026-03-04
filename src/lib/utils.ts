import { Platform } from "./types";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

export function getPlatformColor(platform: Platform): string {
  const colors: Record<Platform, string> = {
    twitter: "#1DA1F2",
    instagram: "#E4405F",
    tiktok: "#000000",
    shorts: "#FF0000",
    linkedin: "#0A66C2",
    newsletter: "#6366F1",
  };
  return colors[platform];
}

export function getPlatformName(platform: Platform): string {
  const names: Record<Platform, string> = {
    twitter: "Twitter/X",
    instagram: "Instagram",
    tiktok: "TikTok",
    shorts: "YouTube Shorts",
    linkedin: "LinkedIn",
    newsletter: "Newsletter",
  };
  return names[platform];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
