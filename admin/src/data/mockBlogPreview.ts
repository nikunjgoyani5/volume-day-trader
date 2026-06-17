export const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1611974789855-9c8a298572e9?w=1200&h=675&fit=crop";

export function buildMockBlogTitle(topic: string): string {
  const trimmed = topic.trim();
  if (trimmed.length > 10) {
    return trimmed.split("\n")[0]?.slice(0, 120) ?? "Wyckoff Trading Insights";
  }
  return "Top 5 Wyckoff Trading Strategies for 2026";
}

export function buildMockBlogHtml(title: string): string {
  const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<h1>${safeTitle}</h1>
<p>Volume analysis remains one of the most reliable lenses institutional traders use to read accumulation, distribution, and trend continuation. This guide breaks down practical Wyckoff concepts you can apply on the Volume Day Trader platform.</p>
<h2>Understanding accumulation phases</h2>
<p>During accumulation, price often compresses while volume contracts at lows and expands on tests. Watch for spring patterns and secondary tests where effort fails to push price meaningfully lower.</p>
<blockquote>The market is never wrong; opinions often are. Volume tells you who is in control.</blockquote>
<h2>Five strategies to practice</h2>
<ul>
<li>Mark up phases with volume climax bars at range highs</li>
<li>Confirm breakouts with above-average relative volume</li>
<li>Use PTA indicators to align structure with effort</li>
<li>Filter false springs with closing price location</li>
<li>Journal each setup with screenshots and volume notes</li>
</ul>
<h2>Conclusion</h2>
<p>Consistent review of volume behavior builds intuition faster than indicator stacking alone. Treat every trade as a data point and let the market narrative guide your bias.</p>`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}
