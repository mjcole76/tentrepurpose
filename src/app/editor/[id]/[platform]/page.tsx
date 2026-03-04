"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Download,
  Calendar,
  Check,
  RotateCcw,
  Type,
  Hash,
  AlignLeft,
  Edit3,
  Eye,
  Shuffle,
  Scissors,
  FileText,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PlatformIcon from "@/components/ui/PlatformIcon";
import CheckmarkAnimation from "@/components/ui/CheckmarkAnimation";
import ToneRewriter from "@/components/features/ToneRewriter";
import ClipPreview from "@/components/features/ClipPreview";
import { useContentStore } from "@/lib/store";
import { MOCK_LIBRARY } from "@/lib/mock-data";
import { Platform } from "@/lib/types";
import { getPlatformName } from "@/lib/utils";

/* ── AB Variations mock data ───────────────────────── */
const AB_VARIATIONS: Record<string, string[]> = {
  twitter: [
    `🧵 Most creators are sitting on a goldmine of content and don't know it.\n\nOne 10-min video = 15+ pieces.\n\nHere's the extraction framework I use every week: [thread]`,
    `Hot take: Creating more content won't grow your audience.\n\nDistributing smarter will.\n\n🧵 Here's why most creators plateau — and what actually moves the needle:`,
    `I went from 3 posts/week to daily content on 5 platforms.\n\nDid I work more?\n\nNope. I just stopped throwing away 80% of what I already made.\n\n🧵 The repurposing system:`,
  ],
  instagram: [
    `The #1 thing holding creators back isn't talent.\n\nIt's distribution.\n\nSwipe to see the framework →`,
    `You already have enough content.\n\nYou just haven't extracted it yet. 👀\n\nSlide 1/8 →`,
    `One YouTube video = one week of Instagram content.\n\nHere's how to break it down: →`,
  ],
  linkedin: [
    `I made a decision 18 months ago that changed my content career.\n\nI stopped trying to post more.\n\nHere's what I did instead:`,
    `Most creators work 80% creation, 20% distribution.\n\nThe top 1% flip that ratio.\n\nHere's the data from my own channels:`,
    `Controversial opinion: content quality matters less than content distribution.\n\nAt least in the early stages. Here's why:`,
  ],
};

function getVariations(platform: Platform, originalContent: string): string[] {
  const platform_key = platform as string;
  return AB_VARIATIONS[platform_key] || [
    originalContent.slice(0, 200) + "...",
    "Variation 2: " + originalContent.slice(100, 300) + "...",
    "Variation 3: " + originalContent.slice(50, 250) + "...",
  ];
}

/* ── Platform previews ────────────────────────────── */
function TwitterPreview({ content }: { content: string }) {
  const tweets = content.split(/\n\n/).filter((t) => t.trim());
  return (
    <div className="space-y-3">
      {tweets.slice(0, 4).map((tweet, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-gray-900">Your Name</span>
                <span className="text-sm text-gray-500">@yourhandle</span>
              </div>
              <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed text-gray-800">
                {tweet.trim()}
              </p>
            </div>
          </div>
        </div>
      ))}
      {tweets.length > 4 && (
        <p className="text-xs text-secondary text-center">
          +{tweets.length - 4} more tweets in thread
        </p>
      )}
    </div>
  );
}

function InstagramPreview({ content }: { content: string }) {
  const slides = content
    .split(/Slide \d+:/)
    .filter((s) => s.trim())
    .slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-2">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-center"
        >
          <p className="text-[10px] text-gray-500 mb-1">Slide {i + 1}</p>
          <p className="text-xs font-medium leading-snug line-clamp-4">{slide.trim().slice(0, 100)}</p>
        </div>
      ))}
    </div>
  );
}

function LinkedInPreview({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold">Your Name</p>
          <p className="text-xs text-gray-500">Creator · 1h</p>
        </div>
      </div>
      <div className="text-sm whitespace-pre-wrap leading-relaxed line-clamp-[12] text-gray-800">
        {content.slice(0, 500)}
      </div>
      {content.length > 500 && (
        <p className="text-sm text-blue-600 font-medium mt-1">...see more</p>
      )}
    </div>
  );
}

function NewsletterPreview({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
      <div className="border-b border-gray-100 pb-3 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Newsletter Preview</p>
      </div>
      <div className="space-y-1">
        {content
          .split("\n")
          .slice(0, 15)
          .map((line, i) => {
            if (line.startsWith("## "))
              return (
                <h3 key={i} className="text-base font-bold mt-4 mb-2 text-gray-900">
                  {line.replace("## ", "")}
                </h3>
              );
            if (line.startsWith("### "))
              return (
                <h4 key={i} className="text-sm font-semibold mt-3 mb-1 text-gray-900">
                  {line.replace("### ", "")}
                </h4>
              );
            if (line.startsWith("- "))
              return (
                <li key={i} className="text-sm text-gray-700 ml-4">
                  {line.replace("- ", "")}
                </li>
              );
            if (line.trim())
              return (
                <p key={i} className="text-sm text-gray-700 my-1 leading-relaxed">
                  {line}
                </p>
              );
            return <div key={i} className="h-2" />;
          })}
      </div>
    </div>
  );
}

function TikTokPreview({ content }: { content: string }) {
  return (
    <div className="bg-black rounded-2xl p-4 text-white max-w-[220px] mx-auto aspect-[9/16] flex flex-col justify-end relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      <div className="relative z-10">
        <p className="text-xs font-semibold mb-1">@yourhandle</p>
        <p className="text-[10px] leading-relaxed opacity-90 line-clamp-4">
          {content.split("\n").find((l) => l.startsWith("Caption:"))?.replace("Caption: ", "") ||
            content.slice(0, 150)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 bg-white/20 rounded-full" />
          <p className="text-[10px] opacity-70">Original Sound</p>
        </div>
      </div>
    </div>
  );
}

function PlatformPreviewRenderer({ platform, content }: { platform: Platform; content: string }) {
  switch (platform) {
    case "twitter": return <TwitterPreview content={content} />;
    case "instagram": return <InstagramPreview content={content} />;
    case "linkedin": return <LinkedInPreview content={content} />;
    case "newsletter": return <NewsletterPreview content={content} />;
    case "tiktok":
    case "shorts": return <TikTokPreview content={content} />;
    default: return null;
  }
}

/* ── Export helpers ─────────────────────────────────── */
function exportTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportSrt(content: string, start: string, end: string) {
  const lines = content
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("[") && !l.startsWith("Caption:"));
  const srt = lines
    .map((line, i) => `${i + 1}\n00:${start.replace(":", ":")},000 --> 00:${end.replace(":", ":")},000\n${line}\n`)
    .join("\n");
  exportTxt(srt, "captions.srt");
}

function exportMarkdown(content: string, title: string) {
  const md = `# ${title}\n\n${content}`;
  exportTxt(md, "newsletter.md");
}

/* ── Main page ──────────────────────────────────────── */
export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string; platform: string }>;
}) {
  const { id, platform: platformStr } = use(params);
  const platform = platformStr as Platform;
  const router = useRouter();
  const { sources, initializeMockData, updateAsset } = useContentStore();
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "variations">("edit");
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const source = sources.find((s) => s.id === id) || MOCK_LIBRARY[0];
  const asset = source?.assets.find((a) => a.platform === platform);
  const [editedContent, setEditedContent] = useState(asset?.content || "");
  const [originalContent] = useState(asset?.content || "");
  const [activeVariation, setActiveVariation] = useState<number | null>(null);

  useEffect(() => {
    if (asset?.content && !editedContent) setEditedContent(asset.content);
  }, [asset?.content, editedContent]);

  const variations = getVariations(platform, originalContent);
  const wordCount = editedContent.split(/\s+/).filter(Boolean).length;
  const charCount = editedContent.length;
  const hasChanges = editedContent !== originalContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (asset) {
      updateAsset(source.id, asset.id, {
        content: editedContent,
        status: "exported",
        exportedAt: new Date().toISOString(),
      });
    }
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleDownload = () => {
    const name = getPlatformName(platform).toLowerCase().replace(/[^a-z]/g, "-");
    if (platform === "newsletter") {
      exportMarkdown(editedContent, asset?.title || "Newsletter");
    } else if (platform === "tiktok" || platform === "shorts") {
      exportSrt(
        editedContent,
        asset?.timestamps?.start || "0:00",
        asset?.timestamps?.end || "1:00"
      );
    } else {
      exportTxt(editedContent, `${name}-content.txt`);
    }
  };

  if (!asset) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-secondary">Asset not found.</p>
      </div>
    );
  }

  const isClipPlatform = platform === "tiktok" || platform === "shorts";

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-secondary hover:text-foreground mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Results
            </button>
            <div className="flex items-center gap-3">
              <PlatformIcon platform={platform} size={20} withBackground />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{asset.title}</h1>
                <p className="text-sm text-secondary">
                  {getPlatformName(platform)} ·{" "}
                  {isClipPlatform && asset.timestamps
                    ? `${asset.timestamps.start}–${asset.timestamps.end}`
                    : `${wordCount} words`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {platform === "instagram" && (
              <Link href={`/carousel/${id}`}>
                <Button variant="secondary" size="sm">
                  <Scissors className="w-4 h-4" />
                  Carousel Builder
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload}>
              <FileText className="w-4 h-4" />
              {platform === "newsletter" ? "Download .md" : platform === "tiktok" || platform === "shorts" ? "Download .srt" : "Download .txt"}
            </Button>
            <Button size="sm" onClick={handleExport}>
              {exported ? (
                <><CheckmarkAnimation size={18} />Exported!</>
              ) : (
                <><Download className="w-4 h-4" />Export</>
              )}
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-border-light rounded-xl p-1 mb-6 w-fit">
          {(["edit", "preview", "variations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-foreground shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              {tab === "edit" && <Edit3 className="w-3.5 h-3.5" />}
              {tab === "preview" && <Eye className="w-3.5 h-3.5" />}
              {tab === "variations" && <Shuffle className="w-3.5 h-3.5" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "variations" && (
                <span className="text-xs bg-accent text-foreground px-1.5 py-0.5 rounded-full">
                  {variations.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── EDIT TAB ─────────────────────────────────── */}
          {activeTab === "edit" && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Text editor */}
              <div className="space-y-4">
                <Card padding="none" className="overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-hover">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">Editor</span>
                      {hasChanges && <Badge variant="accent" size="sm">Modified</Badge>}
                    </div>
                    <button
                      onClick={() => setEditedContent(originalContent)}
                      className="text-xs text-secondary hover:text-foreground flex items-center gap-1 disabled:opacity-40"
                      disabled={!hasChanges}
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full min-h-[380px] text-sm leading-relaxed bg-transparent border-none outline-none resize-none"
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-hover text-xs text-secondary">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Type className="w-3 h-3" />
                        {charCount} chars
                      </span>
                      <span className="flex items-center gap-1">
                        <AlignLeft className="w-3 h-3" />
                        {wordCount} words
                      </span>
                    </div>
                    {asset.metadata.hashtags && (
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {asset.metadata.hashtags.length} hashtags
                      </span>
                    )}
                  </div>
                </Card>

                {/* AI Tone Rewriter */}
                <ToneRewriter
                  content={editedContent}
                  platform={platform}
                  onRewrite={setEditedContent}
                />

                {/* Hashtags */}
                {asset.metadata.hashtags && (
                  <div>
                    <p className="text-xs font-medium text-secondary mb-2">Suggested Hashtags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {asset.metadata.hashtags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() =>
                            setEditedContent((c) => c + "\n" + tag)
                          }
                          className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right panel — clip preview or metadata */}
              <div className="space-y-4">
                {isClipPlatform ? (
                  <ClipPreview
                    title={asset.title}
                    clipStart={asset.timestamps?.start}
                    clipEnd={asset.timestamps?.end}
                    totalDuration="12:34"
                  />
                ) : (
                  <Card padding="none" className="overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-hover">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">
                          {getPlatformName(platform)} Preview
                        </span>
                      </div>
                      <Badge variant="default" size="sm">Live</Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-[380px]">
                      <PlatformPreviewRenderer platform={platform} content={editedContent} />
                    </div>
                  </Card>
                )}

                <Card padding="sm">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                    Asset Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {asset.metadata.suggestedTime && (
                      <div>
                        <p className="text-xs text-secondary">Best Time</p>
                        <p className="font-medium">{asset.metadata.suggestedTime}</p>
                      </div>
                    )}
                    {asset.timestamps && (
                      <div>
                        <p className="text-xs text-secondary">Timestamp</p>
                        <p className="font-medium">
                          {asset.timestamps.start}–{asset.timestamps.end}
                        </p>
                      </div>
                    )}
                    {asset.metadata.clipDuration && (
                      <div>
                        <p className="text-xs text-secondary">Duration</p>
                        <p className="font-medium">{asset.metadata.clipDuration}</p>
                      </div>
                    )}
                    {asset.metadata.slideCount && (
                      <div>
                        <p className="text-xs text-secondary">Slides</p>
                        <p className="font-medium">{asset.metadata.slideCount}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ── PREVIEW TAB ──────────────────────────────── */}
          {activeTab === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="max-w-2xl mx-auto"
            >
              <Card padding="none" className="overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-hover">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={platform} size={16} />
                    <span className="text-sm font-medium">
                      {getPlatformName(platform)} — Full Preview
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <PlatformPreviewRenderer platform={platform} content={editedContent} />
                </div>
              </Card>

              {isClipPlatform && (
                <div className="mt-6">
                  <ClipPreview
                    title={asset.title}
                    clipStart={asset.timestamps?.start}
                    clipEnd={asset.timestamps?.end}
                    totalDuration="12:34"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* ── VARIATIONS TAB ───────────────────────────── */}
          {activeTab === "variations" && (
            <motion.div
              key="variations"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <p className="text-sm text-secondary mb-4">
                3 alternate angles and hooks for this content. Click any to use it as your starting point.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variations.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card
                      className={`cursor-pointer h-full transition-all ${
                        activeVariation === i
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-primary/30"
                      }`}
                      onClick={() => {
                        setActiveVariation(i);
                        setEditedContent(v + "\n\n" + originalContent.split("\n\n").slice(1).join("\n\n"));
                        setActiveTab("edit");
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={i === 0 ? "primary" : i === 1 ? "success" : "default"}>
                          {i === 0 ? "Hook-first" : i === 1 ? "Bold claim" : "Story-led"}
                        </Badge>
                        {activeVariation === i && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-secondary whitespace-pre-wrap">
                        {v}
                      </p>
                      <div className="mt-4">
                        <Button variant="ghost" size="sm" className="w-full">
                          Use This Variation
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
