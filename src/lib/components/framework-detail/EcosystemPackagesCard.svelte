<script lang="ts">
  import { Package as PackageIcon, Star } from 'lucide-svelte';

  export let ecosystem: any;

  interface Package {
    name: string;
    npm_url: string;
    description?: string;
    downloads?: number;
    stars?: number;
  }

  $: packages = ecosystem?.packages || [];

  function formatDownloads(downloads: number | undefined): string {
    if (!downloads) return 'N/A';
    if (downloads >= 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
    if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}K`;
    return downloads.toString();
  }
</script>

<div class="card card-wide ecosystem-packages-card">
  <h3>Ecosystem Packages</h3>

  {#if packages.length > 0}
    <div class="packages-grid">
      {#each packages as pkg}
        <a
          href={pkg.npm_url}
          target="_blank"
          rel="noopener noreferrer"
          class="package-item"
        >
          <div class="package-header">
            <h4>{pkg.name}</h4>
            <div class="package-stats">
              {#if pkg.downloads}
                <span class="stat" title="Monthly downloads">
                  <PackageIcon size={14} /> {formatDownloads(pkg.downloads)}
                </span>
              {/if}
              {#if pkg.stars}
                <span class="stat" title="GitHub stars">
                  <Star size={14} /> {pkg.stars.toLocaleString()}
                </span>
              {/if}
            </div>
          </div>
          {#if pkg.description}
            <p class="package-description">{pkg.description}</p>
          {/if}
        </a>
      {/each}
    </div>
  {:else}
    <div class="no-data">
      <p>No ecosystem package data available</p>
    </div>
  {/if}
</div>

<style>
  .ecosystem-packages-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--gap-md);
  }

  .package-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
  }

  .package-item:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .package-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-sm);
  }

  .package-item h4 {
    margin: 0;
    font-size: var(--font-base);
    color: var(--text-primary);
    font-weight: 600;
  }

  .package-stats {
    display: flex;
    gap: var(--gap-sm);
    flex-shrink: 0;
  }

  .stat {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .package-description {
    margin: 0;
    font-size: var(--font-sm);
    color: var(--text-secondary);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
    .packages-grid {
      grid-template-columns: 1fr;
    }

    .package-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
