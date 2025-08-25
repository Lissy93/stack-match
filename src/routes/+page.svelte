<script lang="ts">
  import { onMount } from 'svelte';
  import AttributeSlider from '$lib/components/AttributeSlider.svelte';
  import PresetButtons from '$lib/components/PresetButtons.svelte';
  import FrameworkCard from '$lib/components/FrameworkCard.svelte';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import { weights, searchQuery, shortlist, expandedCards, sortedFrameworks, frameworkData, frameworkStats, frameworkCommentary } from '$lib/stores';
  import { ATTRIBUTES, PRESETS } from '$lib/constants';
  import { fetchFrameworkStats, fetchFrameworkCommentary } from '$lib/utils';
  import type { FrameworkData, Weights } from '$lib/types';

  // Load framework data from JSON
  async function loadFrameworkData(): Promise<void> {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data: FrameworkData = await response.json();
      if (!data.frameworks || !data.meta) {
        throw new Error('Invalid data structure');
      }
      
      frameworkData.set(data);
    } catch (error) {
      console.error('Failed to load framework data:', error);
      // Set empty data as fallback
      frameworkData.set({ frameworks: [], meta: [] });
    }
  }

  // Load external data
  async function loadExternalData(): Promise<void> {
    const [stats, commentary] = await Promise.all([
      fetchFrameworkStats(),
      fetchFrameworkCommentary()
    ]);
    
    frameworkStats.set(stats);
    frameworkCommentary.set(commentary);
  }

  // Handle preset selection
  function handlePresetSelect(preset: Weights): void {
    weights.set(preset);
  }

  // Handle weight changes
  function handleWeightChange(attribute: string) {
    return (value: number) => {
      weights.update(currentWeights => ({
        ...currentWeights,
        [attribute]: value
      }));
    };
  }

  // Handle search query changes
  function handleSearchChange(query: string): void {
    searchQuery.set(query);
  }

  // Toggle framework expansion
  function toggleExpanded(frameworkName: string): void {
    expandedCards.update(current => {
      const newSet = new Set(current);
      if (newSet.has(frameworkName)) {
        newSet.delete(frameworkName);
      } else {
        newSet.add(frameworkName);
      }
      return newSet;
    });
  }

  // Toggle shortlist
  function toggleShortlist(frameworkName: string): void {
    shortlist.update(current => {
      const index = current.indexOf(frameworkName);
      if (index >= 0) {
        return current.filter(name => name !== frameworkName);
      } else {
        return [...current, frameworkName];
      }
    });
  }

  // Remove from shortlist
  function removeFromShortlist(frameworkName: string): void {
    shortlist.update(current => current.filter(name => name !== frameworkName));
  }

  // Initialize auto-shortlist on first load
  let hasInitialized = false;
  $: if ($sortedFrameworks.length > 0 && $shortlist.length === 0 && !hasInitialized) {
    shortlist.set($sortedFrameworks.slice(0, 3).map(fw => fw.name));
    hasInitialized = true;
  }

  // Get shortlisted frameworks with metadata
  $: shortlistedFrameworks = $shortlist
    .map(name => {
      const framework = $sortedFrameworks.find(fw => fw.name === name);
      return framework ? { framework, meta: framework.meta } : null;
    })
    .filter((item): item is { framework: any; meta: any } => item !== null);

  // Load data on mount
  onMount(() => {
    loadFrameworkData();
    loadExternalData();
  });
</script>

<svelte:head>
  <title>Framework Comparator - Find Your Perfect Frontend Stack</title>
</svelte:head>

<main class="app-container">
  <!-- Header -->
  <header class="app-header">
    <h1 class="app-title">Framework Comparator</h1>
    <p class="app-subtitle">
      Find your perfect frontend framework based on what matters most to you
    </p>
  </header>

  <div class="main-content">
    <!-- Sidebar - Controls -->
    <aside class="sidebar" aria-label="Framework selection controls">
      <!-- Presets -->
      <section class="control-section">
        <PresetButtons onPresetSelect={handlePresetSelect} />
      </section>

      <!-- Attribute Sliders -->
      <section class="control-section">
        <h2 class="section-title">Your Priorities</h2>
        <div class="sliders-grid">
          {#each ATTRIBUTES as attribute}
            <AttributeSlider
              {attribute}
              value={$weights[attribute]}
              onValueChange={handleWeightChange(attribute)}
            />
          {/each}
        </div>
      </section>
    </aside>

    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Results Header -->
      <div class="results-header">
        <div class="results-title-section">
          <h2 class="results-title">Framework Results</h2>
          <p class="results-subtitle">
            {$sortedFrameworks.length} frameworks ranked by your preferences
          </p>
        </div>
        <SearchInput 
          value={$searchQuery}
          onValueChange={handleSearchChange}
          placeholder="Search frameworks..."
        />
      </div>

      <!-- Framework Cards -->
      <section class="frameworks-grid" role="main" aria-label="Framework comparison results">
        {#each $sortedFrameworks as framework (framework.name)}
          <div class="framework-card-wrapper animate-slide-up">
            <FrameworkCard
              {framework}
              isExpanded={$expandedCards.has(framework.name)}
              isInShortlist={$shortlist.includes(framework.name)}
              onToggleExpanded={() => toggleExpanded(framework.name)}
              onToggleShortlist={() => toggleShortlist(framework.name)}
            />
          </div>
        {/each}

        {#if $sortedFrameworks.length === 0 && $frameworkData}
          <div class="no-results">
            <h3>No frameworks found</h3>
            <p>Try adjusting your search query or clearing filters.</p>
          </div>
        {:else if !$frameworkData}
          <div class="loading">
            <h3>Loading frameworks...</h3>
            <p>Please wait while we load the comparison data.</p>
          </div>
        {/if}
      </section>
    </div>
  </div>

  <!-- Comparison Table -->
  {#if shortlistedFrameworks.length > 0}
    <ComparisonTable
      {shortlistedFrameworks}
      onRemoveFromShortlist={removeFromShortlist}
    />
  {/if}
</main>

<style>
  .app-container {
    min-height: 100vh;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--gap-xl);
    animation: fadeIn 0.6s ease-out;
  }

  .app-header {
    text-align: center;
    margin-bottom: var(--gap-2xl);
    padding: var(--gap-xl) 0;
  }

  .app-title {
    margin-bottom: var(--gap-md);
    position: relative;
  }

  .app-title::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4rem;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-gradient));
    border-radius: 9999px;
  }

  .app-subtitle {
    font-size: 1.125rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .main-content {
    display: grid;
    grid-template-columns: var(--sidebar-width) 1fr;
    gap: var(--gap-2xl);
    align-items: start;
    margin-bottom: var(--gap-2xl);
  }

  .sidebar {
    position: sticky;
    top: var(--gap-xl);
  }

  .control-section {
    background: var(--surface-secondary);
    border-radius: var(--radius-2xl);
    padding: var(--gap-xl);
    border: 1px solid var(--border-primary);
    margin-bottom: var(--gap-xl);
  }

  .control-section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--gap-lg);
  }

  .sliders-grid {
    display: grid;
    gap: var(--gap-md);
  }

  .content-area {
    min-width: 0;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: var(--gap-xl);
    gap: var(--gap-lg);
  }

  .results-title-section {
    flex: 1;
  }

  .results-title {
    font-size: 1.875rem;
    font-weight: 800;
    margin-bottom: var(--gap-sm);
  }

  .results-subtitle {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .frameworks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--gap-lg);
  }

  .framework-card-wrapper {
    animation-delay: calc(var(--index, 0) * 50ms);
  }

  .no-results,
  .loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--gap-2xl);
    background: var(--surface-secondary);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-primary);
  }

  .no-results h3,
  .loading h3 {
    color: var(--text-primary);
    margin-bottom: var(--gap-sm);
  }

  .no-results p,
  .loading p {
    color: var(--text-secondary);
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .main-content {
      grid-template-columns: 1fr;
      gap: var(--gap-xl);
    }

    .sidebar {
      position: static;
    }

    .results-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--gap-md);
    }
  }

  @media (max-width: 768px) {
    .app-container {
      padding: var(--gap-md);
    }

    .frameworks-grid {
      grid-template-columns: 1fr;
      gap: var(--gap-md);
    }

    .app-title {
      font-size: 1.875rem;
    }

    .app-subtitle {
      font-size: 1rem;
    }

    .results-title {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .control-section {
      padding: var(--gap-md);
    }

    .sliders-grid {
      gap: var(--gap-sm);
    }
  }
</style>
