export type ContentType = "youtube" | "blog" | "audio" | "video" | "text";

export type Platform =
  | "twitter"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "newsletter"
  | "shorts";

export interface SourceContent {
  id: string;
  title: string;
  type: ContentType;
  url?: string;
  fileName?: string;
  textContent?: string;
  thumbnail?: string;
  duration?: string;
  createdAt: string;
  status: "processing" | "completed" | "failed";
  assets: RepurposedAsset[];
}

export interface RepurposedAsset {
  id: string;
  sourceId: string;
  platform: Platform;
  title: string;
  content: string;
  status: "generating" | "ready" | "exported" | "scheduled";
  timestamps?: { start: string; end: string };
  scheduledFor?: string;
  exportedAt?: string;
  metadata: AssetMetadata;
}

export interface AssetMetadata {
  characterCount?: number;
  wordCount?: number;
  slideCount?: number;
  clipDuration?: string;
  hashtags?: string[];
  suggestedTime?: string;
}

export interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "completed";
  progress?: number;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  maxLength?: number;
  description: string;
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: "twitter",
    color: "#1DA1F2",
    maxLength: 280,
    description: "Thread with key insights",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    color: "#E4405F",
    description: "Carousel slides",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "tiktok",
    color: "#000000",
    description: "Short-form clip with captions",
  },
  {
    id: "shorts",
    name: "YouTube Shorts",
    icon: "youtube",
    color: "#FF0000",
    description: "Vertical clip suggestion",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    color: "#0A66C2",
    maxLength: 3000,
    description: "Professional post",
  },
  {
    id: "newsletter",
    name: "Newsletter",
    icon: "mail",
    color: "#6366F1",
    description: "Email excerpt block",
  },
];
