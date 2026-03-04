"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Youtube,
  FileText,
  Music,
  Video,
  Calendar,
  MoreHorizontal,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PlatformIcon from "@/components/ui/PlatformIcon";
import { useContentStore } from "@/lib/store";
import { ContentType, Platform } from "@/lib/types";
import { formatRelativeDate, truncateText } from "@/lib/utils";

const typeIcons: Record<ContentType, typeof Youtube> = {
  youtube: Youtube,
  blog: FileText,
  audio: Music,
  video: Video,
  text: FileText,
};

const typeColors: Record<ContentType, string> = {
  youtube: "#FF0000",
  blog: "#6366F1",
  audio: "#F59E0B",
  video: "#10B981",
  text: "#8B5CF6",
};

export default function LibraryPage() {
  const { sources, initializeMockData } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentType | "all">("all");

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const filteredSources = sources.filter((s) => {
    const matchesSearch = s.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalAssets = sources.reduce((sum, s) => sum + s.assets.length, 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Content Library
            </h1>
            <p className="text-secondary">
              {sources.length} sources &middot; {totalAssets} repurposed assets
            </p>
          </div>
          <Link href="/create">
            <Button>
              <span className="text-lg leading-none">+</span>
              Add Content
            </Button>
          </Link>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your content..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            {(
              [
                "all",
                "youtube",
                "blog",
                "audio",
                "video",
                "text",
              ] as const
            ).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  filterType === type
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-secondary border-border hover:border-primary/30"
                }`}
              >
                {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="space-y-4">
          {filteredSources.map((source, i) => {
            const TypeIcon = typeIcons[source.type];
            const typeColor = typeColors[source.type];
            const platforms = [
              ...new Set(source.assets.map((a) => a.platform)),
            ] as Platform[];

            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover padding="none" className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Type indicator */}
                    <div
                      className="sm:w-1.5 h-1.5 sm:h-auto flex-shrink-0"
                      style={{ backgroundColor: typeColor }}
                    />

                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div
                            className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${typeColor}15` }}
                          >
                            <TypeIcon
                              className="w-5 h-5"
                              style={{ color: typeColor }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/results/${source.id}`}
                              className="block"
                            >
                              <h3 className="font-semibold text-base hover:text-primary transition-colors truncate">
                                {source.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-secondary">
                              <span className="capitalize">{source.type}</span>
                              {source.duration && (
                                <>
                                  <span>&middot;</span>
                                  <span>{source.duration}</span>
                                </>
                              )}
                              <span>&middot;</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatRelativeDate(source.createdAt)}
                              </span>
                            </div>

                            {/* Platform badges */}
                            <div className="flex items-center gap-2 mt-3">
                              {platforms.map((p) => (
                                <Link
                                  key={p}
                                  href={`/editor/${source.id}/${p}`}
                                >
                                  <PlatformIcon
                                    platform={p}
                                    size={14}
                                    withBackground
                                    className="hover:scale-110 transition-transform"
                                  />
                                </Link>
                              ))}
                              <span className="text-xs text-secondary ml-1">
                                {source.assets.length} assets
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant={
                              source.status === "completed"
                                ? "success"
                                : source.status === "processing"
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {source.status === "completed"
                              ? "Completed"
                              : source.status === "processing"
                                ? "Processing"
                                : "Failed"}
                          </Badge>
                          <Link href={`/results/${source.id}`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {filteredSources.length === 0 && (
            <div className="text-center py-16">
              <p className="text-secondary mb-4">
                {searchQuery
                  ? "No content matches your search."
                  : "No content yet. Start by adding your first piece!"}
              </p>
              <Link href="/create">
                <Button>Add Your First Content</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
