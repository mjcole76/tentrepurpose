"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Brain,
  Layers,
  Wand2,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { useContentStore } from "@/lib/store";
import { RepurposedAsset } from "@/lib/types";

const processingSteps = [
  {
    id: "transcribe",
    label: "Transcribing Content",
    description: "Converting audio/video to text using AI transcription",
    icon: Mic,
    duration: 2000,
  },
  {
    id: "analyze",
    label: "Analyzing Structure",
    description: "Identifying key moments, topics, and quotable segments",
    icon: Brain,
    duration: 2500,
  },
  {
    id: "segment",
    label: "Segmenting Topics",
    description: "Breaking content into thematic sections for repurposing",
    icon: Layers,
    duration: 2000,
  },
  {
    id: "generate",
    label: "Generating Assets",
    description: "Creating optimized content for each platform",
    icon: Wand2,
    duration: 3000,
  },
  {
    id: "optimize",
    label: "Optimizing & Polishing",
    description: "Fine-tuning tone, length, and formatting per platform",
    icon: Sparkles,
    duration: 1500,
  },
];

export default function ProcessingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { updateSource, getSourceById } = useContentStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [waitingForAI, setWaitingForAI] = useState(false);

  const apiResultRef = useRef<RepurposedAsset[] | null>(null);
  const apiDoneRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    // Fire real AI processing immediately
    const source = getSourceById(id);
    fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceId: id,
        url: source?.url,
        type: source?.type ?? "text",
        textContent: source?.textContent,
        title: source?.title,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!isCancelled && data.assets) {
          apiResultRef.current = data.assets;
        }
        apiDoneRef.current = true;
      })
      .catch((err) => {
        console.error("Process API error:", err);
        apiDoneRef.current = true;
      });

    const runSteps = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        if (isCancelled) return;
        setCurrentStep(i);
        setStepProgress(0);

        const step = processingSteps[i];
        const intervals = 20;
        const intervalDuration = step.duration / intervals;

        for (let j = 0; j <= intervals; j++) {
          if (isCancelled) return;
          await new Promise((r) => setTimeout(r, intervalDuration));
          setStepProgress(Math.round((j / intervals) * 100));
        }
      }

      if (isCancelled) return;

      // Animation done — wait for AI if still processing
      if (!apiDoneRef.current) {
        setWaitingForAI(true);
        while (!apiDoneRef.current) {
          if (isCancelled) return;
          await new Promise((r) => setTimeout(r, 300));
        }
        setWaitingForAI(false);
      }

      if (!isCancelled) {
        const { generateMockAssets } = await import("@/lib/mock-data");
        const assets = apiResultRef.current ?? generateMockAssets(id);
        updateSource(id, { status: "completed", assets });
        await new Promise((r) => setTimeout(r, 500));
        router.push(`/results/${id}`);
      }
    };

    runSteps();

    return () => {
      isCancelled = true;
    };
  }, [id, router, updateSource, getSourceById]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Analyzing your content
          </h1>
          <p className="text-secondary">
            Sit tight — we&apos;re turning your content into platform-ready
            assets.
          </p>
        </motion.div>

        <div className="space-y-3">
          {processingSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep && !waitingForAI;
            const isCompleted = i < currentStep || waitingForAI;
            const isPending = i > currentStep && !waitingForAI;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "bg-primary/5 border-primary/20"
                    : isCompleted
                      ? "bg-success/5 border-success/20"
                      : "bg-surface border-border"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive
                      ? "bg-primary/10"
                      : isCompleted
                        ? "bg-success/10"
                        : "bg-border-light"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Check className="w-5 h-5 text-success" />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div
                        key="loading"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Loader2 className="w-5 h-5 text-primary" />
                      </motion.div>
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${isPending ? "text-secondary/50" : "text-secondary"}`}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isPending ? "text-secondary/50" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      isPending ? "text-secondary/30" : "text-secondary"
                    }`}
                  >
                    {step.description}
                  </p>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3"
                    >
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stepProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {isCompleted && (
                  <span className="text-xs text-success font-medium flex-shrink-0">
                    Done
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {waitingForAI && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-center justify-center gap-2 text-sm text-secondary"
            >
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Finalizing AI-generated content…
            </motion.div>
          )}
        </AnimatePresence>

        {!waitingForAI && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-secondary mt-8"
          >
            Step {Math.min(currentStep + 1, processingSteps.length)} of{" "}
            {processingSteps.length}
          </motion.p>
        )}
      </div>
    </div>
  );
}
