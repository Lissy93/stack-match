<script lang="ts">
  export let github: any;

  function formatNumber(num: number | undefined): string {
    if (num === undefined) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
</script>

<div class="card github-stats-card">
  <h3>GitHub Statistics</h3>

  <div class="stats-grid">
    <div class="stat-item stat-primary">
      <span class="stat-icon">⭐</span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.stars)}</span>
        <span class="stat-label">Stars</span>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon">🍴</span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.forks)}</span>
        <span class="stat-label">Forks</span>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon">👀</span>
      <div class="stat-content">
        <span class="stat-value">{formatNumber(github?.watchers)}</span>
        <span class="stat-label">Watchers</span>
      </div>
    </div>

    <div class="stat-item">
      <span class="stat-icon">🐛</span>
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
</div>

<style>
  .github-stats-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

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

  .stat-item:hover {
    transform: translateY(-2px);
  }

  .stat-primary {
    background: var(--accent-secondary);
  }

  .stat-icon {
    font-size: var(--font-2xl);
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
