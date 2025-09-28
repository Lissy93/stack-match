<script lang="ts">
  import { Plus, GitCompare } from 'lucide-svelte';
</script>

<div class="empty-state" role="region" aria-labelledby="empty-state-title">
  <div class="empty-state-icon" aria-hidden="true">
    <GitCompare size={48} />
  </div>
  
  <h3 id="empty-state-title" class="empty-state-title">No Frameworks Selected for Comparison</h3>
  
  <p class="empty-state-description">
    Add frameworks to your comparison list to see a detailed side-by-side analysis. 
    Click the <span class="inline-button"><Plus size={14} aria-hidden="true" /> Compare</span> button on any framework card to get started.
  </p>
  
  <div class="empty-state-features" role="list" aria-label="Comparison features">
    <div class="feature-item" role="listitem">
      <span class="feature-dot" aria-hidden="true"></span>
      Compare attributes across multiple frameworks
    </div>
    <div class="feature-item" role="listitem">
      <span class="feature-dot" aria-hidden="true"></span>
      View detailed scoring breakdowns
    </div>
    <div class="feature-item" role="listitem">
      <span class="feature-dot" aria-hidden="true"></span>
      Make informed decisions with data
    </div>
  </div>
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--gap-2xl);
    background: var(--surface-secondary);
    border-radius: var(--radius-2xl);
    border: 1px solid var(--border-primary);
    margin-top: var(--gap-2xl);
  }

  .empty-state-icon {
    margin-bottom: var(--gap-lg);
    color: var(--text-secondary);
    opacity: 0.6;
  }

  .empty-state-title {
    font-size: var(--font-2xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-md) 0;
  }

  .empty-state-description {
    font-size: var(--font-base);
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 500px;
    margin: 0 0 var(--gap-xl) 0;
  }

  .inline-button {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: var(--surface-tertiary);
    border-radius: 0.375rem;
    color: var(--text-primary);
    font-weight: 500;
    border: 1px solid var(--border-primary);
  }

  .empty-state-features {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    align-items: flex-start;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    font-size: var(--font-sm);
    color: var(--text-secondary);
  }

  .feature-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-primary);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .empty-state {
      padding: var(--gap-xl);
    }

    .empty-state-title {
      font-size: var(--font-xl);
    }

    .empty-state-description {
      font-size: var(--font-sm);
    }
  }
</style>