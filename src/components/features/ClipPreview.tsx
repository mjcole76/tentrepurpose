"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Scissors,
  Film,
} from "lucide-react";
import Button from "@/components/ui/Button";

/* ── Waveform bars ───────────────────────────────────── */
function Waveform({
  progress,
  clipStart,
  clipEnd,
  onSeek,
}: {
  progress: number;
  clipStart: number;
  clipEnd: number;
  onSeek: (pct: number) => void;
}) {
  const bars = Array.from({ length: 60 }, (_, i) => {
    // Generate pseudo-random waveform heights
    const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const h = 20 + Math.abs(((seed - Math.floor(seed)) * 100) % 60);
    return h;
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    onSeek(pct);
  };

  return (
    <div
      className="relative h-16 flex items-end gap-0.5 cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Clip region highlight */}
      <div
        className="absolute bottom-0 top-0 bg-primary/15 border-l-2 border-r-2 border-primary rounded"
        style={{
          left: `${clipStart * 100}%`,
          width: `${(clipEnd - clipStart) * 100}%`,
        }}
      />

      {bars.map((h, i) => {
        const barPct = i / bars.length;
        const isInClip = barPct >= clipStart && barPct <= clipEnd;
        const isPast = barPct <= progress;
        return (
          <div
            key={i}
            className={`flex-1 rounded-t-sm transition-colors ${
              isPast
                ? isInClip
                  ? "bg-primary"
                  : "bg-primary/50"
                : isInClip
                  ? "bg-primary/30"
                  : "bg-border"
            }`}
            style={{ height: `${h}%` }}
          />
        );
      })}

      {/* Playhead */}
      <div
        className="absolute bottom-0 top-0 w-0.5 bg-foreground"
        style={{ left: `${progress * 100}%` }}
      />
    </div>
  );
}

interface ClipPreviewProps {
  title: string;
  clipStart?: string; // "3:24"
  clipEnd?: string;   // "4:12"
  totalDuration?: string; // "12:34"
}

function parseTime(t: string): number {
  if (!t) return 0;
  const parts = t.split(":").map(Number);
  return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ClipPreview({
  title,
  clipStart = "3:24",
  clipEnd = "4:12",
  totalDuration = "12:34",
}: ClipPreviewProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSec = parseTime(totalDuration);
  const startSec = parseTime(clipStart);
  const endSec = parseTime(clipEnd);
  const startPct = totalSec ? startSec / totalSec : 0;
  const endPct = totalSec ? endSec / totalSec : 1;
  const currentSec = progress * totalSec;

  // Initialise playhead at clip start
  useEffect(() => {
    setProgress(startPct);
  }, [startPct]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= endPct) {
            setPlaying(false);
            return endPct;
          }
          return p + 1 / (totalSec * 10); // 10fps tick
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, endPct, totalSec]);

  const jumpToStart = () => {
    setPlaying(false);
    setProgress(startPct);
  };
  const jumpToEnd = () => {
    setPlaying(false);
    setProgress(endPct);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Fake thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/60">
            <Film className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs opacity-40">Video Preview</p>
          </div>
        </div>

        {/* Clip badge */}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Scissors className="w-3 h-3" />
          Clip: {clipStart} – {clipEnd}
        </div>

        {/* Big play */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="relative z-10 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full flex items-center justify-center transition-all"
        >
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.span key="pause" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <Pause className="w-6 h-6 text-white" />
              </motion.span>
            ) : (
              <motion.span key="play" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <Play className="w-6 h-6 text-white ml-0.5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Animated waveform indicator when playing */}
        {playing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar w-1 rounded-full bg-white/70"
                style={{ height: "100%" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4">
        <p className="text-sm font-medium mb-3 truncate">{title}</p>

        <Waveform
          progress={progress}
          clipStart={startPct}
          clipEnd={endPct}
          onSeek={(pct) => {
            setProgress(pct);
            setPlaying(false);
          }}
        />

        <div className="flex items-center justify-between mt-2 mb-3 text-xs text-secondary">
          <span>{formatTime(currentSec)}</span>
          <span className="text-primary font-medium">
            Clip: {clipStart} → {clipEnd}
          </span>
          <span>{totalDuration}</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={jumpToStart}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <SkipBack className="w-4 h-4 text-secondary" />
          </button>
          <Button
            size="sm"
            onClick={() => setPlaying((p) => !p)}
            className="px-6"
          >
            {playing ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {playing ? "Pause" : "Play Clip"}
          </Button>
          <button
            onClick={jumpToEnd}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <SkipForward className="w-4 h-4 text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}
