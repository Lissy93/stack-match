<script lang="ts">
  import BaseCard from './BaseCard.svelte';
  import { Download } from 'lucide-svelte';

  export let installMetrics: any | undefined;

  interface PackagePhobiaData {
    install: {
      bytes: number;
      pretty: string;
    };
    publish: {
      bytes: number;
      pretty: string;
    };
    publishTime?: number;
    installTime?: number;
  }

  $: phobiaData = installMetrics as PackagePhobiaData | null;
  $: hideCard = !phobiaData || !phobiaData.install;

  function formatTime(seconds: number | undefined): string {
    if (!seconds) return 'N/A';
    if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
</script>

{#if !hideCard}
<BaseCard title="Install Metrics" icon={Download}>
  {#if phobiaData}
    <div class="metrics-grid">
      <div class="metric-item">
        <span class="metric-label">Install Size</span>
        <span class="metric-value">{phobiaData.install.pretty}</span>
        <span class="metric-detail">{phobiaData.install.bytes.toLocaleString()} bytes</span>
      </div>

      <div class="metric-item">
        <span class="metric-label">Publish Size</span>
        <span class="metric-value">{phobiaData.publish.pretty}</span>
        <span class="metric-detail">{phobiaData.publish.bytes.toLocaleString()} bytes</span>
      </div>

      {#if phobiaData.installTime}
        <div class="metric-item">
          <span class="metric-label">Install Time</span>
          <span class="metric-value">{formatTime(phobiaData.installTime)}</span>
          <span class="metric-detail">Average time to npm install</span>
        </div>
      {/if}

      {#if phobiaData.publishTime}
        <div class="metric-item">
          <span class="metric-label">Publish Time</span>
          <span class="metric-value">{formatTime(phobiaData.publishTime)}</span>
          <span class="metric-detail">Time to publish to registry</span>
        </div>
      {/if}
    </div>

    <div class="info-footer">
      <p>
        Data provided by <a href="https://packagephobia.com" target="_blank" rel="noopener noreferrer">PackagePhobia</a>
      </p>
    </div>
  {/if}
</BaseCard>
{/if}

<style>

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--gap-lg);
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .metric-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .metric-value {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--accent-primary);
    line-height: 1;
  }

  .metric-detail {
    font-size: var(--font-xs);
    color: var(--text-secondary);
  }

  .info-footer {
    padding-top: var(--gap-md);
    border-top: 1px solid var(--border-primary);
  }

  .info-footer p {
    margin: 0;
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-align: center;
  }

  .info-footer a {
    color: var(--accent-primary);
    text-decoration: none;
  }

  .info-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
