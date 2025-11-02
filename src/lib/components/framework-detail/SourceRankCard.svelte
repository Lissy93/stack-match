<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';

  export let packageName: string | undefined;

  interface LibrariesIOData {
    rank: number;
    stars: number;
    dependents_count: number;
    dependent_repos_count: number;
    latest_stable_release_published_at: string;
    contributions_count: number;
    latest_download_url: string;
    homepage: string;
  }

  let librariesData: LibrariesIOData | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    if (!packageName) {
      loading = false;
      error = 'No package name available';
      return;
    }

    try {
      const response = await fetch(`https://libraries.io/api/npm/${packageName}`);
      if (response.ok) {
        librariesData = await response.json();
      } else if (response.status === 404) {
        error = 'Package not found';
      } else {
        error = 'Unable to fetch SourceRank data';
      }
    } catch (e) {
      error = 'Unable to fetch SourceRank data';
      console.debug('Libraries.io fetch error:', e);
    } finally {
      loading = false;
    }
  });

  function getRankColor(rank: number): string {
    if (rank >= 25) return '#22c55e'; // Excellent
    if (rank >= 20) return '#84cc16'; // Very Good
    if (rank >= 15) return '#fbbf24'; // Good
    if (rank >= 10) return '#fb923c'; // Fair
    return '#ef4444'; // Needs Improvement
  }

  function getRankLabel(rank: number): string {
    if (rank >= 25) return 'Excellent';
    if (rank >= 20) return 'Very Good';
    if (rank >= 15) return 'Good';
    if (rank >= 10) return 'Fair';
    return 'Needs Improvement';
  }
</script>

<BaseCard title="SourceRank Quality Score">
  {#if loading}
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Loading quality metrics...</p>
    </div>
  {:else if error}
    <div class="no-data">
      <p>{error}</p>
    </div>
  {:else if librariesData}
    <div class="rank-display">
      <div class="rank-score" style="color: {getRankColor(librariesData.rank)}">
        {librariesData.rank}
      </div>
      <div class="rank-label" style="color: {getRankColor(librariesData.rank)}">
        {getRankLabel(librariesData.rank)}
      </div>
      <div class="rank-bar">
        <div
          class="rank-fill"
          style="width: {(librariesData.rank / 30) * 100}%; background-color: {getRankColor(librariesData.rank)}"
        ></div>
      </div>
    </div>

    <div class="metrics-list">
      <div class="metric-row">
        <span class="metric-label">Dependents</span>
        <span class="metric-value">{librariesData.dependents_count.toLocaleString()}</span>
      </div>

      <div class="metric-row">
        <span class="metric-label">Dependent Repositories</span>
        <span class="metric-value">{librariesData.dependent_repos_count.toLocaleString()}</span>
      </div>

      {#if librariesData.contributions_count}
        <div class="metric-row">
          <span class="metric-label">Contributors</span>
          <span class="metric-value">{librariesData.contributions_count.toLocaleString()}</span>
        </div>
      {/if}
    </div>
  {:else}
    <div class="no-data">
      <p>No quality score available</p>
    </div>
  {/if}
</BaseCard>

<style>

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    gap: var(--gap-md);
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-primary);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading p {
    margin: 0;
    color: var(--text-tertiary);
    font-size: var(--font-sm);
  }

  .rank-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-xl);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .rank-score {
    font-size: 64px;
    font-weight: 800;
    line-height: 1;
  }

  .rank-label {
    font-size: var(--font-lg);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .rank-bar {
    width: 100%;
    height: 12px;
    background: var(--surface-secondary);
    border-radius: var(--radius-full);
    overflow: hidden;
    border-radius: 6px;
  }

  .rank-fill {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width var(--transition-base);
  }

  .metrics-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-sm) 0;
    border-bottom: 1px solid var(--border-primary);
  }

  .metric-row:last-child {
    border-bottom: none;
  }

  .metric-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
  }

  .metric-value {
    font-size: var(--font-base);
    font-weight: 600;
    color: var(--text-primary);
  }





  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
  }

  .no-data p {
    margin: 0;
  }
</style>
