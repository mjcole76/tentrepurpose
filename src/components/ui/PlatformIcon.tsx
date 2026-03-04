"use client";

import {
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Mail,
} from "lucide-react";
import { Platform } from "@/lib/types";
import { getPlatformColor } from "@/lib/utils";

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  withBackground?: boolean;
  className?: string;
}

export default function PlatformIcon({
  platform,
  size = 20,
  withBackground = false,
  className,
}: PlatformIconProps) {
  const color = getPlatformColor(platform);

  const iconMap: Record<Platform, React.ReactNode> = {
    twitter: <Twitter size={size} />,
    instagram: <Instagram size={size} />,
    linkedin: <Linkedin size={size} />,
    tiktok: <Music2 size={size} />,
    shorts: <Youtube size={size} />,
    newsletter: <Mail size={size} />,
  };

  if (withBackground) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-lg ${className}`}
        style={{
          backgroundColor: `${color}15`,
          color: color,
          width: size + 16,
          height: size + 16,
        }}
      >
        {iconMap[platform]}
      </div>
    );
  }

  return (
    <span className={className} style={{ color }}>
      {iconMap[platform]}
    </span>
  );
}
