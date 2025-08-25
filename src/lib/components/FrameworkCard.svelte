<script lang="ts">
  import { ChevronDown, ChevronUp, Plus, Check } from 'lucide-svelte';
  import { getBestAttributes, getWorstAttributes, getScoreColor, getIconUrl, capitalize } from '../utils';
  import { ATTRIBUTES } from '../constants';
  import type { FrameworkScore, Framework } from '../types';

  export let framework: FrameworkScore;
  export let isExpanded: boolean = false;
  export let isInShortlist: boolean = false;
  export let onToggleExpanded: () => void;
  export let onToggleShortlist: () => void;

  $: bestAttrs = getBestAttributes(framework, 3);
  $: worstAttrs = getWorstAttributes(framework, 3);
  $: iconUrl = getIconUrl(framework.meta);
</script>

<article class="framework-card" class:expanded={isExpanded}>
  <!-- Card Header -->
  <header class="card-header">
    <div class="framework-info">
      <img
        src={iconUrl}
        alt="{framework.meta.name} icon"
        class="framework-icon"
        on:error={(e) => e.currentTarget && (e.currentTarget.style.display = 'none')}
      />
      <div class="framework-details">
        <h3 class="framework-name">{framework.meta.name}</h3>
        <p class="framework-description">{framework.meta.description}</p>
      </div>
    </div>
  </header>

  <!-- Score Bar -->
  <div class="score-section">
    <div class="score-header">
      <span class="score-label">Match Score</span>
      <span class="score-value">{Math.round(framework.score)}%</span>
    </div>
    <div class="progress-bar">
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
      on:click={onToggleExpanded}
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
      on:click={onToggleShortlist}
      aria-label="{isInShortlist ? 'Remove from' : 'Add to'} comparison shortlist"
    >
      {#if isInShortlist}
        <Check size={16} />
        In List
      {:else}
        <Plus size={16} />
        Compare
      {/if}
    </button>
  </div>

  <!-- Expanded Details -->
  {#if isExpanded}
    <div class="expanded-content">
      <!-- All Attributes -->
      <div class="all-attributes">
        <h4 class="section-title">All Attributes</h4>
        <div class="attribute-grid">
          {#each ATTRIBUTES as attr}
            <div class="attribute-row">
              <span class="attribute-name">{capitalize(attr)}</span>
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

      <!-- Links -->
      {#if framework.meta.links.website || framework.meta.links.docs || framework.meta.links.github}
        <div class="framework-links">
          <h4 class="section-title">Resources</h4>
          <div class="links-grid">
            {#if framework.meta.links.website}
              <a href={framework.meta.links.website} class="resource-link" target="_blank" rel="noopener noreferrer">
                Website
              </a>
            {/if}
            {#if framework.meta.links.docs}
              <a href={framework.meta.links.docs} class="resource-link" target="_blank" rel="noopener noreferrer">
                Documentation
              </a>
            {/if}
            {#if framework.meta.links.github}
              <a href={framework.meta.links.github} class="resource-link" target="_blank" rel="noopener noreferrer">
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
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .framework-card:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 8px 25px var(--shadow-color);
    transform: translateY(-2px);
  }

  .framework-card.expanded {
    border-color: var(--accent-primary);
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .framework-info {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
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
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.25rem 0;
  }

  .framework-description {
    font-size: 0.875rem;
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
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .score-value {
    font-size: 0.875rem;
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
    font-size: 0.75rem;
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
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid var(--border-primary);
    background: var(--surface-primary);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
  }

  .action-btn:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
  }

  .shortlist-btn.added {
    background: var(--accent-secondary);
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .expanded-content {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-primary);
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .section-title {
    font-size: 0.875rem;
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
    font-size: 0.75rem;
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
    font-size: 0.75rem;
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
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
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
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--accent-primary);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .resource-link:hover {
    background: var(--accent-secondary);
    border-color: var(--accent-primary);
  }
</style>