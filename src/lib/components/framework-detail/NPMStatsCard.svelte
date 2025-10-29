<script lang="ts">
  export let npm: any;

  function formatNumber(num: number | undefined): string {
    if (num === undefined) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  function getPackageAge(createdDate: string | undefined): string {
    if (!createdDate) return 'N/A';
    const created = new Date(createdDate);
    const now = new Date();
    const diffYears = now.getFullYear() - created.getFullYear();
    const diffMonths = now.getMonth() - created.getMonth();
    const totalMonths = diffYears * 12 + diffMonths;

    if (totalMonths < 12) return `${totalMonths} months`;
    if (diffYears === 1) return '1 year';
    return `${diffYears} years`;
  }

  function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function hasTypeScriptSupport(): boolean {
    // Check if package has types field or @types package
    if (!npm) return false;

    // Check for types or typings field in package.json
    if (npm.types || npm.typings) return true;

    // Check if package name starts with @types/
    if (npm.name?.startsWith('@types/')) return true;

    // Check if types are in dependencies
    const allDeps = [
      ...(npm.dependencies || []),
      ...(npm.devDependencies || []),
    ];

    return allDeps.some((dep: string) =>
      dep.startsWith('@types/') || dep === 'typescript'
    );
  }

  $: typeScriptSupport = hasTypeScriptSupport();
</script>

<div class="card npm-stats-card">
  <h3>NPM Statistics</h3>

  <div class="version-info">
    {#if npm?.version}
      <div class="version-badge">
        v{npm.version}
      </div>
    {/if}
    {#if npm?.versions?.beta}
      <div class="version-badge beta">
        beta: v{npm.versions.beta}
      </div>
    {/if}
  </div>

  <div class="stats-list">
    {#if npm?.downloads?.last_month}
      <div class="stat-row">
        <span class="stat-label">Monthly Downloads</span>
        <span class="stat-value primary">{formatNumber(npm.downloads.last_month)}</span>
      </div>
    {/if}

    {#if npm?.dependencies_count !== undefined}
      <div class="stat-row">
        <span class="stat-label">Dependencies</span>
        <span class="stat-value">{npm.dependencies_count}</span>
      </div>
    {/if}

    {#if npm?.maintainers && npm.maintainers.length > 0}
      <div class="stat-row">
        <span class="stat-label">Maintainers</span>
        <span class="stat-value">{npm.maintainers.length}</span>
      </div>
    {/if}

    {#if npm?.license}
      <div class="stat-row">
        <span class="stat-label">License</span>
        <span class="stat-value">{npm.license}</span>
      </div>
    {/if}

    {#if npm?.created}
      <div class="stat-row">
        <span class="stat-label">Package Age</span>
        <span class="stat-value" title="Created: {formatDate(npm.created)}">{getPackageAge(npm.created)}</span>
      </div>
    {/if}

    <div class="stat-row">
      <span class="stat-label">TypeScript Support</span>
      <span class="stat-value" class:has-support={typeScriptSupport} class:no-support={!typeScriptSupport}>
        {typeScriptSupport ? '✓ Yes' : '✗ No'}
      </span>
    </div>
  </div>

  {#if npm?.keywords && npm.keywords.length > 0}
    <div class="keywords">
      <span class="keywords-label">Keywords:</span>
      <div class="keywords-list">
        {#each npm.keywords.slice(0, 6) as keyword}
          <span class="keyword-tag">{keyword}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .npm-stats-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .version-info {
    display: flex;
    gap: var(--gap-sm);
    flex-wrap: wrap;
  }

  .version-badge {
    padding: var(--gap-sm) var(--gap-md);
    background: var(--accent-primary);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: var(--font-sm);
  }

  .version-badge.beta {
    background: var(--surface-tertiary);
    color: var(--text-secondary);
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-sm) 0;
    border-bottom: 1px solid var(--border-primary);
  }

  .stat-row:last-child {
    border-bottom: none;
  }

  .stat-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
  }

  .stat-value {
    font-size: var(--font-base);
    font-weight: 600;
    color: var(--text-primary);
  }

  .stat-value.primary {
    color: var(--accent-primary);
    font-size: var(--font-lg);
  }

  .keywords {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    padding-top: var(--gap-md);
    border-top: 1px solid var(--border-primary);
  }

  .keywords-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .keywords-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }

  .keyword-tag {
    padding: var(--gap-xs) var(--gap-sm);
    background: var(--surface-tertiary);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    font-size: var(--font-xs);
  }

  .has-support {
    color: #22c55e !important;
  }

  .no-support {
    color: #ef4444 !important;
  }
</style>
