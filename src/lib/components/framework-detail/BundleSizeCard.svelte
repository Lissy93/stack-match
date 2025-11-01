<script lang="ts">
  import BaseCard from './BaseCard.svelte';

  export let bundle: any;

  function formatBytes(bytes: number | undefined): string {
    if (bytes === undefined) return 'N/A';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  $: sizeClass = bundle?.gzip < 50000 ? 'size-excellent' :
                 bundle?.gzip < 150000 ? 'size-good' :
                 bundle?.gzip < 300000 ? 'size-fair' : 'size-large';
</script>

<BaseCard title="Bundle Size">
  {#if bundle?.gzip === undefined && bundle?.size === undefined && bundle?.dependency_count === undefined}
    <div class="no-data">
      <p>Bundle size data not available</p>
    </div>
  {:else}
    {#if bundle?.gzip !== undefined}
      <div class="size-display {sizeClass}">
        <div class="size-value">{formatBytes(bundle.gzip)}</div>
        <div class="size-label">Minified + Gzipped</div>
      </div>
    {/if}

    <div class="size-details">
      {#if bundle?.size !== undefined}
        <div class="size-item">
          <span class="size-item-label">Minified</span>
          <span class="size-item-value">{formatBytes(bundle.size)}</span>
        </div>
      {/if}

      {#if bundle?.dependency_count !== undefined}
        <div class="size-item">
          <span class="size-item-label">Dependencies</span>
          <span class="size-item-value">{bundle.dependency_count}</span>
        </div>
      {/if}
    </div>

    {#if bundle?.dependencies && bundle.dependencies.length > 0}
      <details class="dependencies-section">
        <summary>Top Dependencies ({bundle.dependencies.length})</summary>
        <ul class="dependencies-list">
          {#each bundle.dependencies.slice(0, 5) as dep}
            <li>
              <span class="dep-name">{dep.name}</span>
              <span class="dep-size">{formatBytes(dep.size)}</span>
            </li>
          {/each}
        </ul>
      </details>
    {/if}
  {/if}
</BaseCard>

<style>
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
    font-size: var(--font-sm);
  }

  .no-data p {
    margin: 0;
  }

  .size-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--gap-xl) var(--gap-lg);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .size-value {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .size-label {
    font-size: var(--font-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.8;
    margin-top: var(--gap-sm);
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

  .size-large {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
  }

  .size-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
  }

  .size-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .size-item-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .size-item-value {
    font-size: var(--font-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .dependencies-section {
    padding-top: var(--gap-md);
    border-top: 1px solid var(--border-primary);
  }

  .dependencies-section summary {
    cursor: pointer;
    font-size: var(--font-sm);
    color: var(--text-secondary);
    font-weight: 600;
    user-select: none;
    padding: var(--gap-sm);
  }

  .dependencies-section summary:hover {
    color: var(--accent-primary);
  }

  .dependencies-list {
    list-style: none;
    padding: 0;
    margin: var(--gap-md) 0 0;
  }

  .dependencies-list li {
    display: flex;
    justify-content: space-between;
    padding: var(--gap-sm);
    font-size: var(--font-sm);
    border-bottom: 1px solid var(--border-primary);
  }

  .dependencies-list li:last-child {
    border-bottom: none;
  }

  .dep-name {
    color: var(--text-secondary);
  }

  .dep-size {
    color: var(--text-primary);
    font-weight: 600;
  }
</style>
