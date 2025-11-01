<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { FrameworkMeta } from '$lib/types';
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
  import StarHistoryCard from '$lib/components/framework-detail/StarHistoryCard.svelte';
  import ExampleProjectCard from '$lib/components/framework-detail/ExampleProjectCard.svelte';
  import LicenseCard from '$lib/components/framework-detail/LicenseCard.svelte';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';

  export let data;

  let availableFrameworks: FrameworkMeta[] = (data.frameworks || []).filter(f => f.id !== 'vanilla');
  let selectedFrameworks: string[] = [];
  let comparisonData: any[] = [];
  let loading = false;
  let expandedLicenses: Set<string> = new Set();

  // Parse URL params or use localStorage/defaults
  onMount(() => {
    const urlParams = $page.url.searchParams.get('frameworks');

    if (urlParams) {
      // Use URL params
      selectedFrameworks = urlParams.split(',').filter(f => f.trim());
    } else {
      // Try localStorage
      const storedShortlist = localStorage.getItem('stack-match-shortlist');
      if (storedShortlist) {
        try {
          const parsed = JSON.parse(storedShortlist);
          selectedFrameworks = parsed.map((f: any) => f.id || f);
        } catch (e) {
          console.error('Failed to parse shortlist:', e);
        }
      }
    }

    // Default to React, Vue, Angular, Svelte if nothing selected
    if (selectedFrameworks.length === 0) {
      selectedFrameworks = ['react', 'vue', 'angular', 'svelte'];
    }

    // Limit to valid frameworks
    selectedFrameworks = selectedFrameworks
      .filter(id => availableFrameworks.some(f => f.id === id))
      .slice(0, 6);

    loadComparisonData();
  });

  async function loadComparisonData() {
    if (selectedFrameworks.length === 0) return;

    loading = true;
    try {
      const promises = selectedFrameworks.map(id =>
        fetch(`/api/framework/${id}`).then(r => r.json())
      );
      comparisonData = await Promise.all(promises);
    } catch (error) {
      console.error('Failed to load comparison data:', error);
    } finally {
      loading = false;
    }
  }

  function toggleFramework(frameworkId: string) {
    const index = selectedFrameworks.indexOf(frameworkId);
    if (index > -1) {
      if (selectedFrameworks.length > 2) {
        selectedFrameworks = selectedFrameworks.filter(id => id !== frameworkId);
      }
    } else {
      if (selectedFrameworks.length < 6) {
        selectedFrameworks = [...selectedFrameworks, frameworkId];
      }
    }
    updateURL();
    loadComparisonData();
  }

  function updateURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('frameworks', selectedFrameworks.join(','));
    goto(url.pathname + url.search, { replaceState: true, noScroll: true });
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

  $: npmPackages = comparisonData
    .map(d => d.npm?.name)
    .filter(Boolean)
    .join(',');

  $: npmChartsUrl = npmPackages ? `https://www.npmcharts.com/compare/${npmPackages}?minimal=true` : null;

  // Extract GitHub repos for star history
  $: githubRepos = comparisonData
    .map(d => {
      const githubUrl = d.metadata?.links?.github;
      const repoMatch = githubUrl?.match(/github\.com\/([^\/]+\/[^\/]+)/);
      return repoMatch?.[1];
    })
    .filter(Boolean);
</script>

<svelte:head>
  <title>Compare Frameworks - Stack Match</title>
  <meta name="description" content="Compare JavaScript frameworks side by side" />
</svelte:head>

<div class="compare-page">
  <div class="page-header">
    <h1>Framework Comparison</h1>
    <p class="subtitle">Compare frameworks side by side</p>
  </div>

  <!-- Framework Selector -->
  <div class="framework-selector">
    <h2>Select Frameworks ({selectedFrameworks.length}/6)</h2>
    <div class="framework-chips">
      {#each availableFrameworks as framework}
        {@const isSelected = selectedFrameworks.includes(framework.id)}
        {@const canToggle = isSelected ? selectedFrameworks.length > 2 : selectedFrameworks.length < 6}
        <button
          class="framework-chip"
          class:selected={isSelected}
          class:disabled={!canToggle}
          style="--brand-color: {framework.branding.color}"
          on:click={() => canToggle && toggleFramework(framework.id)}
          disabled={!canToggle}
        >
          <img
            src={getSimpleIconUrl(framework.branding.iconName, framework.branding.color)}
            alt={framework.name || framework.id}
            class="chip-logo"
          />
          <span>{framework.name || framework.id}</span>
          {#if isSelected}
            <span class="check-icon">✓</span>
          {/if}
        </button>
      {/each}
    </div>
    <p class="selector-hint">Select 2-6 frameworks to compare</p>
  </div>

  {#if loading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading comparison data...</p>
    </div>
  {:else if comparisonData.length > 0}
    <!-- Comparison Grid -->
    <div class="comparison-grid-container">
      <div class="comparison-grid" style="--cols: {selectedFrameworks.length + 1};">
        <!-- Header Row -->
        <div class="grid-header"></div>
        {#each comparisonData as framework}
          <div class="grid-header framework-header">
            {#if framework.metadata?.logo}
              <img src={framework.metadata.logo} alt={framework.metadata?.name} class="framework-logo" />
            {/if}
            <h3>{framework.metadata?.name || framework.id}</h3>
          </div>
        {/each}

        <!-- GitHub Statistics -->
        <div class="row-label">GitHub Stats</div>
        {#each comparisonData as framework}
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
        {#each comparisonData as framework}
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
        {#each comparisonData as framework}
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
        {#each comparisonData as framework}
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
        {#each comparisonData as framework}
          <div class="grid-cell">
            <CompactCardWrapper>
              <SourceRankCard packageName={framework.npm?.name} />
            </CompactCardWrapper>
          </div>
        {/each}

        <!-- Ecosystem Health -->
        <div class="row-label">Ecosystem Health</div>
        {#each comparisonData as framework}
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
        {#each comparisonData as framework}
          <div class="grid-cell">
            <CompactCardWrapper>
              <JsDelivrStatsCard packageName={framework.npm?.name} />
            </CompactCardWrapper>
          </div>
        {/each}

        <!-- Stack Overflow Activity -->
        <div class="row-label">Stack Overflow</div>
        {#each comparisonData as framework}
          <div class="grid-cell">
            <CompactCardWrapper>
              <StackOverflowCard tag={framework.metadata?.stackoverflow_tag || framework.id} />
            </CompactCardWrapper>
          </div>
        {/each}

        <!-- Contributors -->
        <div class="row-label">Contributors</div>
        {#each comparisonData as framework}
          <div class="grid-cell">
            <CompactCardWrapper>
              <ContributorsCard frameworkId={framework.id} small={true} />
            </CompactCardWrapper>
          </div>
        {/each}

        <!-- Example Project -->
        <div class="row-label">Example Project</div>
        {#each comparisonData as framework}
          <div class="grid-cell">
            <CompactCardWrapper>
              <ExampleProjectCard frameworkId={framework.id} small={true} />
            </CompactCardWrapper>
          </div>
        {/each}

        <!-- License -->
        <div class="row-label">License</div>
        {#each comparisonData as framework}
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
                ▲ Collapse
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
        {#each comparisonData as framework}
          <div class="grid-cell">
            <div class="cell-content links-cell">
              {#if framework.metadata?.links?.website}
                <a href={framework.metadata.links.website} target="_blank" rel="noopener noreferrer" class="link-btn">
                  🌐 Website
                </a>
              {/if}
              {#if framework.metadata?.links?.github}
                <a href={framework.metadata.links.github} target="_blank" rel="noopener noreferrer" class="link-btn">
                  💻 GitHub
                </a>
              {/if}
              {#if framework.npm?.name}
                <a href="https://www.npmjs.com/package/{framework.npm.name}" target="_blank" rel="noopener noreferrer" class="link-btn">
                  📦 npm
                </a>
              {/if}
              <a href="/{framework.id}" class="link-btn primary">
                View Details →
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Comparison Charts -->
    <div class="comparison-charts">
      <!-- NPM Downloads -->
      {#if npmChartsUrl}
        <div class="chart-card card">
          <div class="card-header">
            <div class="header-content">
              <h2>NPM Downloads</h2>
              <p class="chart-description">Total npm installs for each package/framework, per week over the last year</p>
            </div>
          </div>
          <div class="iframe-container">
            <iframe
              src={npmChartsUrl}
              title="NPM Downloads Comparison"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      {/if}

      <!-- Star History -->
      {#if githubRepos.length > 0}
        <StarHistoryCard
          repos={githubRepos}
          title="Star History"
          description="Star growth for each framework's primary GitHub repository"
          legend="top-left"
        />
      {/if}
    </div>
  {:else}
    <div class="no-frameworks">
      <p>No frameworks selected for comparison</p>
    </div>
  {/if}
</div>

<style>
  .compare-page {
    max-width: 100%;
    padding: var(--gap-xl) var(--gap-lg);
  }

  .page-header {
    text-align: center;
    margin-bottom: var(--gap-2xl);
  }

  .page-header h1 {
    font-size: var(--font-3xl);
    margin-bottom: var(--gap-sm);
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: var(--font-lg);
  }

  .framework-selector {
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--gap-xl);
    margin-bottom: var(--gap-2xl);
  }

  .framework-selector h2 {
    font-size: var(--font-lg);
    margin-bottom: var(--gap-lg);
  }

  .framework-chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--gap-md);
    margin-bottom: var(--gap-md);
  }

  .framework-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    background: var(--surface-secondary);
    border: 2px solid var(--border-primary);
    border-radius: var(--radius-lg);
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
  }

  .framework-chip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--brand-color);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 0;
  }

  .framework-chip > * {
    position: relative;
    z-index: 1;
  }

  .framework-chip:hover:not(.disabled) {
    border-color: var(--brand-color);
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--brand-color, var(--accent-primary)) 3%, transparent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .framework-chip:hover:not(.disabled)::before {
    opacity: 0.05;
  }

  .framework-chip.selected {
    background: color-mix(in srgb, var(--brand-color, var(--accent-primary)) 20%, transparent);
    color: white;
    border-color: var(--brand-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .framework-chip.selected::before {
    opacity: 0;
  }

  .framework-chip.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .chip-logo {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .check-icon {
    font-weight: bold;
  }

  .selector-hint {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
    text-align: center;
    margin: 0;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-2xl);
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-primary);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .comparison-grid-container {
    overflow-x: auto;
    margin-bottom: var(--gap-2xl);
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 200px repeat(calc(var(--cols) - 1), minmax(250px, 1fr));
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

  .framework-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .framework-header h3 {
    margin: 0;
    font-size: var(--font-base);
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

  .centered {
    justify-content: center;
    align-items: center;
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

  .comparison-charts {
    margin-top: var(--gap-2xl);
    display: flex;
    flex-direction: column;
    gap: var(--gap-2xl);
  }

  .chart-card {
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

  .chart-card h2 {
    font-size: var(--font-xl);
    margin: 0;
  }

  .chart-description {
    margin: 0;
    font-size: var(--font-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .iframe-container {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--surface-tertiary);
  }

  .iframe-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: invert(1) hue-rotate(180deg) brightness(1.36) saturate(1.2);
  }

  .no-frameworks {
    text-align: center;
    padding: var(--gap-2xl);
    color: var(--text-tertiary);
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

  @media (max-width: 1024px) {
    .framework-chips {
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .compare-page {
      padding: var(--gap-lg) var(--gap-md);
    }

    .page-header h1 {
      font-size: var(--font-2xl);
    }

    .comparison-grid {
      grid-template-columns: 150px repeat(calc(var(--cols) - 1), minmax(200px, 1fr));
    }

    .framework-chips {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: var(--gap-sm);
    }

    .framework-chip {
      padding: var(--gap-sm) var(--gap-md);
    }
  }

  @media (max-width: 480px) {
    .framework-chips {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
