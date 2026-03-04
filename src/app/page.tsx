"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Music2,
  Play,
  Upload,
  Zap,
  LayoutGrid,
  CheckCircle2,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const platforms = [
  { icon: Twitter, name: "Twitter/X", color: "#1DA1F2", output: "Thread" },
  { icon: Instagram, name: "Instagram", color: "#E4405F", output: "Carousel" },
  { icon: Music2, name: "TikTok", color: "#000", output: "Clip" },
  { icon: Youtube, name: "YouTube Shorts", color: "#FF0000", output: "Short" },
  { icon: Linkedin, name: "LinkedIn", color: "#0A66C2", output: "Post" },
  { icon: Mail, name: "Newsletter", color: "#6366F1", output: "Excerpt" },
];

const steps = [
  {
    icon: Upload,
    title: "Paste or Upload",
    description:
      "Drop in a YouTube URL, blog post link, or upload a video/audio file. We handle any format.",
  },
  {
    icon: Zap,
    title: "AI Analyzes",
    description:
      "Our AI transcribes, identifies key moments, quotable lines, and segments your content by topic.",
  },
  {
    icon: LayoutGrid,
    title: "Get Every Format",
    description:
      "Receive optimized assets for every platform — threads, carousels, clips, posts, and newsletters.",
  },
  {
    icon: CheckCircle2,
    title: "Edit & Export",
    description:
      "Preview how each piece looks on its platform, edit inline, then export or schedule directly.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    role: "YouTuber, 240K subs",
    avatar: "SC",
    text: "I used to spend 3 hours repurposing each video. Now it takes 10 minutes. My Instagram grew 4x in two months because I'm actually posting consistently.",
  },
  {
    name: "Marcus Johnson",
    handle: "@marcusj",
    role: "Podcast Host",
    avatar: "MJ",
    text: "The thread generator alone is worth it. It pulls out insights I didn't even realize were in my episodes. My Twitter engagement tripled.",
  },
  {
    name: "Priya Patel",
    handle: "@priyawrites",
    role: "Newsletter Writer",
    avatar: "PP",
    text: "I write one long blog post and Repurpose turns it into a week's worth of social content. It's like having a content team without the overhead.",
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-20 pb-28 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-[0.04]" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-accent/50 text-sm font-medium px-4 py-1.5 rounded-full text-foreground mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              Stop creating more. Start distributing smarter.
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            One input.
            <br />
            <span className="text-primary">Every platform.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Paste a YouTube URL or upload any content. Get optimized posts for
            Twitter, Instagram, TikTok, LinkedIn, newsletters, and more — in
            seconds, not hours.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/create">
              <Button size="lg" className="text-base px-8">
                Start Repurposing Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg" className="text-base">
                <Play className="w-4 h-4" />
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Platform output visualization */}
          <motion.div
            variants={fadeUp}
            className="mt-16 relative"
          >
            <div className="bg-surface rounded-2xl border border-border shadow-xl p-8 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">
                    The Future of Content Creation
                  </p>
                  <p className="text-xs text-secondary">
                    youtube.com/watch?v=... &middot; 12:34
                  </p>
                </div>
                <span className="ml-auto bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-full">
                  Processed
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {platforms.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                      className="flex items-center gap-3 bg-background rounded-xl p-3 border border-border/50"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${p.color}15` }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: p.color }}
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-medium truncate">
                          {p.output}
                        </p>
                        <p className="text-[11px] text-secondary">Ready</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              How it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-secondary text-lg max-w-2xl mx-auto"
            >
              Four steps from raw content to a full week of platform-optimized
              posts.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} variants={fadeUp}>
                  <Card className="relative h-full" padding="lg">
                    <div className="absolute -top-3 -left-1 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Platform outputs */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Optimized for every platform
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-secondary text-lg max-w-2xl mx-auto"
            >
              Each output is tailored to the platform's format, tone, and
              audience expectations. Not copy-paste — true adaptation.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              {
                icon: Twitter,
                name: "Twitter/X Threads",
                color: "#1DA1F2",
                desc: "Punchy threads with hooks, numbered insights, and engagement-driving CTAs. Optimized for virality.",
                preview:
                  "🧵 Thread: The future of content creation...\n\n1/ The biggest mistake creators make...\n2/ Think about it: every 60-second segment...",
              },
              {
                icon: Instagram,
                name: "Instagram Carousels",
                color: "#E4405F",
                desc: "Slide-by-slide content with clear headlines, visual hierarchy, and a save-worthy final slide.",
                preview:
                  'Slide 1: "One Video, Infinite Content"\nSlide 2: The Problem...\nSlide 3: The Solution...',
              },
              {
                icon: Music2,
                name: "TikTok / Reels Clips",
                color: "#000000",
                desc: "Timestamped clip suggestions with hooks, captions, and trending hashtags. Ready to cut and post.",
                preview:
                  '[CLIP] 3:24 - 4:12\nHook: "The biggest mistake..."\nCaption: You\'re sitting on a goldmine...',
              },
              {
                icon: Youtube,
                name: "YouTube Shorts",
                color: "#FF0000",
                desc: "Vertical clip moments with titles and descriptions optimized for Shorts discovery.",
                preview:
                  '[SHORT] 5:30 - 6:15\nTitle: "One Video = 15 Pieces"\nDescription: Most creators post once...',
              },
              {
                icon: Linkedin,
                name: "LinkedIn Posts",
                color: "#0A66C2",
                desc: "Professional tone with storytelling hooks, formatted for LinkedIn's algorithm and audience.",
                preview:
                  "I've been creating content for 3 years.\nHere's the #1 lesson that changed everything:\n\nStop creating more content...",
              },
              {
                icon: Mail,
                name: "Newsletter Blocks",
                color: "#6366F1",
                desc: "Ready-to-paste email sections with headers, body copy, and clear takeaways for subscribers.",
                preview:
                  "## The Repurposing Playbook\n\nThis week I want to share something\nthat's completely transformed my...",
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.name} variants={fadeUp}>
                  <Card hover className="h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${p.color}15` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: p.color }}
                        />
                      </div>
                      <h3 className="font-semibold">{p.name}</h3>
                    </div>
                    <p className="text-secondary text-sm mb-4 leading-relaxed">
                      {p.desc}
                    </p>
                    <div className="bg-background rounded-lg p-3 border border-border/50">
                      <pre className="text-xs text-secondary font-mono whitespace-pre-wrap leading-relaxed">
                        {p.preview}
                      </pre>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Loved by creators
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-secondary text-lg"
            >
              Join thousands of creators who stopped leaving reach on the table.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-secondary">
                        {t.handle} &middot; {t.role}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Ready to multiply your content?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-secondary mb-8 max-w-xl mx-auto"
          >
            Start with one video, blog post, or audio file. See how much
            content you&apos;ve been leaving on the table.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/create">
              <Button size="lg" className="text-base px-8">
                Try Repurpose Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="text-sm text-secondary mt-4"
          >
            No credit card required &middot; 3 free repurposes
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
