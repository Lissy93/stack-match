<script lang="ts">
  import { onMount } from 'svelte';
  import AttributeSlider from '$lib/components/AttributeSlider.svelte';
  import PresetButtons from '$lib/components/PresetButtons.svelte';
  import FrameworkCard from '$lib/components/FrameworkCard.svelte';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import DetailedComparisonTable from '$lib/components/DetailedComparisonTable.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import EmptyComparisonState from '$lib/components/EmptyComparisonState.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import { Github } from 'lucide-svelte';
  import { weights, searchQuery, shortlist, expandedCards, sortedFrameworks, frameworkData, frameworkStats, frameworkCommentary } from '$lib/stores';
  import { ATTRIBUTES, PRESETS } from '$lib/constants';
  import { fetchFrameworkStats, fetchFrameworkCommentary, saveShortlistToStorage, loadShortlistFromStorage, throttle } from '$lib/utils';
  import type { FrameworkData, Weights } from '$lib/types';
  import data from '../data.json';

  let showGithubButton = true;
  let lastScrollY = 0;
  let heroElement: HTMLElement;

  // Comparison view state
  type ComparisonView = 'summary' | 'detailed';
  let comparisonView: ComparisonView = 'summary';
  let detailedComparisonData: any[] = [];
  let loadingDetailedData = false;

  // Load framework data from JSON
  function loadFrameworkData(): void {
    frameworkData.set(data as FrameworkData);
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

  // Check if current weights match a preset exactly
  function getActivePreset(currentWeights: Weights): string | null {
    for (const [presetName, presetWeights] of Object.entries(PRESETS)) {
      const matches = ATTRIBUTES.every(attr => 
        currentWeights[attr] === presetWeights[attr]
      );
      if (matches) return presetName;
    }
    return null;
  }

  // Get currently active preset
  $: activePreset = getActivePreset($weights);

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

  // Toggle framework expansion (only one at a time)
  function toggleExpanded(frameworkName: string): void {
    expandedCards.update(current => {
      const newSet = new Set<string>();
      // If the clicked card is already expanded, close it
      // If it's not expanded, close all others and open this one
      if (!current.has(frameworkName)) {
        newSet.add(frameworkName);
      }
      return newSet;
    });
  }

  // Toggle shortlist
  function toggleShortlist(frameworkName: string): void {
    shortlist.update(current => {
      const index = current.indexOf(frameworkName);
      const newShortlist = index >= 0 
        ? current.filter(name => name !== frameworkName)
        : [...current, frameworkName];
      
      // Save to localStorage
      saveShortlistToStorage(newShortlist);
      return newShortlist;
    });
  }

  // Remove from shortlist
  function removeFromShortlist(frameworkName: string): void {
    shortlist.update(current => {
      const newShortlist = current.filter(name => name !== frameworkName);
      // Save to localStorage
      saveShortlistToStorage(newShortlist);
      return newShortlist;
    });
  }

  // Initialize shortlist from localStorage or default values
  let hasInitialized = false;
  
  function initializeShortlist(): void {
    // Wait until we have framework data loaded
    if (hasInitialized || !$frameworkData || $sortedFrameworks.length === 0) return;
    
    // Try to load from localStorage first
    const storedShortlist = loadShortlistFromStorage();
    
    if (storedShortlist.length > 0) {
      // Validate that stored frameworks still exist in the current data
      const availableFrameworkNames = $frameworkData.frameworks.map(fw => fw.name);
      const validFrameworks = storedShortlist.filter(name => 
        availableFrameworkNames.includes(name)
      );
            
      if (validFrameworks.length > 0) {
        shortlist.set(validFrameworks);
        hasInitialized = true;
        return;
      }
    }

    hasInitialized = true;
  }
  
  // Initialize when frameworks are loaded - watch both frameworkData and sortedFrameworks
  $: if ($frameworkData && $sortedFrameworks.length > 0) {
    initializeShortlist();
  }

  // Get shortlisted frameworks with metadata
  $: shortlistedFrameworks = $shortlist
    .map(name => {
      const framework = $sortedFrameworks.find(fw => fw.name === name);
      return framework ? { framework, meta: framework.meta } : null;
    })
    .filter((item): item is { framework: any; meta: any } => item !== null);

  // Load detailed comparison data when switching to detailed view
  async function loadDetailedComparisonData() {
    if (shortlistedFrameworks.length === 0) {
      detailedComparisonData = [];
      return;
    }

    loadingDetailedData = true;
    try {
      const frameworkIds = shortlistedFrameworks.map(f => f.meta.id);
      const promises = frameworkIds.map(id =>
        fetch(`/api/framework/${id}`).then(r => r.json())
      );
      detailedComparisonData = await Promise.all(promises);
    } catch (error) {
      console.error('Failed to load detailed comparison data:', error);
      detailedComparisonData = [];
    } finally {
      loadingDetailedData = false;
    }
  }

  // Handle view change
  async function handleViewChange(view: ComparisonView) {
    comparisonView = view;
    if (view === 'detailed' && detailedComparisonData.length === 0) {
      await loadDetailedComparisonData();
    }
  }

  // Reload detailed data when shortlist changes (if we're in detailed view)
  $: if (comparisonView === 'detailed' && shortlistedFrameworks.length > 0) {
    loadDetailedComparisonData();
  }

  // Clear detailed data when shortlist is empty
  $: if (shortlistedFrameworks.length === 0) {
    detailedComparisonData = [];
  }

  // Load data on mount
  onMount(() => {
    loadFrameworkData();
    loadExternalData();

    // Set up scroll listener for GitHub button visibility
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 100;

      // Get hero height for reference
      const heroHeight = heroElement?.offsetHeight || 500;

      // Show button if:
      // - At top (within hero section)
      // - Scrolling up
      // - At bottom of page
      if (currentScrollY < heroHeight * 0.8) {
        showGithubButton = true;
      } else if (isAtBottom) {
        showGithubButton = true;
      } else if (currentScrollY < lastScrollY && currentScrollY > heroHeight * 0.8) {
        showGithubButton = true;
      } else {
        showGithubButton = false;
      }

      lastScrollY = currentScrollY;
    };

    // Throttle scroll handler to improve performance (max once every 100ms)
    const throttledScroll = throttle(handleScroll, 100);

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  });
</script>

<svelte:head>
  <title>Stack Match - Find Your Perfect Frontend Stack</title>
</svelte:head>

<main class="app-container">
  <!-- Skip Navigation -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <!-- GitHub Button -->
  <a 
    href="https://github.com/lissy93/stack-match" 
    target="_blank" 
    rel="noopener noreferrer"
    class="github-button"
    class:hidden={!showGithubButton}
    aria-label="View on GitHub"
  >
    <Github size={20} />
    <span class="github-text">View on GitHub</span>
  </a>

  <!-- Hero -->
  <Hero bind:heroElement />


  <!-- Presets -->
  <section class="control-section presets-section">
    <PresetButtons onPresetSelect={handlePresetSelect} {activePreset} />
  </section>

  <div class="main-content">
    <!-- Sidebar - Controls -->
    <aside class="sidebar" aria-label="Framework selection controls">
      <!-- Attribute Sliders -->
      <section class="control-section">
        <h2 class="section-title">Your Priorities</h2>
        <div class="sliders-grid">
          {#each ATTRIBUTES as attribute}
            <AttributeSlider
              {attribute}
              value={$weights[attribute]}
              onChange={handleWeightChange(attribute)}
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
      <section id="main-content" class="frameworks-grid" role="main" aria-label="Framework comparison results">
        {#each $sortedFrameworks as framework (framework.name)}
          <div class="framework-card-wrapper animate-slide-up" class:expanded={$expandedCards.has(framework.name)}>
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
          <div class="no-results" role="status" aria-live="polite">
            <h3>No frameworks found</h3>
            <p>Try adjusting your search query or clearing filters.</p>
          </div>
        {:else if !$frameworkData}
          <div class="loading" role="status" aria-live="polite">
            <h3>Loading frameworks...</h3>
            <p>Fetching the latest framework data and metrics</p>
          </div>
        {/if}
      </section>
    </div>
  </div>

  <!-- Comparison Section -->
  {#if shortlistedFrameworks.length > 0}
    <section class="comparison-section" aria-labelledby="comparison-title">
      <div class="comparison-header">
        <h2 id="comparison-title" class="comparison-title">Framework Comparison</h2>
        <div class="view-toggle" role="tablist" aria-label="Comparison view">
          <button
            type="button"
            role="tab"
            class="view-toggle-btn"
            class:active={comparisonView === 'summary'}
            aria-selected={comparisonView === 'summary'}
            aria-controls="comparison-content"
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
            aria-controls="comparison-content"
            on:click={() => handleViewChange('detailed')}
          >
            Detailed
          </button>
        </div>
      </div>

      <div id="comparison-content" role="tabpanel">
        {#if comparisonView === 'summary'}
          <ComparisonTable
            {shortlistedFrameworks}
            onRemoveFromShortlist={removeFromShortlist}
          />
        {:else if loadingDetailedData}
          <div class="loading-detailed">
            <div class="spinner"></div>
            <p>Loading detailed comparison data...</p>
          </div>
        {:else}
          <DetailedComparisonTable
            frameworks={detailedComparisonData}
            onRemoveFramework={(id) => {
              const framework = shortlistedFrameworks.find(f => f.meta.id === id);
              if (framework) {
                removeFromShortlist(framework.framework.name);
                // Remove from detailed data too
                detailedComparisonData = detailedComparisonData.filter(f => f.id !== id);
              }
            }}
          />
        {/if}
      </div>
    </section>
  {:else}
    <EmptyComparisonState />
  {/if}
  
  <!-- Footer -->
  <footer class="app-footer">
    <p class="footer-text">
      <a href="https://github.com/lissy93/stack-match" target="_blank" rel="noopener noreferrer">
        Stack Match
      </a>
      is licensed under MIT. © 
      <a href="https://github.com/lissy93" target="_blank" rel="noopener noreferrer">
        Alicia Sykes
      </a>
      2025.
    </p>
  </footer>
</main>

<style>
  .app-container {
    min-height: 100vh;
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--gap-xl);
    padding-bottom: 0;
    animation: fadeIn 0.6s ease-out;
    position: relative;
  }

  .github-button {
    position: fixed;
    top: var(--gap-lg);
    right: var(--gap-lg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--font-sm);
    font-weight: 500;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    z-index: 100;
    box-shadow: var(--shadow-md);
    opacity: 1;
    transform: translateY(0);
  }

  .github-button.hidden {
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }

  .skip-link {
    position: fixed;
    top: -100px;
    left: 0;
    background: var(--surface-secondary);
    color: var(--text-primary);
    padding: var(--gap-sm) var(--gap-md);
    text-decoration: none;
    border-radius: var(--radius-md);
    z-index: 10000;
    transition: top 0.3s ease;
    border: 2px solid var(--accent-primary);
    font-weight: 600;
    margin: var(--gap-md);
    box-shadow: var(--shadow-lg);
  }

  .skip-link:focus {
    top: 0;
  }

  .github-button:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
    color: var(--text-primary);
  }

  .github-text {
    white-space: nowrap;
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
    &.presets-section {
      /* margin-bottom: 1rem; */
      padding: 1rem var(--gap-xl) 0 var(--gap-xl);
    }
  }

  .control-section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: var(--font-xl);
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
    font-size: var(--font-3xl);
    font-weight: 800;
    margin-bottom: var(--gap-sm);
  }

  .results-subtitle {
    color: var(--text-secondary);
    font-size: var(--font-sm);
  }

  .frameworks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-auto-rows: minmax(300px, auto);
    gap: var(--gap-lg);
  }

  .framework-card-wrapper {
    animation-delay: calc(var(--index, 0) * 50ms);
    transition: all var(--transition-slow);

    &.expanded {
      grid-row: span 4;
      z-index: 10;
    }
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
  @media (max-width: 768px) {
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

    .results-title {
      font-size: var(--font-2xl);
    }
  }

  @media (max-width: 1200px) {
    .control-section {
      padding: var(--gap-md) var(--gap-sm);
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

  .comparison-section {
    margin-top: 3rem;
    padding: 2rem;
    background: var(--surface-secondary);
    border-radius: 1.25rem;
    border: 1px solid var(--border-primary);
  }

  .comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
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
    transition: all 0.2s ease;
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

  .loading-detailed {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-md);
    padding: var(--gap-2xl);
  }

  .loading-detailed p {
    color: var(--text-secondary);
    margin: 0;
  }

  .app-footer {
    margin-top: var(--gap-xl);
    padding: var(--gap-lg) 0;
    text-align: center;
    border-top: 1px solid var(--border-primary);
  }

  .footer-text {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }

  .footer-text a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .footer-text a:hover {
    color: var(--accent-gradient);
    text-decoration: underline;
  }

  /* Mobile adjustments for GitHub button */
  @media (max-width: 768px) {
    .github-button {
      top: var(--gap-md);
      right: var(--gap-md);
      padding: 0.625rem 0.875rem;
      font-size: 0.8125rem;
    }

    .github-text {
      display: none;
    }

    .comparison-section {
      padding: 1rem;
      margin-left: -1rem;
      margin-right: -1rem;
      border-radius: 0;
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
    .github-button {
      padding: 0.5rem;
    }

    .app-footer {
      margin-top: var(--gap-xl);
      padding: var(--gap-lg) 0;
    }

    .footer-text {
      font-size: 0.8125rem;
      line-height: 1.4;
    }
  }
</style>
