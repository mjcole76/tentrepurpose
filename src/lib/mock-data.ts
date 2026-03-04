import { SourceContent, RepurposedAsset, ProcessingStep } from "./types";

export const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: "transcribe",
    label: "Transcribing Content",
    description: "Converting audio/video to text using AI transcription",
    status: "pending",
  },
  {
    id: "analyze",
    label: "Analyzing Structure",
    description: "Identifying key moments, topics, and quotable segments",
    status: "pending",
  },
  {
    id: "segment",
    label: "Segmenting Topics",
    description: "Breaking content into thematic sections for repurposing",
    status: "pending",
  },
  {
    id: "generate",
    label: "Generating Assets",
    description: "Creating optimized content for each platform",
    status: "pending",
  },
  {
    id: "optimize",
    label: "Optimizing & Polishing",
    description: "Fine-tuning tone, length, and formatting per platform",
    status: "pending",
  },
];

export function generateMockAssets(sourceId: string): RepurposedAsset[] {
  return [
    {
      id: `${sourceId}-twitter`,
      sourceId,
      platform: "twitter",
      title: "Twitter/X Thread",
      content: `🧵 Thread: The future of content creation is changing fast. Here's what most creators are missing:\n\n1/ The biggest mistake creators make is treating each platform as separate. Your YouTube video already contains 10+ pieces of content waiting to be extracted.\n\n2/ Think about it: every 60-second segment of a 10-minute video could be a TikTok. Every key insight could be a tweet. Every story could be a LinkedIn post.\n\n3/ The creators winning right now aren't creating more — they're repurposing smarter. One piece of content becomes 15+ touchpoints across platforms.\n\n4/ Here's the framework I use:\n→ Record once (long-form)\n→ Extract key moments\n→ Adapt format per platform\n→ Schedule strategically\n→ Repeat\n\n5/ The result? 5x the reach with the same creative effort. Stop leaving distribution on the table.\n\nWhat's your repurposing strategy? Reply below 👇`,
      status: "ready",
      metadata: {
        characterCount: 742,
        wordCount: 128,
        hashtags: ["#ContentCreation", "#CreatorEconomy", "#Repurposing"],
        suggestedTime: "9:00 AM EST",
      },
    },
    {
      id: `${sourceId}-instagram`,
      sourceId,
      platform: "instagram",
      title: "Instagram Carousel",
      content: `Slide 1: "One Video, Infinite Content" — The Repurposing Playbook\n\nSlide 2: The Problem — You spend hours creating one piece of content, post it once, and move on. That's leaving 90% of your reach on the table.\n\nSlide 3: The Solution — Every long-form piece contains multiple micro-content pieces hiding in plain sight.\n\nSlide 4: What's Inside Your Video:\n• 3-5 quotable one-liners\n• 2-3 short-form clip moments\n• 1 compelling story arc\n• 5+ key insights for threads\n\nSlide 5: The Framework:\n1. Create your anchor content\n2. Extract key moments\n3. Adapt for each platform\n4. Schedule strategically\n\nSlide 6: The Results — Creators using this method see 5x more reach with zero extra creative effort.\n\nSlide 7: "Stop creating more. Start distributing better."\n\nSlide 8: Save this post & follow for more creator strategies 🔖`,
      status: "ready",
      metadata: {
        slideCount: 8,
        hashtags: [
          "#ContentStrategy",
          "#CreatorTips",
          "#InstagramGrowth",
          "#ContentRepurposing",
          "#SocialMediaTips",
        ],
        suggestedTime: "11:00 AM EST",
      },
    },
    {
      id: `${sourceId}-tiktok`,
      sourceId,
      platform: "tiktok",
      title: "TikTok Clip — Key Moment",
      content: `[CLIP SUGGESTION]\n\nTimestamp: 3:24 - 4:12\nHook: "The biggest mistake creators make..."\n\nCaption: "You're sitting on a goldmine of content and don't even know it 🤯 One video = 15+ pieces of content if you know how to extract them. Here's the framework I use every single week 👇\n\n#contentcreator #repurposing #creatortips #socialmedia #growthhack"\n\n[ALTERNATIVE CLIP]\n\nTimestamp: 7:15 - 8:02\nHook: "Here's what changed everything for me..."\n\nCaption: "I went from posting 3x/week to reaching 5x more people — without creating a single extra piece of content. The secret? Strategic repurposing. Save this ✅\n\n#creatoreconomy #contentcreation #productivity"`,
      status: "ready",
      timestamps: { start: "3:24", end: "4:12" },
      metadata: {
        clipDuration: "48s",
        hashtags: [
          "#contentcreator",
          "#repurposing",
          "#creatortips",
          "#socialmedia",
        ],
        suggestedTime: "6:00 PM EST",
      },
    },
    {
      id: `${sourceId}-shorts`,
      sourceId,
      platform: "shorts",
      title: "YouTube Shorts Clip",
      content: `[SHORTS SUGGESTION]\n\nTimestamp: 5:30 - 6:15\nTitle: "One Video = 15 Pieces of Content"\n\nDescription: Most creators post once and move on. But every long-form video you make contains at least 15 pieces of micro-content. Here's how to find them:\n\n1. Watch for "quotable moments" — any sentence that stands alone\n2. Find the "aha moment" — where you explain the core insight\n3. Look for stories — personal anecdotes that resonate\n4. Extract data points — any statistics or frameworks\n\nThe creators winning today aren't creating more. They're extracting more from what they already have.\n\n#Shorts #ContentCreation #CreatorEconomy`,
      status: "ready",
      timestamps: { start: "5:30", end: "6:15" },
      metadata: {
        clipDuration: "45s",
        suggestedTime: "2:00 PM EST",
      },
    },
    {
      id: `${sourceId}-linkedin`,
      sourceId,
      platform: "linkedin",
      title: "LinkedIn Post",
      content: `I've been creating content for 3 years. Here's the #1 lesson that changed everything:\n\nStop creating more content. Start distributing what you already have.\n\nMost creators spend 80% of their time creating and 20% distributing. The top 1%? They flip that ratio.\n\nHere's what I mean:\n\nEvery 10-minute YouTube video contains:\n→ A Twitter thread (key insights as a narrative)\n→ An Instagram carousel (visual framework breakdown)\n→ 2-3 TikTok/Shorts clips (high-energy moments)\n→ A LinkedIn post (professional angle)\n→ A newsletter section (deep-dive excerpt)\n\nThat's 7+ pieces of content from ONE creative session.\n\nThe math is simple:\n• 1 video/week × 7 repurposed pieces = 365 pieces/year\n• vs. 1 video/week × 1 post = 52 pieces/year\n\nSame effort. 7x the output. 5x the reach.\n\nThe best part? Each platform gets content optimized for how that audience consumes information. Not a copy-paste — a thoughtful adaptation.\n\nThis is the future of content creation. And the creators who figure it out first will have an unfair advantage.\n\nWhat's your current repurposing workflow? I'd love to hear what's working for you.\n\n#ContentCreation #CreatorEconomy #ContentStrategy #Marketing`,
      status: "ready",
      metadata: {
        characterCount: 1087,
        wordCount: 192,
        hashtags: [
          "#ContentCreation",
          "#CreatorEconomy",
          "#ContentStrategy",
          "#Marketing",
        ],
        suggestedTime: "8:00 AM EST",
      },
    },
    {
      id: `${sourceId}-newsletter`,
      sourceId,
      platform: "newsletter",
      title: "Newsletter Block",
      content: `## The Repurposing Playbook: How Top Creators Get 5x More Reach\n\nHey there,\n\nThis week I want to share something that's completely transformed my content workflow — and it's probably the highest-leverage strategy I've discovered in 3 years of creating.\n\n**The core idea:** Every piece of long-form content you create is actually a container holding 7-15 pieces of platform-specific content. Most creators never extract them.\n\n### Here's the framework:\n\n**Step 1: Create your anchor piece.** This is your long-form content — a YouTube video, podcast episode, or blog post. Focus all your creative energy here.\n\n**Step 2: Extract the building blocks.** As you review your content, look for:\n- **Quotable one-liners** → Perfect for tweets\n- **Key frameworks or lists** → Instagram carousels\n- **High-energy 30-60 second moments** → TikTok/Shorts clips\n- **Professional insights** → LinkedIn posts\n- **Deep-dive sections** → Newsletter excerpts (like this one!)\n\n**Step 3: Adapt, don't copy-paste.** Each platform has its own language. A tweet should feel native to Twitter. A LinkedIn post should feel native to LinkedIn. Same insight, different packaging.\n\n**Step 4: Schedule strategically.** Don't dump everything at once. Space your repurposed content across the week to maximize touchpoints.\n\n### The result?\n\nI went from posting 3x/week to having content going out daily across 5 platforms — without spending a single extra hour creating. My reach increased 5x. My audience grew on platforms I'd been neglecting.\n\nThe best creators aren't working harder. They're distributing smarter.\n\nTry it this week: Take your last piece of content and see how many platform-specific pieces you can extract. I bet it's more than you think.\n\nUntil next time,\n[Your Name]`,
      status: "ready",
      metadata: {
        wordCount: 274,
        suggestedTime: "Tuesday 7:00 AM",
      },
    },
  ];
}

export const MOCK_LIBRARY: SourceContent[] = [
  {
    id: "src-1",
    title: "The Future of Content Creation — Why Repurposing Is the Key to Growth",
    type: "youtube",
    url: "https://youtube.com/watch?v=example1",
    thumbnail: "",
    duration: "12:34",
    createdAt: "2026-03-01T10:00:00Z",
    status: "completed",
    assets: generateMockAssets("src-1"),
  },
  {
    id: "src-2",
    title: "Building a Personal Brand in 2026 — My Framework",
    type: "youtube",
    url: "https://youtube.com/watch?v=example2",
    thumbnail: "",
    duration: "18:22",
    createdAt: "2026-02-25T14:30:00Z",
    status: "completed",
    assets: generateMockAssets("src-2"),
  },
  {
    id: "src-3",
    title: "How I Grew to 100K Followers Using One Simple Strategy",
    type: "blog",
    url: "https://example.com/blog/100k-strategy",
    createdAt: "2026-02-20T09:15:00Z",
    status: "completed",
    assets: generateMockAssets("src-3"),
  },
  {
    id: "src-4",
    title: "Creator Economy Podcast — Episode 47",
    type: "audio",
    fileName: "creator-economy-ep47.mp3",
    duration: "45:10",
    createdAt: "2026-02-15T16:00:00Z",
    status: "completed",
    assets: generateMockAssets("src-4"),
  },
];
