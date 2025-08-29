<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  
  export let tooltip: string;
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  export let maxWidth: string = '250px';
  export let delay: number = 500;
</script>

<Tooltip content={tooltip} {position} {maxWidth} {delay}>
  <span class="tooltip-text">
    <slot />
  </span>
</Tooltip>

<style>
  .tooltip-text {
    /* border-bottom: 1px dotted var(--text-secondary); */
    cursor: help;
  }

  .tooltip-text:hover,
  .tooltip-text:focus {
    border-bottom-color: var(--accent-primary);
    color: var(--accent-primary);
  }
</style>
