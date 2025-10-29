<script lang="ts">
  export let downloadTrends: any | undefined;
  export let brandColor: string | undefined = undefined;

  interface DownloadData {
    downloads: Array<{
      day: string;
      downloads: number;
    }>;
    start: string;
    end: string;
    package: string;
  }

  $: trendsData = downloadTrends as DownloadData | null;
  $: hideCard = !trendsData || !trendsData.downloads || trendsData.downloads.length === 0;
  $: chartColor = brandColor || '#3b82f6';

  // Calculate chart dimensions and scales
  $: maxDownloads = trendsData?.downloads ? Math.max(...trendsData.downloads.map(d => d.downloads)) : 0;
  $: minDownloads = trendsData?.downloads ? Math.min(...trendsData.downloads.map(d => d.downloads)) : 0;

  const chartWidth = 1000;
  const chartHeight = 300;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Generate SVG path for line chart
  $: pathData = trendsData?.downloads ? (() => {
    const points = trendsData.downloads.map((d, i) => {
      const x = padding.left + (i / (trendsData.downloads.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - ((d.downloads - minDownloads) / (maxDownloads - minDownloads)) * innerHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return points;
  })() : '';

  // Generate area fill path
  $: areaPath = trendsData?.downloads ? (() => {
    const points = trendsData.downloads.map((d, i) => {
      const x = padding.left + (i / (trendsData.downloads.length - 1)) * innerWidth;
      const y = padding.top + innerHeight - ((d.downloads - minDownloads) / (maxDownloads - minDownloads)) * innerHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    return `${points} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`;
  })() : '';

  // Y-axis ticks
  $: yTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const value = minDownloads + (maxDownloads - minDownloads) * ratio;
    const y = padding.top + innerHeight - ratio * innerHeight;
    return { value, y };
  });

  // X-axis ticks (show every ~30 days)
  $: xTicks = trendsData?.downloads ? trendsData.downloads
    .filter((_, i) => i % 30 === 0 || i === trendsData.downloads.length - 1)
    .map((d, _, arr) => {
      const index = trendsData.downloads.indexOf(d);
      const x = padding.left + (index / (trendsData.downloads.length - 1)) * innerWidth;
      return { date: d.day, x };
    }) : [];
</script>

{#if !hideCard}
<div class="card card-wide download-trends-card">
  <div class="card-header">
    <h3>Download Trends</h3>
    <div class="stats">
      {#if trendsData}
        <div class="stat-item">
          <span class="stat-value">{formatNumber(maxDownloads)}</span>
          <span class="stat-label">peak downloads/day</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{trendsData.downloads.length}</span>
          <span class="stat-label">days tracked</span>
        </div>
      {/if}
    </div>
  </div>

  {#if trendsData}
    <div class="chart-container">
      <svg viewBox="0 0 {chartWidth} {chartHeight}" preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        <g class="grid">
          {#each yTicks as tick}
            <line
              x1={padding.left}
              y1={tick.y}
              x2={padding.left + innerWidth}
              y2={tick.y}
              stroke="var(--border-primary)"
              stroke-opacity="0.2"
            />
          {/each}
        </g>

        <!-- Area fill -->
        <path
          d={areaPath}
          fill={chartColor}
          fill-opacity="0.1"
        />

        <!-- Line -->
        <path
          d={pathData}
          fill="none"
          stroke={chartColor}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Y-axis labels -->
        <g class="y-axis">
          {#each yTicks as tick}
            <text
              x={padding.left - 10}
              y={tick.y}
              text-anchor="end"
              dominant-baseline="middle"
              class="axis-label"
            >
              {formatNumber(tick.value)}
            </text>
          {/each}
        </g>

        <!-- X-axis labels -->
        <g class="x-axis">
          {#each xTicks as tick}
            <text
              x={tick.x}
              y={chartHeight - padding.bottom + 25}
              text-anchor="middle"
              class="axis-label"
            >
              {formatDate(tick.date)}
            </text>
          {/each}
        </g>
      </svg>
    </div>
  {/if}
</div>
{/if}

<style>
  .download-trends-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-md);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .stats {
    display: flex;
    gap: var(--gap-lg);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .stat-value {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--accent-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .chart-container {
    width: 100%;
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    padding: var(--gap-lg);
  }

  svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .axis-label {
    fill: var(--text-tertiary);
    font-size: 11px;
    font-family: var(--font-family);
  }

  @media (max-width: 768px) {
    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .stats {
      width: 100%;
      justify-content: space-around;
    }

    .axis-label {
      font-size: 9px;
    }
  }
</style>
