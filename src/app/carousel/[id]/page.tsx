"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripHorizontal,
  Download,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  ChevronLeft,
  ChevronRight,
  Palette,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useContentStore } from "@/lib/store";
import { MOCK_LIBRARY } from "@/lib/mock-data";

interface Slide {
  id: string;
  headline: string;
  body: string;
  bg: string;
  textAlign: "left" | "center" | "right";
}

const BG_PRESETS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "linear-gradient(135deg,#2d3561,#c05c7e)",
  "#1F2937",
  "#FAF9F6",
];

/* ── Sortable slide thumbnail ───────────────────────── */
function SlideThumbnail({
  slide,
  index,
  isActive,
  onSelect,
  onDelete,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-shrink-0 w-24 cursor-pointer group relative ${
        isActive ? "ring-2 ring-primary" : "ring-1 ring-border"
      } rounded-lg overflow-hidden`}
      onClick={onSelect}
    >
      <div
        className="aspect-square flex flex-col items-center justify-center p-2"
        style={{ background: slide.bg }}
      >
        <p
          className="text-[7px] font-bold leading-tight text-center line-clamp-3"
          style={{
            color:
              slide.bg === "#FAF9F6" ? "#1F2937" : "rgba(255,255,255,0.9)",
          }}
        >
          {slide.headline || "Slide " + (index + 1)}
        </p>
      </div>
      <div className="absolute top-1 left-1 text-[9px] bg-black/40 text-white px-1 rounded">
        {index + 1}
      </div>
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-black/40 p-0.5 rounded"
      >
        <GripHorizontal className="w-2.5 h-2.5 text-white" />
      </button>
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-black/50 p-0.5 rounded"
        >
          <Trash2 className="w-2.5 h-2.5 text-white" />
        </button>
      )}
    </div>
  );
}

function parseCarouselContent(content: string): Slide[] {
  const parts = content.split(/Slide \d+:/).filter((p) => p.trim());

  if (parts.length > 0) {
    return parts.slice(0, 8).map((text, i) => {
      const lines = text.trim().split("\n").filter(Boolean);
      return {
        id: `slide-${i}`,
        headline: lines[0] || `Slide ${i + 1}`,
        body: lines.slice(1).join("\n"),
        bg: BG_PRESETS[i % BG_PRESETS.length],
        textAlign: "center" as const,
      };
    });
  }

  return [
    {
      id: "slide-0",
      headline: "Your Title Here",
      body: "Add your content",
      bg: BG_PRESETS[0],
      textAlign: "center",
    },
  ];
}

export default function CarouselBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { sources, initializeMockData } = useContentStore();

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  const source = sources.find((s) => s.id === id) || MOCK_LIBRARY[0];
  const instagramAsset = source?.assets.find((a) => a.platform === "instagram");
  const initialContent = instagramAsset?.content || "";

  const [slides, setSlides] = useState<Slide[]>(() =>
    parseCarouselContent(initialContent)
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeSlide = slides[activeIdx] || slides[0];

  const updateSlide = (field: keyof Slide, value: string) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === activeIdx ? { ...s, [field]: value } : s))
    );
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      headline: "New Slide",
      body: "",
      bg: BG_PRESETS[slides.length % BG_PRESETS.length],
      textAlign: "center",
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveIdx(slides.length);
  };

  const deleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx(Math.min(activeIdx, slides.length - 2));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSlides((prev) => {
        const oldIdx = prev.findIndex((s) => s.id === active.id);
        const newIdx = prev.findIndex((s) => s.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  const handleExport = () => {
    const text = slides
      .map(
        (s, i) =>
          `Slide ${i + 1}: ${s.headline}\n${s.body}`
      )
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carousel.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-xl font-bold">Carousel Builder</h1>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
              Instagram
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={addSlide}>
              <Plus className="w-4 h-4" />
              Add Slide
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-secondary">
                Preview — Slide {activeIdx + 1} / {slides.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveIdx((i) => Math.min(slides.length - 1, i + 1))
                  }
                  disabled={activeIdx === slides.length - 1}
                  className="p-1.5 rounded-lg hover:bg-surface-hover disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide preview */}
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="aspect-square rounded-2xl overflow-hidden relative shadow-lg"
              style={{ background: activeSlide?.bg }}
            >
              <div
                className={`absolute inset-0 flex flex-col justify-center p-10 text-${activeSlide?.textAlign}`}
              >
                <motion.h2
                  key={activeSlide?.headline}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mb-4 leading-tight"
                  style={{
                    color:
                      activeSlide?.bg === "#FAF9F6"
                        ? "#1F2937"
                        : "rgba(255,255,255,0.95)",
                  }}
                >
                  {activeSlide?.headline || "Your Headline"}
                </motion.h2>
                {activeSlide?.body && (
                  <motion.p
                    key={activeSlide.body}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-base leading-relaxed whitespace-pre-wrap"
                    style={{
                      color:
                        activeSlide.bg === "#FAF9F6"
                          ? "#4B5563"
                          : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {activeSlide.body}
                  </motion.p>
                )}
              </div>

              {/* Slide number dot */}
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xs font-bold text-white">
                {activeIdx + 1}
              </div>
            </motion.div>

            {/* Slide strip */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((s) => s.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {slides.map((slide, i) => (
                    <SlideThumbnail
                      key={slide.id}
                      slide={slide}
                      index={i}
                      isActive={i === activeIdx}
                      onSelect={() => setActiveIdx(i)}
                      onDelete={() => deleteSlide(i)}
                    />
                  ))}
                  <button
                    onClick={addSlide}
                    className="flex-shrink-0 w-24 aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary/50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-secondary" />
                  </button>
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Editor panel */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-secondary">
              Edit Slide {activeIdx + 1}
            </p>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Headline
              </label>
              <input
                type="text"
                value={activeSlide?.headline || ""}
                onChange={(e) => updateSlide("headline", e.target.value)}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Slide headline..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Body Text
              </label>
              <textarea
                value={activeSlide?.body || ""}
                onChange={(e) => updateSlide("body", e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="Slide body text..."
              />
            </div>

            {/* Text alignment */}
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">
                Text Alignment
              </label>
              <div className="flex gap-2">
                {(["left", "center", "right"] as const).map((align) => {
                  const Icon =
                    align === "left"
                      ? AlignLeft
                      : align === "center"
                        ? AlignCenter
                        : AlignRight;
                  return (
                    <button
                      key={align}
                      onClick={() => updateSlide("textAlign", align)}
                      className={`p-2.5 rounded-lg border transition-all ${
                        activeSlide?.textAlign === align
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-secondary hover:border-primary/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background picker */}
            <div>
              <button
                onClick={() => setShowBgPicker((v) => !v)}
                className="flex items-center gap-2 text-xs font-medium text-secondary hover:text-foreground transition-colors"
              >
                <Palette className="w-3.5 h-3.5" />
                Background Style
              </button>
              {showBgPicker && (
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {BG_PRESETS.map((bg, i) => (
                    <button
                      key={i}
                      onClick={() => updateSlide("bg", bg)}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        activeSlide?.bg === bg
                          ? "border-primary scale-105"
                          : "border-transparent hover:border-primary/30"
                      }`}
                      style={{ background: bg }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Slide list */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-medium text-secondary mb-2">
                All Slides ({slides.length})
              </p>
              <div className="space-y-1">
                {slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    onClick={() => setActiveIdx(i)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      i === activeIdx
                        ? "bg-primary/5 text-primary"
                        : "hover:bg-surface-hover"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded flex-shrink-0"
                      style={{ background: slide.bg }}
                    />
                    <span className="text-sm truncate">
                      {slide.headline || `Slide ${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
