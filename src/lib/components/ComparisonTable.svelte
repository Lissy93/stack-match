<script lang="ts">
  import { X } from 'lucide-svelte';
  import { ATTRIBUTES, ATTR_DESCRIPTIONS } from '../constants';
  import { getScoreColor, capitalize } from '../utils';
  import type { Framework, FrameworkMeta } from '../types';

  export let shortlistedFrameworks: Array<{ framework: Framework; meta: FrameworkMeta }>;
  export let onRemoveFromShortlist: (frameworkName: string) => void;

  // Check if table should be displayed
  $: showTable = shortlistedFrameworks.length > 0;
</script>

{#if showTable}
  <section class="comparison-section" aria-labelledby="comparison-title">
    <h2 id="comparison-title" class="section-title">Framework Comparison</h2>
    
    <div class="table-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th class="attribute-header">Attribute</th>
            {#each shortlistedFrameworks as { framework, meta }}
              <th class="framework-header">
                <div class="framework-header-content">
                  <span class="framework-name">{meta.name}</span>
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
          {#each ATTRIBUTES as attribute}
            <tr class="attribute-row">
              <td class="attribute-cell">
                <div class="attribute-info">
                  <span class="attribute-name">{capitalize(attribute)}</span>
                  <span class="attribute-desc">{ATTR_DESCRIPTIONS[attribute]}</span>
                </div>
              </td>
              {#each shortlistedFrameworks as { framework }}
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
    font-size: 1.5rem;
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

  .framework-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .framework-name {
    font-size: 0.875rem;
    font-weight: 600;
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
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .attribute-desc {
    font-size: 0.75rem;
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
    font-size: 0.875rem;
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
  }
</style>