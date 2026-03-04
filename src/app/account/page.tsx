"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  CreditCard,
  Settings,
  Bell,
  Shield,
  LogOut,
  Check,
  Zap,
  Crown,
  Mic2,
  Plus,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

/* ── Brand Voice Section ─────────────────────────── */
const TONE_ADJECTIVES = [
  "Educational", "Witty", "Conversational", "Authoritative",
  "Inspirational", "Data-driven", "Storytelling", "Bold",
  "Empathetic", "Concise", "Entertaining", "Professional",
];

function BrandVoiceSection() {
  const [sample, setSample] = useState(
    "I've been creating content for 3 years. Here's what actually moves the needle — and what's just noise."
  );
  const [selectedTones, setSelectedTones] = useState<string[]>(["Conversational", "Educational"]);
  const [saved, setSaved] = useState(false);
  const [customKeywords, setCustomKeywords] = useState<string[]>(["creator economy", "content distribution"]);
  const [newKw, setNewKw] = useState("");

  const toggleTone = (t: string) =>
    setSelectedTones((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].slice(0, 4)
    );

  const addKeyword = () => {
    if (newKw.trim() && !customKeywords.includes(newKw.trim())) {
      setCustomKeywords((prev) => [...prev, newKw.trim()]);
      setNewKw("");
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Mic2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Brand Voice</h3>
            <p className="text-xs text-secondary">
              Train the AI to write content that sounds like you
            </p>
          </div>
        </div>

        {/* Writing sample */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            Your Writing Sample
          </label>
          <p className="text-xs text-secondary mb-2">
            Paste an example of your writing — a tweet, a paragraph, anything. The AI will match this style.
          </p>
          <textarea
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            rows={5}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            placeholder="Paste an example of your best content here..."
          />
          <p className="text-xs text-secondary mt-1">
            {sample.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {/* Tone adjectives */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            Your Tone (pick up to 4)
          </label>
          <div className="flex flex-wrap gap-2">
            {TONE_ADJECTIVES.map((tone) => (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedTones.includes(tone)
                    ? "bg-primary text-white border-primary"
                    : "bg-surface border-border text-secondary hover:border-primary/40"
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Brand keywords */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            Brand Keywords
          </label>
          <p className="text-xs text-secondary mb-2">
            Words or phrases the AI should weave into your content naturally.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {customKeywords.map((kw) => (
              <span
                key={kw}
                className="flex items-center gap-1.5 text-xs bg-accent/40 text-foreground px-3 py-1.5 rounded-full"
              >
                {kw}
                <button
                  onClick={() =>
                    setCustomKeywords((prev) => prev.filter((k) => k !== kw))
                  }
                  className="text-secondary hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              placeholder="Add a keyword..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button variant="secondary" size="sm" onClick={addKeyword}>
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          {saved ? (
            <><Check className="w-4 h-4" />Voice Saved!</>
          ) : (
            "Save Brand Voice"
          )}
        </Button>
      </Card>

      {/* Voice preview */}
      <Card>
        <h4 className="font-semibold mb-3">Voice Profile Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-surface-hover rounded-xl p-4">
            <p className="text-xs text-secondary mb-2">Active Tones</p>
            <div className="flex flex-wrap gap-1">
              {selectedTones.length > 0 ? (
                selectedTones.map((t) => (
                  <Badge key={t} variant="primary">{t}</Badge>
                ))
              ) : (
                <p className="text-secondary text-xs">None selected</p>
              )}
            </div>
          </div>
          <div className="bg-surface-hover rounded-xl p-4">
            <p className="text-xs text-secondary mb-2">Brand Keywords</p>
            <p className="font-medium">{customKeywords.length} keywords</p>
          </div>
          <div className="bg-surface-hover rounded-xl p-4">
            <p className="text-xs text-secondary mb-2">Sample Length</p>
            <p className="font-medium">
              {sample.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with content repurposing",
    features: [
      "3 repurposes per month",
      "All 6 platform outputs",
      "Basic editing tools",
      "Copy to clipboard export",
    ],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For creators who post consistently",
    features: [
      "Unlimited repurposes",
      "All 6 platform outputs",
      "Advanced editing & AI rewrite",
      "Direct publishing to platforms",
      "Content library & history",
      "Priority processing",
    ],
    current: true,
    popular: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "5 team members",
      "Brand voice presets",
      "Approval workflows",
      "Analytics dashboard",
      "API access",
    ],
    current: false,
  },
];

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("profile");

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "brand-voice", label: "Brand Voice", icon: Mic2 },
    { id: "billing", label: "Billing & Plan", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            Account Settings
          </h1>
          <p className="text-secondary">
            Manage your profile, billing, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <div className="flex items-center gap-3 p-3 mb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    JD
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Jane Doe</p>
                  <p className="text-xs text-secondary">jane@creator.com</p>
                </div>
              </div>

              <nav className="space-y-0.5">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-secondary hover:text-foreground hover:bg-surface-hover"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  );
                })}
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-error/5 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {activeSection === "brand-voice" && (
              <BrandVoiceSection />
            )}
            {activeSection === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card>
                  <h3 className="font-semibold mb-6">Profile Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Jane"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="jane@creator.com"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">
                        Bio
                      </label>
                      <textarea
                        defaultValue="Content creator and digital strategist. Helping creators grow through smart content distribution."
                        rows={3}
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-4">Default Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Content Tone</p>
                        <p className="text-xs text-secondary">
                          Default tone for generated content
                        </p>
                      </div>
                      <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm">
                        <option>Professional</option>
                        <option>Casual</option>
                        <option>Friendly</option>
                        <option>Authoritative</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Include Hashtags
                        </p>
                        <p className="text-xs text-secondary">
                          Auto-generate hashtags for social posts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Include Emojis</p>
                        <p className="text-xs text-secondary">
                          Add emojis to social media content
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === "billing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Current plan */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Current Plan</h3>
                    <Badge variant="primary">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-secondary">Monthly usage</p>
                      <p className="font-semibold text-lg mt-1">
                        24 / Unlimited
                      </p>
                      <p className="text-xs text-secondary">repurposes</p>
                    </div>
                    <div>
                      <p className="text-secondary">Next billing</p>
                      <p className="font-semibold text-lg mt-1">Apr 3, 2026</p>
                      <p className="text-xs text-secondary">$19.00</p>
                    </div>
                    <div>
                      <p className="text-secondary">Payment method</p>
                      <p className="font-semibold text-lg mt-1">
                        **** 4242
                      </p>
                      <p className="text-xs text-secondary">Visa</p>
                    </div>
                  </div>
                </Card>

                {/* Plans */}
                <h3 className="font-semibold">Available Plans</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      highlight={plan.popular}
                      className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge variant="primary" size="md">
                            <Zap className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <div className="pt-2">
                        <h4 className="font-semibold text-lg">{plan.name}</h4>
                        <div className="flex items-baseline gap-0.5 mt-2 mb-2">
                          <span className="text-3xl font-bold">
                            {plan.price}
                          </span>
                          <span className="text-secondary text-sm">
                            {plan.period}
                          </span>
                        </div>
                        <p className="text-sm text-secondary mb-4">
                          {plan.description}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant={plan.current ? "secondary" : "primary"}
                          className="w-full"
                          disabled={plan.current}
                        >
                          {plan.current ? "Current Plan" : "Upgrade"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card>
                  <h3 className="font-semibold mb-6">
                    Notification Preferences
                  </h3>
                  <div className="space-y-5">
                    {[
                      {
                        title: "Processing Complete",
                        desc: "Get notified when your content is done processing",
                        enabled: true,
                      },
                      {
                        title: "Scheduled Post Reminders",
                        desc: "Reminder 1 hour before a scheduled post goes live",
                        enabled: true,
                      },
                      {
                        title: "Weekly Summary",
                        desc: "Weekly email with your content performance stats",
                        enabled: false,
                      },
                      {
                        title: "Product Updates",
                        desc: "New features and improvements",
                        enabled: true,
                      },
                      {
                        title: "Tips & Tutorials",
                        desc: "Best practices for content repurposing",
                        enabled: false,
                      },
                    ].map((pref) => (
                      <div
                        key={pref.title}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{pref.title}</p>
                          <p className="text-xs text-secondary">{pref.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={pref.enabled}
                          />
                          <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card>
                  <h3 className="font-semibold mb-6">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        Add an extra layer of security to your account.
                      </p>
                      <p className="text-xs text-secondary mt-1">
                        Currently disabled
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="font-semibold text-error mb-4">
                    Danger Zone
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Delete your account</p>
                      <p className="text-xs text-secondary mt-1">
                        This action is permanent and cannot be undone.
                      </p>
                    </div>
                    <Button variant="danger" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
