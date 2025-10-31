<script lang="ts">
  import BaseCard from './BaseCard.svelte';

  export let metadata: any;
  export let ecosystem: any;
  export let github: any;
  export let brandColor: string = '#3b82f6';

  $: healthClass = ecosystem?.overall_health >= 75 ? 'health-excellent' :
                   ecosystem?.overall_health >= 50 ? 'health-good' :
                   ecosystem?.overall_health >= 25 ? 'health-fair' : 'health-poor';
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
    {#if metadata?.branding?.logo}
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
    {/if}

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

  .framework-logo img {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-lg);
    border: 3px solid;
    padding: var(--gap-sm);
    background: var(--surface-tertiary);
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

  @media (max-width: 768px) {
    .meta-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
