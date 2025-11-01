<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import NoData from './NoData.svelte';
  import { formatNumber } from '$lib/utils';
  import type { StackOverflowData } from '$lib/types';

  export let tag: string | undefined;

  let loading = true;
  let error = false;
  let data: StackOverflowData | null = null;

  onMount(async () => {
    if (!tag) {
      loading = false;
      return;
    }

    try {
      const response = await fetch(`/api/stackoverflow/${encodeURIComponent(tag)}`);
      if (response.ok) {
        data = await response.json();
      } else {
        error = true;
      }
    } catch (err) {
      console.error('Failed to fetch Stack Overflow data:', err);
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

<BaseCard title="Stack Overflow Activity">
  {#if !tag}
    <NoData>No tag information available</NoData>
  {:else if loading}
    <LoadingSpinner>Loading community activity...</LoadingSpinner>
  {:else if error || !data}
    <NoData>Unable to load Stack Overflow data</NoData>
  {:else}
    <div class="content">
      <div class="stat-highlight">
        <div class="stat-value">{formatNumber(data.count)}</div>
        <div class="stat-label">Questions Tagged</div>
      </div>

      <a
        href="https://stackoverflow.com/questions/tagged/{encodeURIComponent(tag)}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
        aria-label="View {tag} questions on Stack Overflow"
      >
        View Questions →
      </a>
    </div>
  {/if}
</BaseCard>

<style>
  @import './shared-card-styles.css';
</style>
