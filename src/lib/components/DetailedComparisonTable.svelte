<script lang="ts">
  import CompactCardWrapper from '$lib/components/framework-detail/CompactCardWrapper.svelte';
  import GitHubStatsCard from '$lib/components/framework-detail/GitHubStatsCard.svelte';
  import NPMStatsCard from '$lib/components/framework-detail/NPMStatsCard.svelte';
  import BundleSizeCard from '$lib/components/framework-detail/BundleSizeCard.svelte';
  import SecurityCard from '$lib/components/framework-detail/SecurityCard.svelte';
  import SourceRankCard from '$lib/components/framework-detail/SourceRankCard.svelte';
  import EcosystemHealthCard from '$lib/components/framework-detail/EcosystemHealthCard.svelte';
  import JsDelivrStatsCard from '$lib/components/framework-detail/JsDelivrStatsCard.svelte';
  import StackOverflowCard from '$lib/components/framework-detail/StackOverflowCard.svelte';
  import ContributorsCard from '$lib/components/framework-detail/ContributorsCard.svelte';
  import ExampleProjectCard from '$lib/components/framework-detail/ExampleProjectCard.svelte';
  import LicenseCard from '$lib/components/framework-detail/LicenseCard.svelte';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';
  import { X, Globe, Github, Package, Sparkles } from 'lucide-svelte';

  export let frameworks: any[] = [];
  export let onRemoveFramework: (id: string) => void = () => {};

  let expandedLicenses: Set<string> = new Set();
  let topScrollContainer: HTMLElement;
  let bottomScrollContainer: HTMLElement;

  function syncScroll(source: HTMLElement, target: HTMLElement) {
    return (e: Event) => {
      target.scrollLeft = source.scrollLeft;
    };
  }

  $: if (topScrollContainer && bottomScrollContainer) {
    const topHandler = syncScroll(topScrollContainer, bottomScrollContainer);
    const bottomHandler = syncScroll(bottomScrollContainer, topScrollContainer);

    topScrollContainer.addEventListener('scroll', topHandler);
    bottomScrollContainer.addEventListener('scroll', bottomHandler);
  }

  function toggleLicense(frameworkId: string) {
    const newExpanded = new Set(expandedLicenses);
    if (newExpanded.has(frameworkId)) {
      newExpanded.delete(frameworkId);
    } else {
      newExpanded.add(frameworkId);
    }
    expandedLicenses = newExpanded;
  }
</script>

<div class="comparison-grid-wrapper">
  <!-- Top scrollbar -->
  <div class="comparison-grid-container top-scroll" bind:this={topScrollContainer}>
    <div class="scroll-content" style="--cols: {frameworks.length + 1};"></div>
  </div>

  <!-- Main content -->
  <div class="comparison-grid-container main-scroll" bind:this={bottomScrollContainer}>
    <div class="comparison-grid" style="--cols: {frameworks.length + 1};">
    <!-- Header Row -->
    <div class="grid-header"></div>
    {#each frameworks as framework}
      <div class="grid-header framework-header">
        <div class="framework-header-content">
          <a href="/{framework.id}" class="framework-info">
            <img
              src={getSimpleIconUrl(framework.metadata?.branding?.iconName || framework.id, '#ffffff')}
              alt="{framework.metadata?.name} icon"
              class="framework-icon"
            />
            <h3>{framework.metadata?.name || framework.id}</h3>
          </a>
          <button
            type="button"
            class="remove-btn"
            on:click={() => onRemoveFramework(framework.id)}
            aria-label="Remove {framework.metadata?.name} from comparison"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    {/each}

    <!-- GitHub Statistics -->
    <div class="row-label">GitHub Stats</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        {#if framework.github}
          <CompactCardWrapper>
            <GitHubStatsCard github={framework.github} />
          </CompactCardWrapper>
        {:else}
          <div class="no-data-cell">No data</div>
        {/if}
      </div>
    {/each}

    <!-- NPM Statistics -->
    <div class="row-label">NPM Stats</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        {#if framework.npm}
          <CompactCardWrapper>
            <NPMStatsCard npm={framework.npm} />
          </CompactCardWrapper>
        {:else}
          <div class="no-data-cell">No data</div>
        {/if}
      </div>
    {/each}

    <!-- Bundle Size -->
    <div class="row-label">Bundle Size</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        {#if framework.bundle}
          <CompactCardWrapper>
            <BundleSizeCard bundle={framework.bundle} />
          </CompactCardWrapper>
        {:else}
          <div class="no-data-cell">No data</div>
        {/if}
      </div>
    {/each}

    <!-- Security -->
    <div class="row-label">Security</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        {#if framework.security}
          <CompactCardWrapper>
            <SecurityCard security={framework.security} />
          </CompactCardWrapper>
        {:else}
          <div class="no-data-cell">No data</div>
        {/if}
      </div>
    {/each}

    <!-- SourceRank Quality Score -->
    <div class="row-label">Community Score</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        <CompactCardWrapper>
          <SourceRankCard packageName={framework.npm?.name} />
        </CompactCardWrapper>
      </div>
    {/each}

    <!-- Ecosystem Health -->
    <div class="row-label">Ecosystem Health</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        {#if framework.ecosystem}
          <CompactCardWrapper>
            <EcosystemHealthCard ecosystem={framework.ecosystem} lastUpdated={framework.last_updated || ''} />
          </CompactCardWrapper>
        {:else}
          <div class="no-data-cell">No data</div>
        {/if}
      </div>
    {/each}

    <!-- CDN Usage -->
    <div class="row-label">CDN Usage</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        <CompactCardWrapper>
          <JsDelivrStatsCard packageName={framework.npm?.name} />
        </CompactCardWrapper>
      </div>
    {/each}

    <!-- Stack Overflow Activity -->
    <div class="row-label">Stack Overflow</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        <CompactCardWrapper>
          <StackOverflowCard tag={framework.metadata?.stackoverflow_tag || framework.id} />
        </CompactCardWrapper>
      </div>
    {/each}

    <!-- Contributors -->
    <div class="row-label">Contributors</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        <CompactCardWrapper>
          <ContributorsCard frameworkId={framework.id} small={true} />
        </CompactCardWrapper>
      </div>
    {/each}

    <!-- Example Project -->
    <div class="row-label">Example Project</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        <CompactCardWrapper>
          <ExampleProjectCard frameworkId={framework.id} small={true} />
        </CompactCardWrapper>
      </div>
    {/each}

    <!-- License -->
    <div class="row-label">License</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        {#if expandedLicenses.has(framework.id)}
          <CompactCardWrapper>
            <LicenseCard license={framework.github?.license} />
          </CompactCardWrapper>
          <button
            class="collapse-btn"
            on:click={() => toggleLicense(framework.id)}
            aria-label="Collapse license details"
          >
            � Collapse
          </button>
        {:else}
          <button
            class="license-text-btn"
            on:click={() => toggleLicense(framework.id)}
            aria-label="Expand license details"
          >
            {framework.github?.license?.name || framework.npm?.license || 'N/A'}
          </button>
        {/if}
      </div>
    {/each}

    <!-- Links -->
    <div class="row-label">Links</div>
    {#each frameworks as framework}
      <div class="grid-cell">
        <div class="cell-content links-cell">
          {#if framework.metadata?.links?.website}
            <a href={framework.metadata.links.website} target="_blank" rel="noopener noreferrer" class="link-btn">
              <Globe size={16} /> Website
            </a>
          {/if}
          {#if framework.metadata?.links?.github}
            <a href={framework.metadata.links.github} target="_blank" rel="noopener noreferrer" class="link-btn">
              <Github size={16} /> GitHub
            </a>
          {/if}
          {#if framework.npm?.name}
            <a href="https://www.npmjs.com/package/{framework.npm.name}" target="_blank" rel="noopener noreferrer" class="link-btn">
              <Package size={16} /> npm
            </a>
          {/if}
          <a href="/{framework.id}" class="link-btn primary">
            <Sparkles size={16} /> View Full Details �
          </a>
        </div>
      </div>
    {/each}
  </div>
  </div>
</div>

<style>
  .comparison-grid-wrapper {
    position: relative;
  }

  .comparison-grid-container {
    overflow-x: auto;
    overflow-y: hidden;
  }

  .comparison-grid-container.top-scroll {
    height: 20px;
    margin-bottom: var(--gap-md);
  }

  .comparison-grid-container.main-scroll {
    margin-bottom: var(--gap-2xl);
  }

  .scroll-content {
    height: 1px;
    width: calc(150px + (var(--cols) - 1) * 250px);
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 150px repeat(calc(var(--cols) - 1), minmax(250px, 1fr));
    gap: 1px;
    background: var(--border-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    min-width: min-content;
  }

  .grid-header {
    background: var(--surface-secondary);
    padding: var(--gap-lg);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .framework-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-sm);
    text-align: center;
  }

  .framework-header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-sm);
    width: 100%;
  }

  .framework-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-sm);
    text-decoration: none;
    color: inherit;
    transition: opacity 0.2s ease;
  }

  .framework-info:hover {
    opacity: 0.8;
  }

  .framework-info:hover h3 {
    text-decoration: underline;
  }

  .framework-icon {
    width: auto;
    height: 24px;
    object-fit: contain;
  }

  .framework-header h3 {
    margin: 0;
    font-size: var(--font-base);
  }

  .remove-btn {
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: var(--gap-xs);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
  }

  .row-label {
    background: var(--surface-secondary);
    padding: var(--gap-lg);
    font-weight: 600;
    display: flex;
    align-items: center;
    position: sticky;
    left: 0;
    z-index: 9;
  }

  /* First cell in header row - sticky on both axes */
  .grid-header:first-child {
    z-index: 11;
  }

  .grid-cell {
    background: var(--surface-primary);
    padding: var(--gap-md);
    min-height: 80px;
  }

  .cell-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    height: 100%;
  }

  .no-data-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-tertiary);
    font-style: italic;
    font-size: var(--font-sm);
  }

  .links-cell {
    gap: var(--gap-xs);
  }

  .link-btn {
    display: inline-block;
    padding: var(--gap-xs) var(--gap-sm);
    background: var(--surface-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text-primary);
    font-size: var(--font-xs);
    text-align: center;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    justify-content: center;
  }

  .link-btn:hover {
    background: var(--surface-secondary);
    border-color: var(--accent-primary);
  }

  .link-btn.primary {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
    font-weight: 600;
  }

  .license-text-btn {
    width: 100%;
    padding: var(--gap-md);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: var(--font-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .license-text-btn:hover {
    background: var(--surface-tertiary);
    transform: translateY(-1px);
  }

  .collapse-btn {
    width: 100%;
    padding: var(--gap-sm);
    margin-top: var(--gap-sm);
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--font-xs);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
  }

  :global(.license-section li) {
    padding-left: 1rem !important;
  }

  @media (max-width: 768px) {
    .comparison-grid {
      grid-template-columns: 120px repeat(calc(var(--cols) - 1), minmax(200px, 1fr));
    }

    .scroll-content {
      width: calc(120px + (var(--cols) - 1) * 200px);
    }
  }
</style>
