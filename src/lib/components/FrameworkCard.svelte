<script lang="ts">
  import { ChevronDown, ChevronUp, Plus, Check } from 'lucide-svelte';
  import { slide } from 'svelte/transition';
  import { getBestAttributes, getWorstAttributes, getScoreColor, getIconUrl, capitalize } from '../utils';
  import { ATTRIBUTES, ATTR_DESCRIPTIONS } from '../constants';
  import type { FrameworkScore, Framework } from '../types';
  import TooltipText from './TooltipText.svelte';

  export let framework: FrameworkScore;
  export let isExpanded: boolean = false;
  export let isInShortlist: boolean = false;
  export let onToggleExpanded: () => void;
  export let onToggleShortlist: () => void;

  $: bestAttrs = getBestAttributes(framework, 3);
  $: worstAttrs = getWorstAttributes(framework, 3);
  $: iconUrl = getIconUrl(framework.meta);
  $: brandColor = framework.meta.branding?.color || null;

  function handleImageError(event: Event) {
    const target = event.currentTarget as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
</script>

<article class="framework-card" class:expanded={isExpanded} on:click={onToggleExpanded} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? onToggleExpanded() : null} style={brandColor ? `--framework-color: ${brandColor}` : ''}>
  <!-- Card Header -->
  <header class="card-header">
    <div class="framework-info">
      <a href="/{framework.meta.id}" on:click|stopPropagation class="framework-icon-link">
        <img
          src={iconUrl}
          alt="{framework.meta.name} icon"
          class="framework-icon"
          on:error={handleImageError}
        />
      </a>
      <div class="framework-details">
        <a href="/{framework.meta.id}" on:click|stopPropagation class="framework-name-link">
          <h3 class="framework-name">{framework.meta.name}</h3>
        </a>
        <p class="framework-description">{framework.meta.description}</p>
      </div>
    </div>
  </header>

  <!-- Score Bar -->
  <div class="score-section">
    <div class="score-header">
      <span class="score-label">Match Score</span>
      <span class="score-value" aria-live="polite">{Math.round(framework.score)}%</span>
    </div>
    <div class="progress-bar" role="progressbar" aria-valuenow={Math.round(framework.score)} aria-valuemin="0" aria-valuemax="100" aria-label="Match score: {Math.round(framework.score)}%">
      <div
        class="progress-fill"
        style="width: {framework.score}%; background-color: {getScoreColor(framework.score / 10)}"
      ></div>
    </div>
  </div>

  <!-- Best Attributes -->
  <div class="attributes-section">
    <div class="attribute-chips">
      {#each bestAttrs as { attr, score }}
        <span
          class="attribute-chip high"
          style="border-color: {getScoreColor(score)}; color: {getScoreColor(score)}"
        >
          {attr}: {score}
        </span>
      {/each}
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="actions">
    <button
      type="button"
      class="action-btn expand-btn"
      on:click|stopPropagation={onToggleExpanded}
      aria-expanded={isExpanded}
      aria-label="{isExpanded ? 'Collapse' : 'Expand'} details for {framework.meta.name}"
    >
      {#if isExpanded}
        <ChevronUp size={16} />
      {:else}
        <ChevronDown size={16} />
      {/if}
      Details
    </button>

    <button
      type="button"
      class="action-btn shortlist-btn"
      class:added={isInShortlist}
      on:click|stopPropagation={onToggleShortlist}
      aria-label="{isInShortlist ? 'Remove from' : 'Add to'} comparison shortlist"
    >
      {#if isInShortlist}
        <Check size={16} />
      {:else}
        <Plus size={16} />
      {/if}
      Compare
    </button>
  </div>

  <!-- Expanded Details -->
  {#if isExpanded}
    <div class="expanded-content" transition:slide={{ duration: 400 }}>
      <!-- All Attributes -->
      <div class="all-attributes">
        <h4 class="section-title">All Attributes</h4>
        <div class="attribute-grid">
          {#each ATTRIBUTES as attr}
            <div class="attribute-row">
              <TooltipText tooltip={ATTR_DESCRIPTIONS[attr]} position="right">
                <span class="attribute-name">{capitalize(attr)}</span>
              </TooltipText>
              <div class="attribute-bar">
                <div
                  class="attribute-fill"
                  style="width: {framework[attr] * 10}%; background-color: {getScoreColor(framework[attr])}"
                ></div>
              </div>
              <span class="attribute-score" style="color: {getScoreColor(framework[attr])}">{framework[attr]}/10</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Trade-offs -->
      <div class="tradeoffs">
        <h4 class="section-title">Trade-offs</h4>
        <div class="attribute-chips">
          {#each worstAttrs as { attr, score }}
            <span
              class="attribute-chip low"
              style="border-color: {getScoreColor(score)}; color: {getScoreColor(score)}"
            >
              Lower {attr}: {score}
            </span>
          {/each}
        </div>
      </div>

      <!-- Framework Info -->
      {#if framework.meta.longDescription}
        <div class="framework-info-expanded">
          <h4 class="section-title">About</h4>
          <p class="framework-long-desc">{framework.meta.longDescription}</p>
        </div>
      {/if}

      <!-- Example App -->
      {#if framework.meta.example && framework.meta.example.title}
        <div class="example-app">
          <h4 class="section-title">Example App</h4>
          <div class="example-card">
            {#if framework.meta.example.logo}
              <div class="example-logo">
                <img 
                  src={framework.meta.example.logo} 
                  alt="{framework.meta.example.title} logo"
                  class="example-logo-img"
                  on:error={handleImageError}
                />
              </div>
            {/if}
            <div class="example-content">
              <h5 class="example-title">{framework.meta.example.title}</h5>
              {#if framework.meta.example.description}
                <p class="example-description">{framework.meta.example.description}</p>
              {/if}
              <div class="example-links">
                {#if framework.meta.example.repo}
                  <a
                    href={framework.meta.example.repo}
                    class="example-link primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View {framework.meta.example.title} source code"
                    on:click|stopPropagation
                  >
                    GitHub
                  </a>
                {/if}
                {#if framework.meta.example.website}
                  <a
                    href={framework.meta.example.website}
                    class="example-link secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit {framework.meta.example.title}"
                    on:click|stopPropagation
                  >
                    View App
                  </a>
                {/if}

              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Full Info Section -->
      <div class="full-info-section">
        <h4 class="section-title">Want More Details?</h4>
        <p class="info-description">
          View comprehensive statistics, metrics, and ecosystem health for {framework.meta.name}.
        </p>
        <a
          href="/{framework.meta.id}"
          class="full-info-btn"
          on:click|stopPropagation
        >
          View Full Framework Details
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>

      <!-- Links -->
      {#if framework.meta.links.website || framework.meta.links.docs || framework.meta.links.github}
        <div class="framework-links">
          <h4 class="section-title">Resources</h4>
          <div class="links-grid" role="list">
            {#if framework.meta.links.website}
              <a
                href={framework.meta.links.website}
                class="resource-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit {framework.meta.name} website"
                on:click|stopPropagation
              >
                Website
              </a>
            {/if}
            {#if framework.meta.links.docs}
              <a
                href={framework.meta.links.docs}
                class="resource-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View {framework.meta.name} documentation"
                on:click|stopPropagation
              >
                Documentation
              </a>
            {/if}
            {#if framework.meta.links.github}
              <a
                href={framework.meta.links.github}
                class="resource-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View {framework.meta.name} GitHub repository"
                on:click|stopPropagation
              >
                GitHub
              </a>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</article>

<style>
  .framework-card {
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all var(--transition-slow);
    position: relative;
    overflow: hidden;
    height: 100%;
    transform-origin: center top;
  }

  .framework-card:hover {
    border-color: var(--framework-color, var(--accent-primary));
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  .framework-card.expanded {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--surface-secondary), var(--surface-tertiary));
  }

  .framework-card.expanded:hover {
    transform: none;
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .framework-info {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .framework-icon-link {
    display: block;
    text-decoration: none;
  }

  .framework-name-link {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;
  }

  .framework-name-link:hover .framework-name {
    color: var(--framework-color, var(--accent-primary));
  }

  .framework-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
  }

  .framework-details {
    flex: 1;
    min-width: 0;
  }

  .framework-name {
    font-size: var(--font-xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.25rem 0;
  }

  .framework-description {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
  }

  .score-section {
    margin-bottom: 1rem;
  }

  .score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .score-label {
    font-size: var(--font-sm);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .score-value {
    font-size: var(--font-sm);
    font-weight: 700;
    color: var(--text-primary);
  }

  .progress-bar {
    height: 0.5rem;
    background: var(--surface-tertiary);
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 9999px;
    transition: all 0.5s ease;
  }

  .attributes-section {
    margin-bottom: 1rem;
  }

  .attribute-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .attribute-chip {
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: var(--font-xs);
    font-weight: 600;
    border: 1px solid;
    background: transparent;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: var(--font-sm);
    font-weight: 500;
    border: 1px solid var(--border-primary);
    background: var(--surface-primary);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
    text-decoration: none;
  }

  .action-btn:hover {
    background: var(--surface-tertiary);
    border-color: var(--border-secondary);
  }

  .shortlist-btn.added {
    background: color-mix(in srgb, var(--framework-color, var(--accent-primary)) 15%, transparent);
    border-color: var(--framework-color, var(--accent-primary));
    color: var(--framework-color, var(--accent-primary));
  }

  .expanded-content {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-primary);
    overflow: hidden;
  }

  .section-title {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
  }

  .all-attributes {
    margin-bottom: 1.5rem;
  }

  .attribute-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .attribute-row {
    display: grid;
    grid-template-columns: 1fr 3fr auto;
    align-items: center;
    gap: 0.75rem;
  }

  .attribute-name {
    font-size: var(--font-xs);
    font-weight: 500;
    color: var(--text-secondary);
  }

  .attribute-bar {
    height: 0.375rem;
    background: var(--surface-tertiary);
    border-radius: 9999px;
    overflow: hidden;
  }

  .attribute-fill {
    height: 100%;
    border-radius: 9999px;
    transition: all 0.3s ease;
  }

  .attribute-score {
    font-size: var(--font-xs);
    font-weight: 600;
    min-width: 2.5rem;
    text-align: right;
  }

  .tradeoffs {
    margin-bottom: 1.5rem;
  }

  .framework-info-expanded {
    margin-bottom: 1.5rem;
  }

  .framework-long-desc {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
  }

  .example-app {
    margin-bottom: 1.5rem;
  }

  .example-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }

  .example-card:hover {
    box-shadow: var(--shadow-md);
  }

  .example-logo {
    flex-shrink: 0;
  }

  .example-logo-img {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    object-fit: cover;
    border: 1px solid var(--border-primary);
  }

  .example-content {
    flex: 1;
    min-width: 0;
  }

  .example-title {
    font-size: var(--font-base);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }

  .example-description {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    line-height: 1.4;
    margin: 0 0 0.75rem 0;
  }

  .example-links {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .example-link {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: var(--font-xs);
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 1px solid;
  }

  .example-link.primary {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
  }

  .example-link.primary:hover {
    background: var(--accent-gradient);
    transform: translateY(-1px);
    box-shadow: var(--shadow-accent-md);
  }

  .example-link.secondary {
    background: transparent;
    color: var(--accent-primary);
    border-color: var(--accent-primary);
  }

  .example-link.secondary:hover {
    background: var(--accent-secondary);
  }

  .full-info-section {
    margin-bottom: 1.5rem;
  }

  .info-description {
    margin: var(--gap-sm) 0 var(--gap-md) 0;
    font-size: var(--font-sm);
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .full-info-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-lg);
    background: var(--framework-color, var(--accent-primary));
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0 auto;
    display: flex;
    width: fit-content;
  }

  .full-info-btn:hover {
    background: color-mix(in srgb, var(--framework-color, var(--accent-primary)) 85%, black);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--framework-color, var(--accent-primary)) 40%, transparent);
  }

  .framework-links {
    margin-bottom: 0;
  }

  .links-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .resource-link {
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--border-primary);
    border-radius: 0.375rem;
    font-size: var(--font-xs);
    font-weight: 500;
    color: var(--accent-primary);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .resource-link:hover {
    background: var(--accent-secondary);
    border-color: var(--accent-primary);
  }

  /* Mobile adjustments for example app */
  @media (max-width: 640px) {
    .example-card {
      flex-direction: column;
      gap: 0.75rem;
    }

    .example-logo {
      align-self: flex-start;
    }

    .example-logo-img {
      width: 2.5rem;
      height: 2.5rem;
    }

    .example-title {
      font-size: var(--font-sm);
    }

    .example-description {
      font-size: 0.8125rem;
    }

    .example-links {
      gap: 0.375rem;
    }

    .example-link {
      font-size: 0.6875rem;
      padding: 0.3125rem 0.625rem;
    }
  }
</style>
