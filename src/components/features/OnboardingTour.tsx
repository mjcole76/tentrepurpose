"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  X,
  Upload,
  Zap,
  LayoutGrid,
  Edit3,
  Calendar,
} from "lucide-react";
import Button from "@/components/ui/Button";

const STEPS = [
  {
    icon: Upload,
    title: "Paste or upload anything",
    body: "Drop a YouTube URL, blog link, or upload a video/audio/text file. We support every format.",
    highlight: "Step 1 of 5",
  },
  {
    icon: Zap,
    title: "AI does the heavy lifting",
    body: "Claude AI transcribes your content, identifies key moments, quotable lines, and topic segments automatically.",
    highlight: "Powered by Claude",
  },
  {
    icon: LayoutGrid,
    title: "Get assets for every platform",
    body: "Twitter threads, Instagram carousels, TikTok clips, LinkedIn posts, YouTube Shorts, and newsletter blocks — all generated instantly.",
    highlight: "6 platforms",
  },
  {
    icon: Edit3,
    title: "Edit inline — no switching apps",
    body: "Click any asset to open the editor. Rewrite with AI tone presets, preview how it looks on the platform, then copy or export.",
    highlight: "AI Tone Rewriter",
  },
  {
    icon: Calendar,
    title: "Schedule across everything",
    body: "Connect your accounts and schedule directly from the calendar. Your whole week planned in minutes.",
    highlight: "Direct publishing",
  },
];

const STORAGE_KEY = "repurpose-onboarding-done";

export default function OnboardingTour() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress bar */}
              <div className="h-1 bg-border">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {current.highlight}
                  </span>
                  <button
                    onClick={dismiss}
                    className="text-secondary hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold mb-3">{current.title}</h2>
                    <p className="text-secondary leading-relaxed">{current.body}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between mt-8">
                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStep(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === step
                            ? "w-6 h-2 bg-primary"
                            : "w-2 h-2 bg-border hover:bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  <Button onClick={next} size="sm">
                    {step < STEPS.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
