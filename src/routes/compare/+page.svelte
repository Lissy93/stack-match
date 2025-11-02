<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { FrameworkMeta } from '$lib/types';
  import Hero from '$lib/components/Hero.svelte';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import DetailedComparisonTable from '$lib/components/DetailedComparisonTable.svelte';
  import StarHistoryCard from '$lib/components/framework-detail/StarHistoryCard.svelte';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';

  export let data;

  let heroElement: HTMLElement;

  let availableFrameworks: FrameworkMeta[] = (data.frameworks || []).filter(f => f.id !== 'vanilla');
  let selectedFrameworks: string[] = [];
  let comparisonData: any[] = [];
  let loading = false;

  // Comparison view state
  type ComparisonView = 'summary' | 'detailed';
  let comparisonView: ComparisonView = 'detailed';

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
    if (selectedFrameworks.length === 0) {
      comparisonData = [];
      return;
    }

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
      selectedFrameworks = selectedFrameworks.filter(id => id !== frameworkId);
    } else {
      if (selectedFrameworks.length < 6) {
        selectedFrameworks = [...selectedFrameworks, frameworkId];
      }
    }
    updateURL();
    loadComparisonData();
  }

  function removeFramework(frameworkId: string) {
    selectedFrameworks = selectedFrameworks.filter(id => id !== frameworkId);
    updateURL();
    loadComparisonData();
  }

  function updateURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('frameworks', selectedFrameworks.join(','));
    goto(url.pathname + url.search, { replaceState: true, noScroll: true });
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

  // Prepare data for ComparisonTable (summary view)
  // We need to get scores from data.json since API doesn't include them
  $: shortlistedFrameworks = comparisonData
    .map(d => {
      // Find the matching framework scores from data.frameworkScores using the ID
      const frameworkId = d.metadata?.id || d.id;
      const frameworkScores = data.frameworkScores?.find((fw: any) => fw.name === frameworkId);

      if (!frameworkScores) {
        return null;
      }

      return {
        framework: frameworkScores,
        meta: d.metadata
      };
    })
    .filter(Boolean) as Array<{ framework: any; meta: any }>;

  // Handle view change
  function handleViewChange(view: ComparisonView) {
    comparisonView = view;
  }

  // Handle remove from comparison
  function handleRemoveFromComparison(frameworkName: string) {
    // Find framework by name
    const framework = comparisonData.find(d => d.metadata?.name === frameworkName);
    if (framework) {
      removeFramework(framework.metadata?.id);
    }
  }
</script>

<svelte:head>
  <title>Compare Frameworks - Stack Match</title>
  <meta name="description" content="Compare JavaScript frameworks side by side" />
</svelte:head>

<div class="compare-page">
  <!-- Hero -->
  <Hero bind:heroElement hideFrameworkList={true} />

  <!-- Framework Selector -->
  <div class="framework-selector">
    <h2>Select Frameworks <span class="count">({selectedFrameworks.length}/6)</span></h2>
    <div class="framework-chips">
      {#each availableFrameworks as framework}
        {@const isSelected = selectedFrameworks.includes(framework.id)}
        {@const canToggle = isSelected || selectedFrameworks.length < 6}
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
  </div>

  {#if loading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading comparison data...</p>
    </div>
  {:else if comparisonData.length > 0}
    <!-- View Toggle -->
    <div class="comparison-header">
      <h2 class="comparison-title">Comparison Results</h2>
      <div class="view-toggle" role="tablist" aria-label="Comparison view">
        <button
          type="button"
          role="tab"
          class="view-toggle-btn"
          class:active={comparisonView === 'summary'}
          aria-selected={comparisonView === 'summary'}
          on:click={() => handleViewChange('summary')}
        >
          Summary
        </button>
        <button
          type="button"
          role="tab"
          class="view-toggle-btn"
          class:active={comparisonView === 'detailed'}
          aria-selected={comparisonView === 'detailed'}
          on:click={() => handleViewChange('detailed')}
        >
          Detailed
        </button>
      </div>
    </div>

    <!-- Comparison Content -->
    {#if comparisonView === 'summary'}
      <ComparisonTable
        {shortlistedFrameworks}
        onRemoveFromShortlist={handleRemoveFromComparison}
      />
    {:else}
      <DetailedComparisonTable frameworks={comparisonData} onRemoveFramework={removeFramework} />
    {/if}

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
  :global(nav.navbar) {
    display: none;
  }

  .compare-page {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--gap-xl);
    padding-bottom: 0;
  }

  .framework-selector {
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--gap-lg) var(--gap-xl);
  }

  .framework-selector h2 {
    font-size: var(--font-md);
    font-weight: 600;
    margin: 0 0 var(--gap-md) 0;
    color: var(--text-primary);
  }

  .count {
    color: var(--text-tertiary);
    font-weight: 500;
  }

  .framework-chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: var(--gap-sm);
  }

  .framework-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
    padding: var(--gap-xs) var(--gap-sm);
    background: var(--surface-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
    min-height: 36px;
  }

  .framework-chip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--brand-color);
    opacity: 0;
    transition: opacity var(--transition-normal);
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
    box-shadow: var(--shadow-md);
  }

  .framework-chip:hover:not(.disabled)::before {
    opacity: 0.05;
  }

  .framework-chip.selected {
    background: color-mix(in srgb, var(--brand-color, var(--accent-primary)) 20%, transparent);
    color: white;
    border-color: var(--brand-color);
    box-shadow: var(--shadow-sm);
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
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .check-icon {
    font-weight: 700;
    font-size: var(--font-xs);
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

  .comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: var(--gap-lg) 0 0;
    gap: var(--gap-lg);
  }

  .comparison-title {
    font-size: var(--font-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .view-toggle {
    display: flex;
    background: var(--surface-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .view-toggle-btn {
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--font-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    white-space: nowrap;
  }

  .view-toggle-btn:hover {
    color: var(--text-primary);
    background: var(--surface-tertiary);
  }

  .view-toggle-btn.active {
    background: var(--accent-primary);
    color: white;
  }

  @media (max-width: 1024px) {
    .framework-chips {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .compare-page {
      padding: var(--gap-md);
    }

    .framework-selector {
      padding: var(--gap-md);
    }

    .framework-chips {
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: var(--gap-xs);
    }

    .comparison-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--gap-md);
    }

    .comparison-title {
      font-size: var(--font-xl);
      text-align: center;
    }

    .view-toggle {
      width: 100%;
    }

    .view-toggle-btn {
      flex: 1;
    }
  }

  @media (max-width: 480px) {
    .framework-chips {
      grid-template-columns: repeat(2, 1fr);
    }

    .framework-chip {
      font-size: var(--font-xs);
    }
  }
</style>
