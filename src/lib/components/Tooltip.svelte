<script lang="ts">
  export let content: string;
  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  export let delay: number = 500;
  export let maxWidth: string = '500px';

  let showTooltip = false;
  let timeoutId: number;

  function handleMouseEnter() {
    timeoutId = window.setTimeout(() => {
      showTooltip = true;
    }, delay);
  }

  function handleMouseLeave() {
    clearTimeout(timeoutId);
    showTooltip = false;
  }

  function handleFocus() {
    showTooltip = true;
  }

  function handleBlur() {
    showTooltip = false;
  }
</script>

<div class="tooltip-container">
  <div 
    class="tooltip-trigger"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:focus={handleFocus}
    on:blur={handleBlur}
  >
    <slot />
  </div>
  
  {#if showTooltip && content}
    <div 
      class="tooltip"
      class:visible={showTooltip}
      data-position={position}
      style="max-width: {maxWidth}"
      role="tooltip"
    >
      {content}
      <div class="tooltip-arrow"></div>
    </div>
  {/if}
</div>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip-trigger {
    display: contents;
    cursor: help;
  }

  .tooltip {
    position: absolute;
    z-index: 1000;
    padding: 0.75rem;
    background: var(--surface-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.4;
    box-shadow: 0 4px 12px var(--shadow-color);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: all 0.2s ease;
    pointer-events: none;
    word-wrap: break-word;
    white-space: normal;
  }

  .tooltip.visible {
    opacity: 0.95;
  }

  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 6px solid transparent;
  }

  /* Position-based styles */
  .tooltip[data-position="top"] {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-8px) scale(0.95);
    margin-bottom: 8px;
  }

  .tooltip[data-position="top"].visible {
    transform: translateX(-50%) translateY(-8px) scale(1);
  }

  .tooltip[data-position="top"] .tooltip-arrow {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--surface-tertiary);
  }

  .tooltip[data-position="bottom"] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(8px) scale(0.95);
    margin-top: 8px;
  }

  .tooltip[data-position="bottom"].visible {
    transform: translateX(-50%) translateY(8px) scale(1);
  }

  .tooltip[data-position="bottom"] .tooltip-arrow {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: var(--surface-tertiary);
  }

  .tooltip[data-position="left"] {
    right: 100%;
    top: 50%;
    transform: translateX(-8px) translateY(-50%) scale(0.95);
    margin-right: 8px;
  }

  .tooltip[data-position="left"].visible {
    transform: translateX(-8px) translateY(-50%) scale(1);
  }

  .tooltip[data-position="left"] .tooltip-arrow {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: var(--surface-tertiary);
  }

  .tooltip[data-position="right"] {
    left: 100%;
    top: 50%;
    transform: translateX(8px) translateY(-50%) scale(0.95);
    margin-left: 8px;
  }

  .tooltip[data-position="right"].visible {
    transform: translateX(8px) translateY(-50%) scale(1);
  }

  .tooltip[data-position="right"] .tooltip-arrow {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: var(--surface-tertiary);
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    .tooltip {
      font-size: 0.8125rem;
      padding: 0.625rem;
      max-width: 250px !important;
    }
  }

  @media (max-width: 480px) {
    .tooltip {
      position: fixed;
      left: 1rem;
      right: 1rem;
      top: 50%;
      bottom: auto;
      max-width: none !important;
      width: auto !important;
      transform: translateY(-50%) scale(0.95);
    }

    .tooltip.visible {
      transform: translateY(-50%) scale(1);
    }

    .tooltip-arrow {
      display: none;
    }
  }
</style>
