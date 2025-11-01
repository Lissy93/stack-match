<script lang="ts">
  // Wrapper component that makes any card compact for comparison view
  export let hideTitle = false;
</script>

<div class="compact-wrapper" class:no-title={hideTitle}>
  <slot />
</div>

<style>
  .compact-wrapper {
    /* Remove card backgrounds and borders - grid provides structure */
    --gap-lg: var(--gap-sm);
    --gap-md: var(--gap-xs);
    height: 100%;
  }

  .compact-wrapper :global(.card) {
    background: transparent;
    border: none;
    padding: 0;
    gap: var(--gap-sm);
  }

  .compact-wrapper :global(.card h3),
  .compact-wrapper :global(.card-header) {
    display: none;
  }

  .compact-wrapper :global(.stats-grid),
  .compact-wrapper :global(.stats-list) {
    gap: var(--gap-xs);
  }

  .compact-wrapper :global(.stat-item) {
    padding: var(--gap-xs) var(--gap-sm);
  }

  .compact-wrapper :global(.stat-icon) {
    font-size: var(--font-base);
  }

  .compact-wrapper :global(.stat-highlight  .stat-value) {
    font-size: var(--font-xl);
  }
  .compact-wrapper :global(.stat-row .stat-value) {
    font-size: var(--font-md);
  }

  .compact-wrapper :global(.stat-label) {
    font-size: var(--font-sm);
  }

  /* Hide certain details in compact mode */
  .compact-wrapper :global(.latest-release),
  .compact-wrapper :global(.dates),
  .compact-wrapper :global(.keywords),
  .compact-wrapper :global(.version-info),
  .compact-wrapper :global(.btn-primary),
  .compact-wrapper :global(.btn-secondary),
  .compact-wrapper :global(.link) {
    display: none !important;
  }

  /* Allow compact buttons to show */
  .compact-wrapper :global(.btn-compact) {
    display: inline-flex !important;
  }

  /* Simplify stats for compact view */
  .compact-wrapper :global(.stat-row) {
    padding: var(--gap-xs) 0;
    /* font-size: var(--font-xs); */
  }

  /* Star History compact styles */
  .compact-wrapper :global(.chart-container) {
    min-height: 120px;
  }

  .compact-wrapper :global(.chart-container img) {
    border-radius: var(--radius-sm);
  }

  .compact-wrapper :global(.no-data) {
    padding: var(--gap-md);
    min-height: 120px;
  }

  .compact-wrapper :global(.loading) {
    min-height: 120px;
  }

  .compact-wrapper :global(.loading-spinner) {
    width: 24px;
    height: 24px;
  }

  .compact-wrapper :global(.loading p) {
    font-size: var(--font-sm);
  }

  /* Example Project compact styles */
  .compact-wrapper :global(.project-header) {
    gap: var(--gap-sm);
  }

  .compact-wrapper :global(.project-logo) {
    width: 40px;
    height: 40px;
    padding: var(--gap-xs);
  }

  .compact-wrapper :global(.project-title) {
    font-size: var(--font-sm);
  }

  .compact-wrapper :global(.project-description) {
    font-size: var(--font-xs);
  }

  .compact-wrapper :global(.project-links) {
    display: flex !important;
    gap: var(--gap-xs);
  }
</style>
