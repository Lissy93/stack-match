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
  @import './shared-card-styles.css';
</style>
