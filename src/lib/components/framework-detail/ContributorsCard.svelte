<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';
  import { Users } from 'lucide-svelte';

  export let contributors: any = undefined;
  export let frameworkId: string | undefined = undefined;
  export let small: boolean = false;

  let loading = false;
  let fetchedContributors: any = null;

  // If contributors is not provided but frameworkId is, fetch the data
  onMount(async () => {
    if (!contributors && frameworkId) {
      loading = true;
      try {
        const response = await fetch(`/api/framework/${frameworkId}`);
        if (response.ok) {
          const data = await response.json();
          fetchedContributors = data.github?.contributors;
        }
      } catch (error) {
        console.error('Failed to fetch contributors:', error);
      } finally {
        loading = false;
      }
    }
  });

  $: actualContributors = contributors || fetchedContributors;
  $: topContributors = actualContributors?.top_contributors || [];
  $: totalContributors = actualContributors?.total_contributors || 0;
  $: totalCommits = actualContributors?.total_commits || 0;

  function getContributionPercentage(contributions: number): number {
    if (totalCommits === 0) return 0;
    return (contributions / totalCommits) * 100;
  }

  function getPercentageColor(percentage: number): string {
    if (percentage >= 50) return '#ef4444'; // High concentration - red
    if (percentage >= 30) return '#fbbf24'; // Medium concentration - yellow
    return '#22c55e'; // Good distribution - green
  }
</script>

<BaseCard title="Contributors">
  {#if loading}
    <div class="loading">Loading contributors...</div>
  {:else if small}
    <!-- Small mode: only show total contributors stat -->
    {#if totalContributors > 0}
      <div class="stat-highlight">
        <div class="stat-value">{totalContributors.toLocaleString()}</div>
        <div class="stat-label">
          <Users size={16} />
          Contributors
        </div>
      </div>
    {:else}
      <div class="no-data">
        <p>No contributor data available</p>
      </div>
    {/if}
  {:else}
    <!-- Full mode: show total + top contributors -->
    {#if totalContributors > 0}
      <div class="stat-highlight">
        <div class="stat-value">{totalContributors.toLocaleString()}</div>
        <div class="stat-label">
          <Users size={16} />
          Total Contributors
        </div>
      </div>
    {/if}

    {#if topContributors.length > 0}
      <div class="contributors-list">
        <h4>Top Contributors</h4>
        {#each topContributors as contributor}
          {@const percentage = getContributionPercentage(contributor.contributions)}
          {@const percentageColor = getPercentageColor(percentage)}
          <a
            href="https://github.com/{contributor.login}"
            target="_blank"
            rel="noopener noreferrer"
            class="contributor-item"
          >
            <div class="contributor-content">
              <img
                src={contributor.avatar_url}
                alt="{contributor.login}'s avatar"
                class="contributor-avatar"
                loading="lazy"
              />
              <div class="contributor-info">
                <span class="contributor-name">{contributor.login}</span>
                <span class="contributor-commits">
                  {contributor.contributions.toLocaleString()} commits · {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div class="contribution-bar">
              <div
                class="contribution-fill"
                style="width: {percentage}%; background-color: {percentageColor}"
              ></div>
            </div>
          </a>
        {/each}
      </div>
    {:else if !totalContributors}
      <div class="no-data">
        <p>No contributor data available</p>
      </div>
    {/if}
  {/if}
</BaseCard>

<style>

  h4 {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--gap-sm) 0;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
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

  .contributors-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    margin-top: var(--gap-lg);
  }

  .contributor-item {
    display: flex;
    flex-direction: column;
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    text-decoration: none;
    color: inherit;
    gap: var(--gap-sm);
    overflow: hidden;
  }

  .contributor-item:hover {
    background: var(--accent-secondary);
    transform: translateX(4px);
  }

  .contributor-content {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
  }

  .contributor-avatar {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 50%;
    border: 2px solid var(--border-secondary);
  }

  .contributor-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    flex: 1;
  }

  .contributor-name {
    font-size: var(--font-base);
    font-weight: 600;
    color: var(--text-primary);
  }

  .contributor-commits {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
  }

  .contribution-bar {
    width: 100%;
    height: 4px;
    background: var(--surface-primary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .contribution-fill {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width 0.8s ease;
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
  }
</style>
