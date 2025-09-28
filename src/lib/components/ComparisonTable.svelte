<script lang="ts">
  import { X, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-svelte';
  import { ATTRIBUTES, ATTR_DESCRIPTIONS } from '../constants';
  import { getScoreColor, capitalize } from '../utils';
  import type { Framework, FrameworkMeta, Attribute } from '../types';
  import TooltipText from './TooltipText.svelte';

  export let shortlistedFrameworks: Array<{ framework: Framework; meta: FrameworkMeta }>;
  export let onRemoveFromShortlist: (frameworkName: string) => void;

  // Sorting state
  let sortBy: 'attribute' | string | null = null;
  let sortOrder: 'asc' | 'desc' = 'desc';

  // Check if table should be displayed
  $: showTable = shortlistedFrameworks.length > 0;

  // Get overall score for a framework (average of all attributes)
  function getOverallScore(framework: Framework): number {
    const total = ATTRIBUTES.reduce((sum, attr) => sum + (framework[attr] as number), 0);
    return total / ATTRIBUTES.length;
  }

  // Sort frameworks by selected column
  $: sortedFrameworks = sortBy 
    ? [...shortlistedFrameworks].sort((a, b) => {
        let scoreA: number;
        let scoreB: number;

        if (sortBy === 'attribute') {
          // Sort by overall score (average)
          scoreA = getOverallScore(a.framework);
          scoreB = getOverallScore(b.framework);
        } else {
          // Sort by specific framework column
          const frameworkA = shortlistedFrameworks.find(f => f.meta.name === sortBy);
          const frameworkB = shortlistedFrameworks.find(f => f.meta.name === sortBy);
          
          if (!frameworkA || !frameworkB) return 0;
          
          // For framework sorting, we need to compare by which attribute has higher scores
          const scoresA = ATTRIBUTES.map(attr => frameworkA.framework[attr] as number);
          const scoresB = ATTRIBUTES.map(attr => frameworkB.framework[attr] as number);
          
          // Sort by average score of the selected framework
          scoreA = scoresA.reduce((sum, score) => sum + score, 0) / scoresA.length;
          scoreB = scoresB.reduce((sum, score) => sum + score, 0) / scoresB.length;
        }

        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      })
    : shortlistedFrameworks;

  // Sort attributes by selected framework
  $: sortedAttributes = sortBy && sortBy !== 'attribute'
    ? [...ATTRIBUTES].sort((a, b) => {
        const framework = shortlistedFrameworks.find(f => f.meta.name === sortBy);
        if (!framework) return 0;
        
        const scoreA = framework.framework[a] as number;
        const scoreB = framework.framework[b] as number;
        
        return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
      })
    : ATTRIBUTES;

  // Handle column header click
  function handleSort(column: 'attribute' | string) {
    if (sortBy === column) {
      // Same column - toggle order
      sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    } else {
      // New column - default to desc (best first)
      sortBy = column;
      sortOrder = 'desc';
    }
  }

  // Get sort icon for column
  function getSortIcon(column: 'attribute' | string) {
    if (sortBy !== column) return ArrowUpDown;
    return sortOrder === 'desc' ? ChevronDown : ChevronUp;
  }

  // Check if column is currently sorted
  function isColumnSorted(column: 'attribute' | string): boolean {
    return sortBy === column;
  }
</script>

{#if showTable}
  <section class="comparison-section" aria-labelledby="comparison-title">
    <h2 id="comparison-title" class="section-title">Framework Comparison</h2>
    
    <div class="table-wrapper">
      <table class="comparison-table" aria-labelledby="comparison-title">
        <caption class="sr-only">
          Comparison table showing attribute scores for {sortedFrameworks.length} selected frameworks across {sortedAttributes.length} different criteria.
        </caption>
        <thead>
          <tr>
            <th class="attribute-header sortable" class:sorted={isColumnSorted('attribute')} scope="col">
              <button 
                type="button"
                class="sort-button"
                on:click={() => handleSort('attribute')}
                aria-label="Sort by overall score"
                aria-pressed={isColumnSorted('attribute')}
              >
                <span>Attribute</span>
                <svelte:component this={getSortIcon('attribute')} size={16} />
              </button>
            </th>
            {#each sortedFrameworks as { framework, meta }}
              <th class="framework-header sortable" class:sorted={isColumnSorted(meta.name)} scope="col">
                <div class="framework-header-content">
                  <button 
                    type="button"
                    class="sort-button framework-sort"
                    on:click={() => handleSort(meta.name)}
                    aria-label="Sort by {meta.name} scores"
                    aria-pressed={isColumnSorted(meta.name)}
                  >
                    <span class="framework-name">{meta.name}</span>
                    <svelte:component this={getSortIcon(meta.name)} size={14} />
                  </button>
                  <button
                    type="button"
                    class="remove-btn"
                    on:click={() => onRemoveFromShortlist(framework.name)}
                    aria-label="Remove {meta.name} from comparison"
                  >
                    <X size={14} />
                  </button>
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each sortedAttributes as attribute}
            <tr class="attribute-row">
              <th class="attribute-cell" scope="row">
                <div class="attribute-info">
                  <TooltipText tooltip={ATTR_DESCRIPTIONS[attribute]} position="right">
                    <span class="attribute-name">{capitalize(attribute)}</span>
                  </TooltipText>
                  <span class="attribute-desc">{ATTR_DESCRIPTIONS[attribute]}</span>
                </div>
              </th>
              {#each sortedFrameworks as { framework }}
                {@const score = framework[attribute]}
                <td class="framework-cell">
                  <div class="score-display">
                    <div class="score-bar-container">
                      <div
                        class="score-bar"
                        style="width: {score * 10}%; background-color: {getScoreColor(score)}"
                      ></div>
                    </div>
                    <span class="score-text" style="color: {getScoreColor(score)}">
                      {score}/10
                    </span>
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
{/if}

<style>
  .comparison-section {
    margin-top: 3rem;
    padding: 2rem;
    background: var(--surface-secondary);
    border-radius: 1.25rem;
    border: 1px solid var(--border-primary);
  }

  .section-title {
    font-size: var(--font-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 1.5rem 0;
    text-align: center;
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 0.75rem;
    border: 1px solid var(--border-primary);
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface-primary);
  }

  .comparison-table th,
  .comparison-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-primary);
    vertical-align: middle;
  }

  .comparison-table th {
    background: var(--surface-secondary);
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-primary);
  }

  .attribute-header {
    min-width: 200px;
    position: sticky;
    left: 0;
    background: var(--surface-secondary);
    z-index: 10;
  }

  .framework-header {
    min-width: 150px;
  }

  .sortable {
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    position: relative;
  }

  .sortable:hover {
    background: var(--surface-tertiary);
  }

  .sortable.sorted {
    background: var(--accent-secondary);
    border-color: var(--accent-primary);
  }

  .sort-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    padding: 0;
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: inherit;
    font-weight: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sort-button:hover {
    color: var(--accent-primary);
  }

  .sortable.sorted .sort-button {
    color: var(--accent-primary);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .framework-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .framework-sort {
    flex: 1;
    min-width: 0;
  }

  .framework-name {
    font-size: var(--font-sm);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: none;
    border: none;
    color: var(--text-danger);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }

  .remove-btn:hover {
    background: var(--surface-danger);
  }

  .attribute-row:last-child td {
    border-bottom: none;
  }

  .attribute-cell {
    background: var(--surface-secondary);
    position: sticky;
    left: 0;
    z-index: 5;
    border-right: 1px solid var(--border-primary);
  }

  .attribute-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .attribute-name {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .attribute-desc {
    font-size: var(--font-xs);
    color: var(--text-secondary);
    line-height: 1.3;
  }

  .framework-cell {
    text-align: center;
  }

  .score-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .score-bar-container {
    flex: 1;
    height: 0.5rem;
    background: var(--surface-tertiary);
    border-radius: 9999px;
    overflow: hidden;
  }

  .score-bar {
    height: 100%;
    border-radius: 9999px;
    transition: all 0.3s ease;
  }

  .score-text {
    font-size: var(--font-sm);
    font-weight: 600;
    min-width: 2.5rem;
  }

  @media (max-width: 768px) {
    .comparison-section {
      padding: 1rem;
      margin-left: -1rem;
      margin-right: -1rem;
      border-radius: 0;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 0.75rem 0.5rem;
    }

    .attribute-header {
      min-width: 160px;
    }

    .framework-header {
      min-width: 120px;
    }

    .framework-name {
      font-size: 0.8125rem;
    }

    .attribute-name {
      font-size: 0.8125rem;
    }

    .attribute-desc {
      font-size: 0.6875rem;
    }

    .score-text {
      font-size: 0.8125rem;
      min-width: 2.25rem;
    }

    .sort-button {
      gap: 0.25rem;
    }

    .framework-name {
      font-size: 0.8125rem;
    }
  }

  @media (max-width: 640px) {
    .sort-button {
      flex-direction: column;
      gap: 0.125rem;
    }

    .framework-sort {
      text-align: center;
    }
  }
</style>
