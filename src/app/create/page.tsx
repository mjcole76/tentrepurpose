"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Upload,
  Youtube,
  FileText,
  Music,
  Video,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useContentStore, createNewSource } from "@/lib/store";
import OnboardingTour from "@/components/features/OnboardingTour";
import { ContentType } from "@/lib/types";

const contentTypes: {
  id: ContentType;
  label: string;
  icon: typeof Youtube;
  description: string;
}[] = [
  {
    id: "youtube",
    label: "YouTube Video",
    icon: Youtube,
    description: "Paste a YouTube URL",
  },
  {
    id: "blog",
    label: "Blog Post",
    icon: FileText,
    description: "Paste a blog or article URL",
  },
  {
    id: "video",
    label: "Video File",
    icon: Video,
    description: "Upload MP4, MOV, or WebM",
  },
  {
    id: "audio",
    label: "Audio File",
    icon: Music,
    description: "Upload MP3, WAV, or M4A",
  },
  {
    id: "text",
    label: "Text / Script",
    icon: FileText,
    description: "Paste or upload raw text",
  },
];

export default function CreatePage() {
  const router = useRouter();
  const { addSource } = useContentStore();
  const [selectedType, setSelectedType] = useState<ContentType>("youtube");
  const [url, setUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUrlType = selectedType === "youtube" || selectedType === "blog";
  const isFileType = selectedType === "video" || selectedType === "audio";
  const isTextType = selectedType === "text";

  const canSubmit =
    (isUrlType && url.trim().length > 0) ||
    (isFileType && uploadedFile !== null) ||
    (isTextType && textContent.trim().length > 0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const title =
      isUrlType
        ? `Content from ${url}`
        : isFileType
          ? uploadedFile?.name || "Uploaded file"
          : `Text content (${textContent.slice(0, 50)}...)`;

    const source = createNewSource(
      title,
      selectedType,
      isUrlType ? url : undefined,
      isFileType ? uploadedFile?.name : undefined
    );

    addSource(source);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 300));
    router.push(`/processing/${source.id}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4">
      <OnboardingTour />
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            What do you want to repurpose?
          </h1>
          <p className="text-secondary text-lg">
            Paste a link or upload your content. We&apos;ll handle the rest.
          </p>
        </motion.div>

        {/* Content type selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {contentTypes.map((type) => {
            const Icon = type.icon;
            const isActive = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type.id);
                  setUploadedFile(null);
                  setUrl("");
                  setTextContent("");
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface text-secondary border-border hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            );
          })}
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg" className="mb-6">
            <AnimatePresence mode="wait">
              {isUrlType && (
                <motion.div
                  key="url"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    {selectedType === "youtube"
                      ? "YouTube Video URL"
                      : "Blog Post URL"}
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={
                        selectedType === "youtube"
                          ? "https://youtube.com/watch?v=..."
                          : "https://example.com/blog/your-post"
                      }
                      className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-secondary/50"
                    />
                    {url && (
                      <button
                        onClick={() => setUrl("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {selectedType === "youtube" && url && (
                    <p className="text-xs text-secondary mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      We&apos;ll extract audio, transcript, and key moments
                    </p>
                  )}
                </motion.div>
              )}

              {isFileType && (
                <motion.div
                  key="file"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    Upload{" "}
                    {selectedType === "video" ? "Video" : "Audio"} File
                  </label>

                  {uploadedFile ? (
                    <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {selectedType === "video" ? (
                          <Video className="w-5 h-5 text-primary" />
                        ) : (
                          <Music className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-secondary">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-secondary hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                        dragActive
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="file"
                        accept={
                          selectedType === "video"
                            ? "video/*"
                            : "audio/*"
                        }
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-secondary mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">
                        Drop your file here or{" "}
                        <span className="text-primary">browse</span>
                      </p>
                      <p className="text-xs text-secondary">
                        {selectedType === "video"
                          ? "MP4, MOV, or WebM up to 500MB"
                          : "MP3, WAV, or M4A up to 200MB"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {isTextType && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="block text-sm font-medium mb-2">
                    Paste Your Content
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your blog post, script, newsletter, or any written content here..."
                    rows={10}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none placeholder:text-secondary/50"
                  />
                  {textContent && (
                    <p className="text-xs text-secondary mt-2">
                      {textContent.split(/\s+/).filter(Boolean).length} words
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!canSubmit}
              loading={isSubmitting}
              className="text-base px-10"
            >
              Repurpose This Content
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-center text-xs text-secondary mt-4">
            Processing typically takes 30-60 seconds depending on content length
          </p>
        </motion.div>
      </div>
    </div>
  );
}
