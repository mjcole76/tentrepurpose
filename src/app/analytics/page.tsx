"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  BarChart2,
  Zap,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PlatformIcon from "@/components/ui/PlatformIcon";
import { useContentStore } from "@/lib/store";
import { Platform } from "@/lib/types";
import { getPlatformName } from "@/lib/utils";

/* ── Mini bar chart ──────────────────────────────────── */
function BarChart({
  data,
  color = "#6366F1",
  height = 80,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div
      className="flex items-end gap-1"
      style={{ height }}
    >
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.85, transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}

/* ── Sparkline ───────────────────────────────────────── */
function Sparkline({
  data,
  color = "#6366F1",
  width = 80,
  height = 32,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Donut chart ─────────────────────────────────────── */
function DonutChart({
  segments,
}: {
  segments: { value: number; color: string; label: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  const r = 40;
  const circ = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const rot = (offset / total) * 360 - 90;
          offset += seg.value;
          return (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="butt"
              transform={`rotate(${rot} 50 50)`}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${dash} ${gap}` }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            />
          );
        })}
        <circle cx="50" cy="50" r="28" fill="var(--color-surface)" />
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-secondary">{seg.label}</span>
            <span className="font-medium ml-auto pl-4">
              {Math.round((seg.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Mock data ───────────────────────────────────────── */
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const platformStats: {
  platform: Platform;
  impressions: number;
  engagements: number;
  trend: number;
  color: string;
  weekData: number[];
}[] = [
  {
    platform: "twitter",
    impressions: 24300,
    engagements: 1820,
    trend: 12.4,
    color: "#1DA1F2",
    weekData: [1200, 1800, 1400, 2100, 3200, 2800, 3100],
  },
  {
    platform: "instagram",
    impressions: 18700,
    engagements: 3240,
    trend: 8.1,
    color: "#E4405F",
    weekData: [800, 900, 1200, 1600, 2400, 3200, 2900],
  },
  {
    platform: "linkedin",
    impressions: 9800,
    engagements: 640,
    trend: 22.7,
    color: "#0A66C2",
    weekData: [400, 600, 800, 1200, 1800, 1600, 1400],
  },
  {
    platform: "tiktok",
    impressions: 51200,
    engagements: 7400,
    trend: -3.2,
    color: "#000000",
    weekData: [3000, 6000, 8000, 7000, 9000, 11000, 6200],
  },
  {
    platform: "shorts",
    impressions: 31400,
    engagements: 2100,
    trend: 5.8,
    color: "#FF0000",
    weekData: [2000, 3000, 4000, 5000, 4500, 6000, 5400],
  },
  {
    platform: "newsletter",
    impressions: 4200,
    engagements: 890,
    trend: 15.3,
    color: "#6366F1",
    weekData: [300, 400, 500, 600, 700, 800, 900],
  },
];

const topContent = [
  {
    title: "The Future of Content Creation",
    platform: "twitter" as Platform,
    impressions: 12400,
    engagement: "7.2%",
    trend: 18,
  },
  {
    title: "Building a Personal Brand in 2026",
    platform: "instagram" as Platform,
    impressions: 9800,
    engagement: "11.4%",
    trend: 24,
  },
  {
    title: "Creator Economy Podcast EP47",
    platform: "tiktok" as Platform,
    impressions: 28000,
    engagement: "14.1%",
    trend: -2,
  },
  {
    title: "100K Follower Strategy",
    platform: "linkedin" as Platform,
    impressions: 6200,
    engagement: "5.8%",
    trend: 31,
  },
];

const totalImpressionsWeek = [18000, 22000, 27000, 31000, 42000, 48000, 39000];

export default function AnalyticsPage() {
  const { initializeMockData } = useContentStore();

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const totalImpressions = platformStats.reduce((s, p) => s + p.impressions, 0);
  const totalEngagements = platformStats.reduce((s, p) => s + p.engagements, 0);
  const avgEngRate = ((totalEngagements / totalImpressions) * 100).toFixed(1);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Analytics</h1>
            <p className="text-secondary">
              Last 7 days &middot; All platforms
            </p>
          </div>
          <select className="px-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Impressions",
              value: totalImpressions.toLocaleString(),
              sub: "+18% vs last week",
              up: true,
              icon: Eye,
            },
            {
              label: "Total Engagements",
              value: totalEngagements.toLocaleString(),
              sub: "+12% vs last week",
              up: true,
              icon: Heart,
            },
            {
              label: "Avg Engagement Rate",
              value: `${avgEngRate}%`,
              sub: "+1.2pp vs last week",
              up: true,
              icon: Zap,
            },
            {
              label: "Assets Published",
              value: "24",
              sub: "Across 6 platforms",
              up: true,
              icon: Share2,
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span
                      className={`text-xs font-medium flex items-center gap-0.5 ${kpi.up ? "text-success" : "text-error"}`}
                    >
                      {kpi.up ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-secondary mt-1">{kpi.label}</p>
                  <p
                    className={`text-xs mt-1 ${kpi.up ? "text-success" : "text-error"}`}
                  >
                    {kpi.sub}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Weekly impressions chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Weekly Impressions</h3>
                <Badge variant="primary">All Platforms</Badge>
              </div>
              <BarChart
                data={totalImpressionsWeek}
                color="#6366F1"
                height={140}
              />
              <div className="flex justify-between mt-2">
                {WEEK_LABELS.map((d) => (
                  <span key={d} className="text-xs text-secondary flex-1 text-center">
                    {d}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Distribution donut */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="h-full">
              <h3 className="font-semibold mb-6">Impressions by Platform</h3>
              <DonutChart
                segments={platformStats.map((p) => ({
                  value: p.impressions,
                  color: p.color,
                  label: getPlatformName(p.platform).split("/")[0],
                }))}
              />
            </Card>
          </motion.div>
        </div>

        {/* Per-platform rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {platformStats.map((p, i) => (
            <motion.div
              key={p.platform}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
            >
              <Card hover>
                <div className="flex items-center justify-between mb-4">
                  <PlatformIcon platform={p.platform} size={16} withBackground />
                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${p.trend > 0 ? "text-success" : "text-error"}`}
                  >
                    {p.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(p.trend)}%
                  </span>
                </div>
                <p className="text-xl font-bold">
                  {p.impressions.toLocaleString()}
                </p>
                <p className="text-xs text-secondary mt-0.5">impressions</p>
                <p className="text-sm mt-1">
                  {p.engagements.toLocaleString()}{" "}
                  <span className="text-secondary text-xs">engagements</span>
                </p>
                <div className="mt-3">
                  <Sparkline data={p.weekData} color={p.color} width={120} height={28} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Top performing content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <h3 className="font-semibold mb-4">Top Performing Content</h3>
            <div className="space-y-3">
              {topContent.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-hover transition-colors"
                >
                  <span className="text-sm font-bold text-secondary w-5">
                    {i + 1}
                  </span>
                  <PlatformIcon platform={item.platform} size={16} withBackground />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-secondary">
                      {getPlatformName(item.platform)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold">
                      {item.impressions.toLocaleString()}
                    </p>
                    <p className="text-xs text-secondary">
                      {item.engagement} eng.
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium w-10 text-right ${item.trend > 0 ? "text-success" : "text-error"}`}
                  >
                    {item.trend > 0 ? "+" : ""}
                    {item.trend}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
