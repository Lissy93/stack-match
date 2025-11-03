<script lang="ts">
  import BaseCard from './BaseCard.svelte';

  export let metadata: any;
  export let ecosystem: any;
  export let github: any;
  export let npm: any = undefined;
  export let bundle: any = undefined;
  export let security: any = undefined;
  export const brandColor: string = '#3b82f6';

  $: healthClass = ecosystem?.overall_health >= 75 ? 'health-excellent' :
                   ecosystem?.overall_health >= 50 ? 'health-good' :
                   ecosystem?.overall_health >= 25 ? 'health-fair' : 'health-poor';

  // Helper functions for formatting
  function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  function formatBytes(bytes: number): string {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  }

  function getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function formatDaysAgo(days: number): string {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  function getBundleSizeClass(bytes: number): string {
    if (bytes < 50 * 1024) return 'size-excellent'; // < 50KB
    if (bytes < 200 * 1024) return 'size-good'; // < 200KB
    if (bytes < 500 * 1024) return 'size-fair'; // < 500KB
    return 'size-poor'; // >= 500KB
  }

  $: bundleSizeClass = bundle?.gzip ? getBundleSizeClass(bundle.gzip) : '';
  $: lastPushDays = github?.pushed_at ? getDaysSince(github.pushed_at) : null;
  $: totalVulnerabilities = security?.vulnerabilities ?
    (security.vulnerabilities.critical || 0) +
    (security.vulnerabilities.high || 0) +
    (security.vulnerabilities.moderate || 0) +
    (security.vulnerabilities.low || 0) : null;
</script>

<BaseCard size="large" headerSlot={true}>
  <svelte:fragment slot="header">
    <h2>Overview</h2>
    {#if ecosystem?.overall_health !== undefined}
      <div class="health-badge {healthClass}">
        <span class="health-score">{ecosystem.overall_health}%</span>
        <span class="health-label">Health</span>
      </div>
    {/if}
  </svelte:fragment>

  <div class="overview-content">
    <!-- {#if metadata?.branding?.logo}
      <div class="framework-logo" style="border-color: {brandColor}">
        <img
          src={metadata.branding.logo}
          alt="{metadata.name} logo"
        />
      </div>
    {/if}

    {#if metadata?.description}
      <p class="description">{metadata.description}</p>
    {/if}

    {#if metadata?.longDescription}
      <p class="long-description">{metadata.longDescription}</p>
    {/if} -->

    <div class="meta-grid">
      {#if metadata?.category}
        <div class="meta-item">
          <span class="meta-label">Category</span>
          <span class="meta-value">{metadata.category}</span>
        </div>
      {/if}

      {#if metadata?.type}
        <div class="meta-item">
          <span class="meta-label">Type</span>
          <span class="meta-value">{metadata.type.toUpperCase()}</span>
        </div>
      {/if}

      {#if github?.license?.name}
        <div class="meta-item">
          <span class="meta-label">License</span>
          <span class="meta-value">{github.license.name}</span>
        </div>
      {/if}

      {#if github?.language}
        <div class="meta-item">
          <span class="meta-label">Language</span>
          <span class="meta-value">{github.language}</span>
        </div>
      {/if}

      {#if npm?.version}
        <div class="meta-item">
          <span class="meta-label">NPM Version</span>
          <span class="meta-value version-badge">{npm.version}</span>
        </div>
      {/if}

      {#if npm?.downloads?.weekly}
        <div class="meta-item">
          <span class="meta-label">Weekly Downloads</span>
          <span class="meta-value">{formatNumber(npm.downloads.weekly)}</span>
        </div>
      {/if}

      {#if github?.stars}
        <div class="meta-item">
          <span class="meta-label">GitHub Stars</span>
          <span class="meta-value star-count">⭐ {formatNumber(github.stars)}</span>
        </div>
      {/if}

      {#if github?.forks}
        <div class="meta-item">
          <span class="meta-label">Forks</span>
          <span class="meta-value">{formatNumber(github.forks)}</span>
        </div>
      {/if}

      {#if lastPushDays !== null}
        <div class="meta-item">
          <span class="meta-label">Last Updated</span>
          <span class="meta-value activity-indicator" class:recent={lastPushDays < 30}>
            {formatDaysAgo(lastPushDays)}
          </span>
        </div>
      {/if}

      {#if bundle?.gzip}
        <div class="meta-item">
          <span class="meta-label">Bundle Size</span>
          <span class="meta-value size-badge {bundleSizeClass}">
            {formatBytes(bundle.gzip)} (gzip)
          </span>
        </div>
      {/if}

      {#if totalVulnerabilities !== null}
        <div class="meta-item">
          <span class="meta-label">Vulnerabilities</span>
          <span class="meta-value vuln-badge" class:safe={totalVulnerabilities === 0}>
            {totalVulnerabilities === 0 ? '✓ None' : totalVulnerabilities}
          </span>
        </div>
      {/if}

      {#if npm?.dependencies?.total !== undefined}
        <div class="meta-item">
          <span class="meta-label">Dependencies</span>
          <span class="meta-value">{npm.dependencies.total}</span>
        </div>
      {/if}

      {#if github?.latest_release}
        <div class="meta-item">
          <span class="meta-label">Latest Release</span>
          <span class="meta-value release-info">
            {github.latest_release.tag_name}
            <span class="release-date">
              ({formatDaysAgo(getDaysSince(github.latest_release.published_at))})
            </span>
          </span>
        </div>
      {/if}
    </div>

    {#if github?.topics && github.topics.length > 0}
      <div class="topics">
        {#each github.topics.slice(0, 8) as topic}
          <span class="topic-tag">{topic}</span>
        {/each}
      </div>
    {/if}
  </div>

</BaseCard>

<style>

  .health-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--gap-sm) var(--gap-md);
    border-radius: var(--radius-md);
    min-width: 80px;
  }

  .health-score {
    font-size: var(--font-xl);
    font-weight: 700;
  }

  .health-label {
    font-size: var(--font-xs);
    text-transform: uppercase;
    opacity: 0.8;
  }

  .health-excellent {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .health-good {
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-primary);
  }

  .health-fair {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  .health-poor {
    background: rgba(239, 68, 68, 0.15);
    color: var(--text-danger);
  }

  .overview-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .framework-logo {
    display: flex;
    justify-content: center;
    margin-bottom: var(--gap-md);
  }


  .description {
    color: var(--text-secondary);
    font-size: var(--font-base);
    line-height: 1.6;
  }

  .long-description {
    color: var(--text-tertiary);
    font-size: var(--font-sm);
    line-height: 1.6;
    font-style: italic;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--gap-md);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .meta-label {
    font-size: var(--font-xs);
    text-transform: uppercase;
    color: var(--text-tertiary);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .meta-value {
    font-size: var(--font-base);
    color: var(--text-primary);
    font-weight: 500;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
  }

  .topic-tag {
    padding: var(--gap-xs) var(--gap-sm);
    background: var(--brand-color-rgba, var(--accent-secondary));
    color: var(--brand-color, var(--accent-primary));
    border-radius: var(--radius-sm);
    font-size: var(--font-xs);
    font-weight: 500;
    border: 1px solid transparent;
  }

  .topic-tag:hover {
    border-color: var(--brand-color, var(--accent-primary));
  }

  /* New badge styles */
  .version-badge {
    font-family: 'Monaco', 'Courier New', monospace;
    background: var(--surface-tertiary);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: var(--font-sm);
  }

  .star-count {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .activity-indicator.recent {
    color: #22c55e;
    font-weight: 600;
  }

  .size-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: var(--font-sm);
  }

  .size-excellent {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .size-good {
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-primary);
  }

  .size-fair {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  .size-poor {
    background: rgba(239, 68, 68, 0.15);
    color: var(--text-danger);
  }

  .vuln-badge.safe {
    color: #22c55e;
    font-weight: 600;
  }

  .vuln-badge:not(.safe) {
    color: var(--text-danger);
    font-weight: 600;
  }

  .release-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .release-date {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    font-weight: 400;
  }

  @media (max-width: 768px) {
    .meta-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
