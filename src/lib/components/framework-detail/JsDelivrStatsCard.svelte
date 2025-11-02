<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import NoData from './NoData.svelte';
  import { formatNumber } from '$lib/utils';
  import type { JsDelivrData } from '$lib/types';
  import { CloudDownload } from 'lucide-svelte';

  export let packageName: string | undefined;

  let loading = true;
  let error = false;
  let data: JsDelivrData | null = null;

  onMount(async () => {
    if (!packageName) {
      loading = false;
      return;
    }

    try {
      const response = await fetch(`/api/jsdelivr/${encodeURIComponent(packageName)}`);
      if (response.ok) {
        data = await response.json();
      } else {
        error = true;
      }
    } catch (err) {
      console.error('Failed to fetch jsDelivr data:', err);
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

<BaseCard title="CDN Usage">
  {#if !packageName}
    <NoData>No package information available</NoData>
  {:else if loading}
    <LoadingSpinner>Loading CDN stats...</LoadingSpinner>
  {:else if error || !data}
    <NoData>Unable to load CDN data</NoData>
  {:else}
    <div class="content">
      <div class="stat-highlight">
        <div class="stat-value">{formatNumber(data.last30Days)}</div>
        <div class="stat-label">
          <CloudDownload size={16} />
          Downloads (30D)
        </div>
        <div class="stat-note">Rank #{data.rank}</div>
      </div>

      <a
        href="https://www.jsdelivr.com/package/npm/{encodeURIComponent(packageName)}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
        aria-label="View {packageName} on jsDelivr"
      >
        View on jsDelivr →
      </a>
    </div>
  {/if}
</BaseCard>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    align-items: center;
  }

  .stat-highlight {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-xl);
    background: var(--surface-tertiary);
    border-radius: var(--radius-lg);
    width: 100%;
  }

  .stat-value {
    font-size: var(--font-3xl);
    font-weight: 700;
    color: var(--accent-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .stat-note {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .stat-value {
      font-size: var(--font-2xl);
    }

    .stat-highlight {
      padding: var(--gap-lg);
    }
  }
</style>
