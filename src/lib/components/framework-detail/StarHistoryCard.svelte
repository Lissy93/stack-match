<script lang="ts">
  export let repoFullName: string | undefined;
  export let brandColor: string | undefined = undefined;

  $: chartUrl = repoFullName
    ? `https://api.star-history.com/svg?repos=${repoFullName}&type=Date&theme=dark`
    : null;

  $: starHistoryUrl = repoFullName
    ? `https://star-history.com/#${repoFullName}&Date`
    : null;

  let imageLoaded = false;
  let imageError = false;

  function handleImageLoad() {
    imageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }
</script>

<div class="card card-large star-history-card">
  <div class="card-header">
    <h3>Star History</h3>
    {#if starHistoryUrl}
      <a
        href={starHistoryUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary btn-sm"
      >
        View on Star History
      </a>
    {/if}
  </div>

  {#if !repoFullName}
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
        src={chartUrl}
        alt="GitHub star history for {repoFullName}"
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

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .btn-sm {
    padding: var(--gap-sm) var(--gap-md);
    font-size: var(--font-sm);
  }

  .chart-container {
    position: relative;
    width: 100%;
    min-height: 400px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .chart-container img {
    display: none;
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
  }

  .chart-container img.loaded {
    display: block;
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
