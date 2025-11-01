<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';

  export let packageName: string | undefined;

  let loading = true;
  let error = false;
  let data: { last30Days: number; total: number; rank: number; packageName: string } | null = null;

  function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  }

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

<BaseCard title="CDN Usage" size="medium">
  {#if !packageName}
    <div class="no-data">
      <p>No package information available</p>
    </div>
  {:else if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading CDN stats...</p>
    </div>
  {:else if error || !data}
    <div class="no-data">
      <p>Unable to load CDN data</p>
    </div>
  {:else}
    <div class="content">
      <div class="stat-highlight">
        <div class="stat-value">{formatNumber(data.last30Days)}</div>
        <div class="stat-label">Hits Last 30 Days</div>
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
  }

  .stat-note {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    font-style: italic;
  }

  .btn {
    padding: var(--gap-xs) var(--gap-md);
    width: fit-content;
    margin: 0 auto;
    font-size: var(--font-xs);
    color: var(--text-secondary);
    background: transparent;
    border: none;
    text-decoration: none;
    font-weight: 500;
    transition: all var(--transition-normal);
  }

  .btn:hover {
    color: var(--accent-primary);
    transform: translateX(2px);
  }

  .loading, .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    gap: var(--gap-md);
    color: var(--text-tertiary);
    min-height: 150px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-primary);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .no-data p {
    margin: 0;
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
