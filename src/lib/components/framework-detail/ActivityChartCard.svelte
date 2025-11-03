<script lang="ts">
  import BaseCard from './BaseCard.svelte';
  import { Activity } from 'lucide-svelte';

  export let commitActivity: any[] | undefined;

  function formatWeekData(activity: any[]): { week: string; commits: number; percentage: number }[] {
    if (!activity || activity.length === 0) return [];

    const maxCommits = Math.max(...activity.map(w => w.total));

    return activity.slice(-12).map(week => {
      const date = new Date(week.week * 1000);
      return {
        week: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        commits: week.total,
        percentage: maxCommits > 0 ? (week.total / maxCommits) * 100 : 0
      };
    });
  }

  $: weekData = commitActivity ? formatWeekData(commitActivity) : [];
  $: totalCommits = commitActivity?.reduce((sum, w) => sum + w.total, 0) || 0;
  $: avgCommitsPerWeek = commitActivity ? Math.round(totalCommits / commitActivity.length) : 0;
</script>

<BaseCard title="Commit Activity" size="wide" icon={Activity}>
  {#if weekData.length > 0}
    <div class="activity-stats">
      <div class="stat">
        <span class="stat-value">{avgCommitsPerWeek}</span>
        <span class="stat-label">Avg commits/week</span>
      </div>
      <div class="stat">
        <span class="stat-value">{totalCommits.toLocaleString()}</span>
        <span class="stat-label">Total commits (52 weeks)</span>
      </div>
    </div>

    <div class="chart">
      {#each weekData as data}
        <div class="chart-bar-wrapper" title="{data.week}: {data.commits} commits">
          <div class="chart-bar" style="height: {data.percentage}%">
            <span class="chart-value">{data.commits}</span>
          </div>
          <span class="chart-label">{data.week}</span>
        </div>
      {/each}
    </div>
  {:else}
    <div class="no-data">
      <p>No commit activity data available</p>
    </div>
  {/if}
</BaseCard>

<style>

  .activity-stats {
    display: flex;
    gap: var(--gap-xl);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .stat-value {
    font-size: var(--font-2xl);
    font-weight: 700;
    color: var(--brand-color, var(--accent-primary));
  }

  .stat-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--gap-sm);
    height: 200px;
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .chart-bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
    position: relative;
  }

  .chart-bar {
    width: 100%;
    min-height: 4px;
    background: var(--brand-color, var(--accent-primary));
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    position: relative;
    transition: all var(--transition-normal);
    cursor: pointer;
    margin-bottom: var(--gap-md);
  }

  .chart-bar:hover {
    opacity: 0.8;
    transform: scaleY(1.05);
  }

  .chart-value {
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--font-xs);
    font-weight: 600;
    color: var(--text-secondary);
    opacity: 0;
    transition: opacity var(--transition-fast);
    white-space: nowrap;
  }

  .chart-bar:hover .chart-value {
    opacity: 1;
  }

  .chart-label {
    font-size: var(--font-2xs);
    color: var(--text-tertiary);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .activity-stats {
      flex-direction: column;
      gap: var(--gap-md);
    }

    .chart {
      height: 150px;
    }

    .chart-label {
      font-size: 0.6rem;
    }
  }
</style>
