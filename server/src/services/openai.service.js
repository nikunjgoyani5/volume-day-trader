const { env } = require("../config/env");

const BLOG_GENERATION_PROMPT_PREFIX = [
  "You are a professional blog writer and HTML generator.",
  "Generate a complete, production-ready blog post as valid HTML.",
  "STRICT RULES:",
  "- Output MUST be raw HTML only (no markdown, no code fences).",
  "- Do NOT include <img>, <picture>, <figure>, <video>, iframe, or embeds.",
  "- Do NOT include JavaScript or inline event handlers.",
  "- Do NOT include <style> or CSS.",
  "- Use only clean semantic HTML tags: <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>.",
  "- Do NOT use em dashes or long dashes in the writing. Use simple punctuation only.",
  "STRUCTURE:",
  "- Start with a compelling <h1> title.",
  "- Write an engaging introduction (2-3 paragraphs).",
  "- Use multiple <h2> sections.",
  "- Under each <h2>, include structured content (paragraphs + lists).",
  "- Keep paragraphs short (2-4 lines max).",
  "- End with a strong conclusion section.",
  "SEO RULES:",
  "- Naturally include the main topic keyword throughout.",
  "- Write a clear and engaging introduction for SEO.",
  "- Use descriptive section headings.",
  "- Avoid keyword stuffing.",
  "WRITING STYLE:",
  "- Clear, professional, and easy to read.",
  "- Avoid fluff and repetition.",
  "- Use real-world examples where possible.",
  "- Write for humans first, SEO second.",
  "LENGTH:",
  "- Target 800-1200 words.",
].join("\n");

function extractContent(payload) {
  if (payload.output_text) return payload.output_text;

  const outputText = payload.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text" && item.text)?.text;

  if (outputText) return outputText;

  return payload.content || payload.blog || payload.result || "";
}

class OpenAIService {
  get apiKey() {
    return env.openAiApiKey;
  }

  assertConfigured() {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }
  }

  async generateBlogHtml(prompt, targetWordCount) {
    this.assertConfigured();

    const lengthHint = targetWordCount
      ? `Target approximately ${targetWordCount} words.`
      : "Target 800-1200 words.";

    const generationPrompt = [
      BLOG_GENERATION_PROMPT_PREFIX,
      lengthHint,
      `User topic: ${prompt}`,
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: generationPrompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "OpenAI request failed.");
    }

    const data = await response.json();
    const content = extractContent(data).trim();

    if (!content) {
      throw new Error("Empty content returned from OpenAI.");
    }

    return content;
  }

  async generateCoverImageUrl(prompt) {
    this.assertConfigured();

    const imagePrompt = `A natural, candid photograph for a blog cover about: ${prompt}.

The image should look like a real, everyday photo taken by a human:
slightly imperfect composition
natural lighting (not cinematic or dramatic)
realistic environment (home office, workplace, desk setup)
minor clutter, irregular details, lived-in feel

Include:
a real person or realistic workspace
normal objects (laptop, coffee mug, notebook, monitors)

Camera style:
shot on a phone or DSLR (35mm or 50mm)
slight grain, natural shadows, no dramatic effects

Avoid completely:
anything futuristic or sci-fi
perfect symmetry or overly clean setups
glowing lights, neon effects
ultra sharp HDR, over-processed look
CGI, 3D render, digital art, concept art
AI aesthetic (too polished, too perfect)

Style reference:
looks like a casual Unsplash or candid LinkedIn photo

Output:
realistic, slightly imperfect, human feel
16:9 aspect ratio`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: env.openAiImageModel,
        prompt: imagePrompt,
        n: 1,
        size: "1536x1024",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || "Image generation failed.",
      );
    }

    const data = await response.json();
    const image = data.data?.[0];

    if (image?.url) {
      return image.url;
    }

    if (image?.b64_json) {
      return `data:image/png;base64,${image.b64_json}`;
    }

    throw new Error("No image was generated. Please try again.");
  }
}

const openaiService = new OpenAIService();

module.exports = { openaiService };
