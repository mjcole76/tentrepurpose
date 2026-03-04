import { NextRequest, NextResponse } from "next/server";

const TONE_PROMPTS: Record<string, string> = {
  casual:
    "Rewrite this in a casual, friendly, conversational tone — like texting a friend. Use short sentences, contractions, and natural language. Keep the same key ideas.",
  professional:
    "Rewrite this in a polished, professional tone suitable for business executives. Confident, precise, no fluff.",
  witty:
    "Rewrite this with wit and personality — clever wordplay, punchy one-liners, a light touch of humor. Still informative but entertaining.",
  storytelling:
    "Rewrite this as a compelling narrative with a hook, conflict/tension, and resolution. Draw the reader in emotionally.",
  concise:
    "Rewrite this in the most concise way possible — strip every unnecessary word while keeping the full meaning. Punchy and tight.",
};

const MOCK_REWRITES: Record<string, string> = {
  casual:
    "Hey, quick thing — the way most creators are doing content? It's kinda backwards.\n\nYou record one video, post it once, and move on. But that same video has like 10+ pieces of content hiding in it!\n\nHere's what I do:\n→ Make the long-form thing\n→ Pull out the good bits\n→ Match the vibe to each platform\n→ Schedule it out through the week\n\nResult? Same effort, way more reach. Sounds like a no-brainer, right? 😄\n\nWhat's your repurposing game like? Drop it below 👇",
  professional:
    "The most significant leverage point for content creators isn't volume — it's distribution.\n\nEach long-form asset contains multiple platform-ready content pieces that remain unexploited by the majority of creators.\n\nThe strategic framework:\n1. Create your primary long-form asset\n2. Systematically extract key moments, insights, and segments\n3. Adapt each element to platform-specific formats and audience expectations\n4. Execute a staggered distribution schedule\n\nOutcome: 5-7x content output from the same creative investment.\n\nCreators who master this approach don't create more. They distribute more intelligently.",
  witty:
    "Plot twist: your YouTube video is secretly 15 different pieces of content in a trench coat. 🎭\n\nMost creators post once and wonder why growth is slow. Meanwhile, every 60 seconds of your video could be a TikTok. Every hot take? A tweet. Every framework? An Instagram carousel.\n\nIt's like buying a pizza and only eating the box.\n\nThe math is criminally simple:\n• 1 video × proper extraction = 1 week of content\n• 1 video × most creators = 1 post (RIP reach)\n\nStop leaving your content in the witness protection program.\n\nWhich platform are you neglecting most? 👀",
  storytelling:
    "Three years ago, I was burning out.\n\nI was creating 3 videos a week, posting across every platform manually, and seeing... nothing. Flat numbers. No growth.\n\nThen a creator friend told me something that changed everything:\n\n*\"You're not creating too little. You're distributing too little.\"*\n\nI looked back at my last video. Really looked. And I found a Twitter thread in the intro. An Instagram carousel in the framework section. Two TikTok clips in the examples.\n\nI'd been throwing away 80% of my work.\n\nThat week, I tested the repurposing approach. One video became seven pieces. My reach didn't 2x. It 5x'd.\n\nThe content was always there. I just needed to see it.",
  concise:
    "One video = 15 pieces of content.\n\nMost creators post once, move on, and leave 80% of their reach on the table.\n\nThe fix:\n→ Create once (long-form)\n→ Extract key moments\n→ Adapt per platform\n→ Schedule systematically\n\nSame effort. 5x the reach.\n\nStop creating more. Start distributing smarter.",
};

const DEFAULT_MODEL = "anthropic/claude-sonnet-4-5";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { content, tone, platform } = await req.json();

    if (!content || !tone) {
      return NextResponse.json(
        { error: "Missing content or tone" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Fall back to mock if no key configured
    if (!apiKey || apiKey === "your_key_here") {
      await new Promise((r) => setTimeout(r, 1200));
      const mock = MOCK_REWRITES[tone] ?? MOCK_REWRITES.casual;
      return NextResponse.json({ result: mock, model: "mock" });
    }

    const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

    const toneInstruction =
      TONE_PROMPTS[tone] ??
      `Rewrite this content with a ${tone} tone, optimized for ${platform}.`;

    const systemPrompt =
      "You are a world-class content strategist and copywriter. " +
      "Return ONLY the rewritten content — no preamble, no explanation, no quotes around the output.";

    const userPrompt =
      `Platform: ${platform}\n` +
      `Task: ${toneInstruction}\n\n` +
      `Keep the same core ideas and structure where appropriate. ` +
      `Maintain appropriate length for the platform.\n\n` +
      `Content to rewrite:\n---\n${content}\n---`;

    const response = await fetch(OPENROUTER_BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://repurpose.app",
        "X-Title": "Repurpose",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenRouter error:", response.status, err);
      return NextResponse.json(
        { error: `OpenRouter error: ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result: string =
      data?.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ result, model });
  } catch (err) {
    console.error("Rewrite API error:", err);
    return NextResponse.json({ error: "Rewrite failed" }, { status: 500 });
  }
}
