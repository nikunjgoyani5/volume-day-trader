type BlogPreviewArticleProps = {
  title: string;
  category: string;
  readTime: string;
  createdDate: string;
  coverUrl: string;
};

export default function BlogPreviewArticle({
  title,
  category,
  readTime,
  createdDate,
  coverUrl,
}: BlogPreviewArticleProps) {
  return (
    <article className="blog-preview-fade">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <img
          src={coverUrl}
          alt=""
          className="aspect-video w-full object-cover"
        />
      </div>

      <h1 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl">
        {title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-secondary-text">
        <span>
          <span className="text-white/60">Category</span> {category}
        </span>
        <span>
          <span className="text-white/60">Read Time</span> {readTime}
        </span>
        <span>
          <span className="text-white/60">Created</span> {createdDate}
        </span>
      </div>

      <div className="blog-article-content mt-8 space-y-6 text-feature-text">
        <p className="text-lg leading-relaxed text-secondary-text">
          Volume analysis remains one of the most reliable lenses institutional
          traders use to read accumulation, distribution, and trend
          continuation. This guide breaks down practical Wyckoff concepts you
          can apply on the Volume Day Trader platform.
        </p>

        <h2>Understanding accumulation phases</h2>
        <p>
          During accumulation, price often compresses while volume contracts at
          lows and expands on tests. Watch for spring patterns and secondary
          tests where effort fails to push price meaningfully lower - a classic
          sign smart money is absorbing supply.
        </p>

        <blockquote>
          &ldquo;The market is never wrong; opinions often are. Volume tells you
          who is in control.&rdquo;
        </blockquote>

        <h2>Five strategies to practice in 2026</h2>
        <ol>
          <li>Mark up phases with volume climax bars at range highs</li>
          <li>Confirm breakouts with above-average relative volume</li>
          <li>Use PTA indicators to align structure with effort</li>
          <li>Filter false springs with closing price location</li>
          <li>Journal each setup with screenshots and volume notes</li>
        </ol>

        <h3>Volume vs. price divergence</h3>
        <p>
          When price makes new highs on declining volume, distribution risk
          rises. Combine this with narrowing spreads and upthrusts after
          markup for higher-conviction short-term caution.
        </p>

        <figure className="my-8 overflow-hidden rounded-xl border border-white/[0.08]">
          <img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=400&fit=crop"
            alt="Trading chart illustration"
            className="w-full object-cover"
          />
          <figcaption className="px-4 py-2 text-center text-xs text-muted-text">
            Example structure map - illustrative only
          </figcaption>
        </figure>

        <h2>Quick reference table</h2>
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Volume signal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accumulation</td>
                <td>Climactic selling, drying up</td>
                <td>Watch springs / tests</td>
              </tr>
              <tr>
                <td>Markup</td>
                <td>Expanding on advances</td>
                <td>Trend follow with stops</td>
              </tr>
              <tr>
                <td>Distribution</td>
                <td>High volume, weak progress</td>
                <td>Reduce size, tighten risk</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Next steps</h2>
        <ul>
          <li>Backtest each pattern on your watchlist</li>
          <li>Align entries with market structure from PTA tools</li>
          <li>Publish insights to educate your community</li>
        </ul>

        <p>
          Consistent review of volume behavior builds intuition faster than
          indicator stacking alone. Treat every trade as a data point and let
          the market narrative guide your bias.
        </p>
      </div>
    </article>
  );
}
