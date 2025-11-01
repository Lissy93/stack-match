<script lang="ts">
  import { onMount } from 'svelte';

  export let repoFullName: string | undefined = undefined;
  export let repos: string[] | undefined = undefined;
  export let title: string = 'Star History';
  export let description: string | undefined = undefined;
  export let legend: string = 'top-left';

  // Use repos array if provided, otherwise fall back to single repoFullName
  $: reposList = repos || (repoFullName ? [repoFullName] : []);
  $: reposParam = reposList.join(',');

  $: chartUrl = reposParam
    ? `https://api.star-history.com/svg?repos=${reposParam}&type=Date&theme=dark&legend=${legend}`
    : null;

  $: starHistoryUrl = reposParam
    ? `https://star-history.com/#${reposParam}&Date`
    : null;

  let imageLoaded = false;
  let imageError = false;
  let imgElement: HTMLImageElement;

  function handleImageLoad() {
    imageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }

  // Check if image is already loaded (e.g., from cache)
  function checkImageLoaded() {
    if (imgElement && imgElement.complete && imgElement.naturalHeight !== 0) {
      imageLoaded = true;
    }
  }

  onMount(() => {
    checkImageLoaded();
  });

  // Also check when chartUrl changes
  $: if (chartUrl && imgElement) {
    // Reset state when URL changes
    imageLoaded = false;
    imageError = false;
    // Check after a brief delay to let the image start loading
    setTimeout(checkImageLoaded, 100);
  }
</script>

<div class="card card-large star-history-card">
  <div class="card-header">
    <div class="header-content">
      <h3>{title}</h3>
      {#if description}
        <p class="description">{description}</p>
      {/if}
    </div>
  </div>

  {#if reposList.length === 0}
    <div class="no-data">
      <p>No repository information available</p>
    </div>
  {:else if imageError}
    <div class="no-data">
      <p>Unable to load star history chart</p>
      {#if starHistoryUrl}
        <a href={starHistoryUrl} target="_blank" rel="noopener noreferrer" class="link">
          View star history on Star History →
        </a>
      {/if}
    </div>
  {:else}
    <div class="chart-container">
      {#if !imageLoaded}
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Loading star history...</p>
        </div>
      {/if}
      <img
        bind:this={imgElement}
        src={chartUrl}
        alt="GitHub star history for {reposParam}"
        class:loaded={imageLoaded}
        on:load={handleImageLoad}
        on:error={handleImageError}
      />
    </div>
  {/if}
</div>

<style>
  .star-history-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-md);
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .description {
    margin: 0;
    font-size: var(--font-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .chart-container {
    position: relative;
    min-height: 140px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    overflow: hidden;
    width: fit-content;
  }

  .chart-container img {
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    filter: brightness(1.36) saturate(2);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    margin-bottom: -8px;
    max-width: 48rem;
  }

  .chart-container img.loaded {
    opacity: 1;
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    gap: var(--gap-sm);
    color: var(--text-tertiary);
    font-style: italic;
  }

  .no-data p {
    margin: 0;
  }

  .link {
    color: var(--accent-primary);
    text-decoration: none;
    font-style: normal;
  }

  .link:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .chart-container {
      min-height: 300px;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
