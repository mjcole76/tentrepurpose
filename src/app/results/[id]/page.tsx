"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Calendar,
  Copy,
  ExternalLink,
  Check,
  Eye,
  Edit3,
  Clock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import PlatformIcon from "@/components/ui/PlatformIcon";
import CheckmarkAnimation from "@/components/ui/CheckmarkAnimation";
import { useContentStore } from "@/lib/store";
import { MOCK_LIBRARY } from "@/lib/mock-data";
import { Platform, PLATFORMS, RepurposedAsset } from "@/lib/types";
import { getPlatformName, truncateText } from "@/lib/utils";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { sources, initializeMockData } = useContentStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportedId, setExportedId] = useState<string | null>(null);

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const source = sources.find((s) => s.id === id) || MOCK_LIBRARY[0];
  const assets = source?.assets || [];

  const filteredAssets =
    activeTab === "all"
      ? assets
      : assets.filter((a) => a.platform === activeTab);

  const tabs = [
    { id: "all", label: "All Platforms", count: assets.length },
    ...PLATFORMS.map((p) => ({
      id: p.id,
      label: p.name,
      count: assets.filter((a) => a.platform === p.id).length,
    })).filter((t) => t.count > 0),
  ];

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (asset: RepurposedAsset) => {
    await navigator.clipboard.writeText(asset.content);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = (asset: RepurposedAsset) => {
    const safeName = asset.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const ext = asset.platform === "newsletter" ? ".md" : ".txt";
    downloadFile(asset.content, `${safeName}${ext}`);
    setExportedId(asset.id);
    setTimeout(() => setExportedId(null), 3000);
  };

  const handleExportAll = () => {
    const combined = assets
      .map((asset) =>
        [
          "=".repeat(60),
          `${getPlatformName(asset.platform).toUpperCase()} — ${asset.title}`,
          "=".repeat(60),
          "",
          asset.content,
          "",
        ].join("\n")
      )
      .join("\n");
    const safeName = (source?.title ?? "content")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .slice(0, 40);
    downloadFile(combined, `${safeName}-all-platforms.txt`);
  };

  const getPreviewLines = (content: string, platform: Platform) => {
    const lines = content.split("\n").filter((l) => l.trim());
    if (platform === "twitter") return lines.slice(0, 3);
    if (platform === "instagram") return lines.slice(0, 4);
    return lines.slice(0, 5);
  };

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
              Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Your Repurposed Content
            </h1>
            <p className="text-secondary">
              {source?.title
                ? truncateText(source.title, 80)
                : "Generated assets ready for review"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={handleExportAll}>
              <Download className="w-4 h-4" />
              Export All
            </Button>
            <Link href="/schedule">
              <Button size="sm">
                <Calendar className="w-4 h-4" />
                Schedule All
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Assets Generated",
              value: assets.length,
              color: "text-primary",
            },
            {
              label: "Platforms Covered",
              value: new Set(assets.map((a) => a.platform)).size,
              color: "text-primary",
            },
            { label: "Ready to Export", value: assets.length, color: "text-success" },
            {
              label: "Est. Time Saved",
              value: "3.5 hrs",
              color: "text-warning",
            },
          ].map((stat) => (
            <Card key={stat.label} padding="sm" className="text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-secondary mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <Tabs tabs={tabs} activeTab="all" onChange={setActiveTab} />
        </div>

        {/* Masonry-style grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {filteredAssets.map((asset, i) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="break-inside-avoid"
            >
              <Card
                hover
                highlight={asset.status === "ready"}
                className="relative group"
              >
                {/* Platform header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <PlatformIcon
                      platform={asset.platform}
                      size={18}
                      withBackground
                    />
                    <div>
                      <h3 className="font-semibold text-sm">{asset.title}</h3>
                      <p className="text-xs text-secondary">
                        {getPlatformName(asset.platform)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      asset.status === "ready"
                        ? "success"
                        : asset.status === "exported"
                          ? "primary"
                          : "default"
                    }
                  >
                    {asset.status === "ready"
                      ? "Ready"
                      : asset.status === "exported"
                        ? "Exported"
                        : asset.status}
                  </Badge>
                </div>

                {/* Content preview */}
                <div className="bg-background rounded-lg p-4 mb-4 border border-border/50">
                  <div className="space-y-1">
                    {getPreviewLines(asset.content, asset.platform).map(
                      (line, j) => (
                        <p
                          key={j}
                          className="text-xs text-secondary leading-relaxed"
                        >
                          {truncateText(line, 120)}
                        </p>
                      )
                    )}
                    <p className="text-xs text-primary cursor-pointer mt-2">
                      Show more...
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {asset.metadata.wordCount && (
                    <span className="text-xs text-secondary bg-border-light px-2 py-0.5 rounded">
                      {asset.metadata.wordCount} words
                    </span>
                  )}
                  {asset.metadata.slideCount && (
                    <span className="text-xs text-secondary bg-border-light px-2 py-0.5 rounded">
                      {asset.metadata.slideCount} slides
                    </span>
                  )}
                  {asset.metadata.clipDuration && (
                    <span className="text-xs text-secondary bg-border-light px-2 py-0.5 rounded">
                      {asset.metadata.clipDuration}
                    </span>
                  )}
                  {asset.metadata.characterCount && (
                    <span className="text-xs text-secondary bg-border-light px-2 py-0.5 rounded">
                      {asset.metadata.characterCount} chars
                    </span>
                  )}
                  {asset.metadata.suggestedTime && (
                    <span className="text-xs text-secondary bg-border-light px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {asset.metadata.suggestedTime}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor/${source?.id || id}/${asset.platform}`}
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full">
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(asset)}
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport(asset)}
                  >
                    {exportedId === asset.id ? (
                      <CheckmarkAnimation size={20} />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
