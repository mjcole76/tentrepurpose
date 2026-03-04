"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, ChevronDown, ChevronUp, Loader2, Check, Zap } from "lucide-react";
import { Platform } from "@/lib/types";

const TONES = [
  { id: "casual",        label: "Casual",        emoji: "😊", desc: "Friendly & conversational" },
  { id: "professional",  label: "Professional",  emoji: "💼", desc: "Polished & authoritative" },
  { id: "witty",         label: "Witty",         emoji: "🎭", desc: "Clever with personality" },
  { id: "storytelling",  label: "Storytelling",  emoji: "📖", desc: "Narrative & emotional" },
  { id: "concise",       label: "Concise",       emoji: "⚡", desc: "Stripped to essentials" },
];

interface ToneRewriterProps {
  content: string;
  platform: Platform;
  onRewrite: (newContent: string) => void;
}

export default function ToneRewriter({ content, platform, onRewrite }: ToneRewriterProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTone, setActiveTone] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [lastModel, setLastModel] = useState<string | null>(null);

  const handleTone = async (toneId: string) => {
    setLoading(true);
    setActiveTone(toneId);
    setDone(null);
    setLastModel(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tone: toneId, platform }),
      });
      const data = await res.json();
      if (data.result) {
        onRewrite(data.result);
        setDone(toneId);
        setLastModel(data.model ?? null);
        setTimeout(() => setDone(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setActiveTone(null);
    }
  };

  // Derive a short readable label from the model slug
  const modelLabel = lastModel && lastModel !== "mock"
    ? lastModel.split("/").pop()?.replace(/-\d{4}-\d{2}-\d{2}$/, "") ?? lastModel
    : lastModel === "mock"
      ? "demo mode"
      : null;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-hover hover:bg-border-light transition-colors"
      >
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI Tone Rewriter</span>
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
            via OpenRouter
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-secondary" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-surface">
              <p className="text-xs text-secondary mb-3">
                Pick a tone and the AI will rewrite your content via OpenRouter
                while preserving the key ideas.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {TONES.map((tone) => {
                  const isLoading = loading && activeTone === tone.id;
                  const isDone = done === tone.id;
                  return (
                    <button
                      key={tone.id}
                      onClick={() => handleTone(tone.id)}
                      disabled={loading}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left disabled:opacity-50"
                    >
                      <span className="text-xl">{tone.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{tone.label}</p>
                        <p className="text-xs text-secondary">{tone.desc}</p>
                      </div>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : isDone ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Check className="w-4 h-4 text-success" />
                        </motion.div>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Model attribution */}
              <AnimatePresence>
                {modelLabel && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 mt-3 text-xs text-secondary"
                  >
                    <Zap className="w-3 h-3 text-primary" />
                    Generated by{" "}
                    <span className="font-medium text-foreground">
                      {modelLabel}
                    </span>{" "}
                    via OpenRouter
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
