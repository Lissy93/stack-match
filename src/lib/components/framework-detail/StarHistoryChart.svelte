<script lang="ts">
  import { formatNumber } from '$lib/utils';

  interface DataPoint {
    date: string;
    stars: number;
  }

  export let dataPoints: DataPoint[] = [];
  export let brandColor: string = '#3b82f6';
  export let currentStars: number = 0;

  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 20, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Process data points
  $: processedData = dataPoints.map((point) => ({
    date: new Date(point.date),
    stars: point.stars,
  }));

  // Calculate scales
  $: minDate = processedData.length > 0 ? processedData[0].date : new Date();
  $: maxDate = processedData.length > 0 ? processedData[processedData.length - 1].date : new Date();
  $: maxStars = currentStars || (processedData.length > 0 ? Math.max(...processedData.map((d) => d.stars)) : 0);

  $: xScale = (date: Date) => {
    const range = maxDate.getTime() - minDate.getTime();
    return range > 0 ? ((date.getTime() - minDate.getTime()) / range) * chartWidth : 0;
  };

  $: yScale = (stars: number) => {
    return chartHeight - (stars / maxStars) * chartHeight;
  };

  // Generate path
  $: linePath = processedData.length > 0
    ? processedData
        .map((point, i) => {
          const x = xScale(point.date);
          const y = yScale(point.stars);
          return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
        })
        .join(' ')
    : '';

  // Generate area fill path
  $: areaPath = processedData.length > 0
    ? linePath +
      ` L ${xScale(processedData[processedData.length - 1].date)} ${chartHeight}` +
      ` L ${xScale(processedData[0].date)} ${chartHeight} Z`
    : '';

  // Generate Y-axis ticks
  $: yTicks = Array.from({ length: 6 }, (_, i) => {
    const value = (maxStars / 5) * i;
    return {
      value,
      y: yScale(value),
      label: formatNumber(value),
    };
  });

  // Generate X-axis ticks
  $: xTicks = (() => {
    if (processedData.length === 0) return [];
    const tickCount = 5;
    const step = Math.floor(processedData.length / tickCount);
    return Array.from({ length: tickCount + 1 }, (_, i) => {
      const index = Math.min(i * step, processedData.length - 1);
      const point = processedData[index];
      return {
        date: point.date,
        x: xScale(point.date),
        label: formatDate(point.date),
      };
    });
  })();

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  // Tooltip handling
  let tooltipVisible = false;
  let tooltipX = 0;
  let tooltipY = 0;
  let tooltipData: { date: string; stars: number } | null = null;

  function handleMouseMove(event: MouseEvent) {
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - padding.left;

    if (mouseX < 0 || mouseX > chartWidth) {
      tooltipVisible = false;
      return;
    }

    // Find nearest data point
    const dateAtMouse = new Date(
      minDate.getTime() + (mouseX / chartWidth) * (maxDate.getTime() - minDate.getTime())
    );

    let nearestPoint = processedData[0];
    let minDistance = Math.abs(dateAtMouse.getTime() - nearestPoint.date.getTime());

    for (const point of processedData) {
      const distance = Math.abs(dateAtMouse.getTime() - point.date.getTime());
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    }

    tooltipVisible = true;
    tooltipX = xScale(nearestPoint.date);
    tooltipY = yScale(nearestPoint.stars);
    tooltipData = {
      date: nearestPoint.date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      stars: nearestPoint.stars,
    };
  }

  function handleMouseLeave() {
    tooltipVisible = false;
  }
</script>

<svg
  class="star-history-chart"
  viewBox="0 0 {width} {height}"
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  role="img"
  aria-label="Star history chart showing {currentStars} stars over time"
>
  <defs>
    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:{brandColor};stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:{brandColor};stop-opacity:0.05" />
    </linearGradient>
  </defs>

  <!-- Chart area -->
  <g transform="translate({padding.left}, {padding.top})">
    <!-- Grid lines -->
    {#each yTicks as tick}
      <line
        x1="0"
        y1={tick.y}
        x2={chartWidth}
        y2={tick.y}
        stroke="rgba(255, 255, 255, 0.1)"
        stroke-width="1"
        stroke-dasharray="4 4"
      />
    {/each}

    <!-- Area fill -->
    {#if areaPath}
      <path d={areaPath} fill="url(#areaGradient)" />
    {/if}

    <!-- Line -->
    {#if linePath}
      <path
        d={linePath}
        fill="none"
        stroke={brandColor}
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {/if}

    <!-- Y-axis -->
    <line
      x1="0"
      y1="0"
      x2="0"
      y2={chartHeight}
      stroke="rgba(255, 255, 255, 0.2)"
      stroke-width="1"
    />

    <!-- Y-axis labels -->
    {#each yTicks as tick}
      <text
        x="-10"
        y={tick.y}
        text-anchor="end"
        dominant-baseline="middle"
        class="axis-label"
      >
        {tick.label}
      </text>
    {/each}

    <!-- X-axis -->
    <line
      x1="0"
      y1={chartHeight}
      x2={chartWidth}
      y2={chartHeight}
      stroke="rgba(255, 255, 255, 0.2)"
      stroke-width="1"
    />

    <!-- X-axis labels -->
    {#each xTicks as tick}
      <text
        x={tick.x}
        y={chartHeight + 20}
        text-anchor="middle"
        class="axis-label"
      >
        {tick.label}
      </text>
    {/each}

    <!-- Tooltip -->
    {#if tooltipVisible && tooltipData}
      <!-- Vertical line -->
      <line
        x1={tooltipX}
        y1="0"
        x2={tooltipX}
        y2={chartHeight}
        stroke={brandColor}
        stroke-width="1"
        stroke-dasharray="4 4"
        opacity="0.5"
      />

      <!-- Tooltip circle -->
      <circle cx={tooltipX} cy={tooltipY} r="5" fill={brandColor} />

      <!-- Tooltip box -->
      <g transform="translate({tooltipX}, {tooltipY - 60})">
        <rect
          x="-70"
          y="0"
          width="140"
          height="50"
          rx="6"
          fill="rgba(0, 0, 0, 0.9)"
          stroke={brandColor}
          stroke-width="1"
        />
        <text
          x="0"
          y="20"
          text-anchor="middle"
          class="tooltip-text tooltip-stars"
          fill="white"
        >
          ⭐ {formatNumber(tooltipData.stars)} stars
        </text>
        <text
          x="0"
          y="38"
          text-anchor="middle"
          class="tooltip-text tooltip-date"
          fill="rgba(255, 255, 255, 0.7)"
        >
          {tooltipData.date}
        </text>
      </g>
    {/if}
  </g>

  <!-- Chart title -->
  <text
    x={width / 2}
    y="15"
    text-anchor="middle"
    class="chart-title"
    fill="rgba(255, 255, 255, 0.9)"
  >
    Star Growth Over Time
  </text>
</svg>

<style>
  .star-history-chart {
    width: 100%;
    height: auto;
    max-height: 500px;
    background: transparent;
    cursor: crosshair;
  }

  .axis-label {
    fill: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .tooltip-text {
    font-family: system-ui, -apple-system, sans-serif;
    pointer-events: none;
  }

  .tooltip-stars {
    font-size: 14px;
    font-weight: 600;
  }

  .tooltip-date {
    font-size: 11px;
  }

  @media (max-width: 768px) {
    .axis-label {
      font-size: 10px;
    }

    .chart-title {
      font-size: 14px;
    }
  }
</style>
