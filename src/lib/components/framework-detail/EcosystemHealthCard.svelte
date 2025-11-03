<script lang="ts">
  import BaseCard from './BaseCard.svelte';
  import { HeartPulse } from 'lucide-svelte';

  export let ecosystem: any;
  export let lastUpdated: string;

  function getHealthColor(score: number): string {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#3b82f6';
    if (score >= 25) return '#fbbf24';
    return '#ef4444';
  }

  $: metrics = ecosystem ? [
    { label: 'GitHub Activity', value: ecosystem.github_activity_score, color: getHealthColor(ecosystem.github_activity_score) },
    { label: 'NPM Popularity', value: ecosystem.npm_popularity_score, color: getHealthColor(ecosystem.npm_popularity_score) },
    { label: 'Maintenance', value: ecosystem.maintenance_score, color: getHealthColor(ecosystem.maintenance_score) },
    { label: 'Community', value: ecosystem.community_score, color: getHealthColor(ecosystem.community_score) },
    { label: 'Security', value: ecosystem.security_score, color: getHealthColor(ecosystem.security_score) },
  ] : [];

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<BaseCard title="Ecosystem Health Scores" icon={HeartPulse}>
  {#if ecosystem?.overall_health !== undefined}
    <div class="overall-health">
      <div class="health-circle" style="--health-color: {getHealthColor(ecosystem.overall_health)}">
        <svg viewBox="0 0 100 100">
          <circle class="health-bg" cx="50" cy="50" r="45" />
          <circle
            class="health-progress"
            cx="50"
            cy="50"
            r="45"
            style="stroke-dashoffset: {283 - (283 * ecosystem.overall_health) / 100}"
          />
        </svg>
        <div class="health-value">
          <span class="health-number">{ecosystem.overall_health}</span>
          <span class="health-percent">%</span>
        </div>
      </div>
      <div class="health-label">Overall Health</div>
    </div>
  {/if}

  {#if metrics.length > 0}
    <div class="metrics-list">
      {#each metrics as metric}
        <div class="metric-item">
          <div class="metric-header">
            <span class="metric-label">{metric.label}</span>
            <span class="metric-value" style="color: {metric.color}">{metric.value}%</span>
          </div>
          <div class="metric-bar">
            <div
              class="metric-progress"
              style="width: {metric.value}%; background-color: {metric.color}"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if lastUpdated}
    <div class="last-updated">
      Last updated: {formatDate(lastUpdated)}
    </div>
  {/if}
</BaseCard>

<style>

  .overall-health {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--gap-lg);
    background: var(--surface-tertiary);
    border-radius: var(--radius-lg);
    gap: var(--gap-md);
  }

  .health-circle {
    position: relative;
    width: 120px;
    height: 120px;
  }

  .health-circle svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .health-bg {
    fill: none;
    stroke: var(--surface-primary);
    stroke-width: 8;
  }

  .health-progress {
    fill: none;
    stroke: var(--health-color);
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 283;
    transition: stroke-dashoffset 1s ease;
  }

  .health-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .health-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .health-percent {
    font-size: var(--font-lg);
    color: var(--text-secondary);
  }

  .health-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .metrics-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .metric-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }

  .metric-value {
    font-size: var(--font-base);
    font-weight: 700;
  }

  .metric-bar {
    height: 8px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .metric-progress {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width 0.8s ease;
  }

  .last-updated {
    padding-top: var(--gap-md);
    border-top: 1px solid var(--border-primary);
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-align: center;
  }

  @media (max-width: 768px) {
    .health-circle {
      width: 100px;
      height: 100px;
    }

    .health-number {
      font-size: 1.5rem;
    }
  }
</style>
