<script lang="ts">
  import { onMount } from 'svelte';
  import AttributeSlider from '$lib/components/AttributeSlider.svelte';
  import PresetButtons from '$lib/components/PresetButtons.svelte';
  import FrameworkCard from '$lib/components/FrameworkCard.svelte';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import SearchInput from '$lib/components/SearchInput.svelte';
  import EmptyComparisonState from '$lib/components/EmptyComparisonState.svelte';
  import { Github } from 'lucide-svelte';
  import { weights, searchQuery, shortlist, expandedCards, sortedFrameworks, frameworkData, frameworkStats, frameworkCommentary } from '$lib/stores';
  import { ATTRIBUTES, PRESETS } from '$lib/constants';
  import { fetchFrameworkStats, fetchFrameworkCommentary, saveShortlistToStorage, loadShortlistFromStorage } from '$lib/utils';
  import type { FrameworkData, Weights } from '$lib/types';

  let showGithubButton = true;
  let lastScrollY = 0;
  let heroElement: HTMLElement;

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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  <!-- Header -->
  <header class="app-header" bind:this={heroElement}>
    <h1 class="app-title">Stack Match</h1>
    <p class="app-subtitle">
      Find your perfect frontend framework, based on what matters most for your project.
    </p>
    <p class="app-second-subtitle">
      Results are using data calculated from <a href="https://github.com/Lissy93/framework-benchmarks" aria-label="Visit framework benchmarks repository on GitHub">framework-benchmarks</a>
    </p>
  </header>


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
    <ComparisonTable
      {shortlistedFrameworks}
      onRemoveFromShortlist={removeFromShortlist}
    />
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
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .app-second-subtitle {
    font-size: var(--font-sm);
    opacity: 0.9;
    color: var(--text-secondary);
    margin-top: var(--gap-sm);
    line-height: 1.4;
  }
  .app-second-subtitle a {
    color: var(--accent-primary);
    text-decoration: underline;
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

    .app-title {
      font-size: var(--font-3xl);
    }

    .app-subtitle {
      font-size: var(--font-base);
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
