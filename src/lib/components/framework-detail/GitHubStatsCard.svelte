<script lang="ts">
  import { formatNumber } from '$lib/utils';
  import BaseCard from './BaseCard.svelte';
  import { Star, GitFork, Eye, Bug, Github } from 'lucide-svelte';

  export let github: any;

  function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
</script>

<BaseCard title="GitHub Statistics" icon={Github}>

  <div class="stats-grid">
    <div class="stat-item stat-primary">
      <span class="stat-icon"><Star size={28} /></span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.stars)}</span>
        <span class="stat-label">Stars</span>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon"><GitFork size={28} /></span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.forks)}</span>
        <span class="stat-label">Forks</span>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon"><Eye size={28} /></span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.watchers)}</span>
        <span class="stat-label">Watchers</span>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon"><Bug size={28} /></span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.open_issues)}</span>
        <span class="stat-label">Issues</span>
      </div>
    </div>
  </div>

  {#if github?.releases?.latest_release}
    <div class="latest-release">
      <strong>Latest Release:</strong>
      <span>{github.releases.latest_release.tag_name}</span>
      <time>{formatDate(github.releases.latest_release.published_at)}</time>
    </div>
  {/if}

  {#if github?.created_at}
    <div class="dates">
      <div class="date-item">
        <span class="date-label">Created</span>
        <time>{formatDate(github.created_at)}</time>
      </div>
      {#if github?.pushed_at}
        <div class="date-item">
          <span class="date-label">Last Push</span>
          <time>{formatDate(github.pushed_at)}</time>
        </div>
      {/if}
    </div>
  {/if}

</BaseCard>

<style>

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    transition: transform var(--transition-fast);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--text-primary);
  }

  .stat-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .latest-release {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
  }

  .latest-release strong {
    color: var(--text-secondary);
  }

  .latest-release span {
    color: var(--accent-primary);
    font-weight: 600;
  }

  .latest-release time {
    color: var(--text-tertiary);
  }

  .dates {
    display: flex;
    gap: var(--gap-lg);
    padding-top: var(--gap-md);
    border-top: 1px solid var(--border-primary);
  }

  .date-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .date-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .date-item time {
    font-size: var(--font-sm);
    color: var(--text-primary);
    font-weight: 500;
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
