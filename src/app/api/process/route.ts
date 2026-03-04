import { NextRequest, NextResponse } from "next/server";
import { generateMockAssets } from "@/lib/mock-data";
import { RepurposedAsset } from "@/lib/types";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-sonnet-4-5";

async function fetchYouTubeMetadata(
  url: string
): Promise<{ title: string; author: string } | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title ?? "", author: data.author_name ?? "" };
  } catch {
    return null;
  }
}

async function fetchBlogTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; repurpose-bot/1.0)" },
      signal: AbortSignal.timeout(6000),
    });
    const html = await res.text();
    const ogMatch = html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
    );
    if (ogMatch) return ogMatch[1].trim();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) return titleMatch[1].trim();
    return null;
  } catch {
    return null;
  }
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#\w+/g) || [];
  return [...new Set(matches)].slice(0, 10);
}

function countSlides(text: string): number {
  const matches = text.match(/Slide \d+:/gi) || [];
  return matches.length || 8;
}

function buildAssets(
  sourceId: string,
  generated: Record<string, string>
): RepurposedAsset[] {
  const make = (
    platform: RepurposedAsset["platform"],
    title: string,
    content: string,
    extra: Partial<RepurposedAsset> = {}
  ): RepurposedAsset => ({
    id: `${sourceId}-${platform}`,
    sourceId,
    platform,
    title,
    content,
    status: "ready",
    ...extra,
    metadata: {
      characterCount: content.length,
      wordCount: content.split(/\s+/).filter(Boolean).length,
      ...(extra.metadata ?? {}),
    },
  });

  return [
    make("twitter", "Twitter/X Thread", generated.twitter ?? "", {
      metadata: {
        hashtags: extractHashtags(generated.twitter ?? ""),
        suggestedTime: "9:00 AM EST",
      },
    }),
    make("instagram", "Instagram Carousel", generated.instagram ?? "", {
      metadata: {
        slideCount: countSlides(generated.instagram ?? ""),
        hashtags: extractHashtags(generated.instagram ?? ""),
        suggestedTime: "11:00 AM EST",
      },
    }),
    make("tiktok", "TikTok Video", generated.tiktok ?? "", {
      timestamps: { start: "0:00", end: "0:55" },
      metadata: {
        clipDuration: "55 sec",
        hashtags: extractHashtags(generated.tiktok ?? ""),
        suggestedTime: "7:00 PM EST",
      },
    }),
    make("shorts", "YouTube Shorts", generated.shorts ?? "", {
      timestamps: { start: "0:00", end: "0:58" },
      metadata: { clipDuration: "58 sec", suggestedTime: "3:00 PM EST" },
    }),
    make("linkedin", "LinkedIn Post", generated.linkedin ?? "", {
      metadata: { suggestedTime: "8:00 AM EST" },
    }),
    make("newsletter", "Newsletter Excerpt", generated.newsletter ?? "", {
      metadata: { suggestedTime: "Tuesday 8:00 AM EST" },
    }),
  ];
}

export async function POST(req: NextRequest) {
  try {
    const { sourceId, url, type, textContent, title } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

    // Gather context based on content type
    let topicTitle = title ?? "Content";
    let sourceText = "";

    if (type === "youtube" && url) {
      const meta = await fetchYouTubeMetadata(url);
      if (meta) {
        topicTitle = meta.title;
        sourceText = `YouTube video titled "${meta.title}" by ${meta.author}. URL: ${url}`;
      } else {
        sourceText = `YouTube video. URL: ${url}`;
      }
    } else if (type === "blog" && url) {
      const pageTitle = await fetchBlogTitle(url);
      if (pageTitle) topicTitle = pageTitle;
      sourceText = `Blog post titled "${topicTitle}". URL: ${url}`;
    } else if (type === "text" && textContent) {
      sourceText = textContent;
      topicTitle = textContent.split(/\s+/).slice(0, 10).join(" ") + "...";
    } else if ((type === "video" || type === "audio") && title) {
      sourceText = `${type === "video" ? "Video" : "Audio"} file named: ${title}`;
    } else {
      sourceText = title ?? "Content";
    }

    // No API key — fall back to mock
    if (!apiKey || apiKey === "your_key_here") {
      return NextResponse.json({ assets: generateMockAssets(sourceId) });
    }

    const systemPrompt =
      "You are a world-class content strategist and social media expert. " +
      "Repurpose source content into platform-optimized formats. " +
      "Return ONLY a valid JSON object — no markdown, no code fences, no extra text.";

    const userPrompt =
      `Source type: ${type}\n` +
      `Topic: ${topicTitle}\n` +
      `Content: ${sourceText.slice(0, 3000)}\n\n` +
      `Return a JSON object with exactly these keys:\n` +
      `{\n` +
      `  "twitter": "5-7 tweets separated by \\n\\n---\\n\\n. Hook first. Hashtags on the last tweet only.",\n` +
      `  "instagram": "8-10 slides as 'Slide N: [text]' each on its own line. Add 'Caption: [caption with hashtags]' at the end.",\n` +
      `  "tiktok": "Hook + script/caption under 2200 chars. Start with attention-grabbing hook. End with CTA + hashtags.",\n` +
      `  "shorts": "Title: [title]\\nHook (0-5s): [hook]\\nMain (5-55s): [key points as bullets]\\nCTA (55-60s): [call to action]",\n` +
      `  "linkedin": "600-1200 char professional post. Strong opening line, line-break-separated insights, end with question or CTA.",\n` +
      `  "newsletter": "Subject: [subject line]\\n\\n[300-500 word editorial body with clear takeaway and sign-off]"\n` +
      `}\n\n` +
      `Make every piece SPECIFIC to the topic — no generic filler.`;

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
        max_tokens: 4096,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter error:", response.status, await response.text());
      return NextResponse.json({ assets: generateMockAssets(sourceId) });
    }

    const data = await response.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "{}";

    // Strip any markdown code fences the model might wrap around JSON
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let generated: Record<string, string> = {};
    try {
      generated = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed, raw output:", raw.slice(0, 300));
      return NextResponse.json({ assets: generateMockAssets(sourceId) });
    }

    return NextResponse.json({ assets: buildAssets(sourceId, generated), model });
  } catch (err) {
    console.error("Process API error:", err);
    return NextResponse.json({ assets: generateMockAssets("fallback") });
  }
}
