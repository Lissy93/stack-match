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
  <button
    type="button"
    class="tooltip-trigger"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:focus={handleFocus}
    on:blur={handleBlur}
    aria-describedby={showTooltip ? 'tooltip-content' : undefined}
  >
    <slot />
  </button>

  {#if showTooltip && content}
    <div
      id="tooltip-content"
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

<style lang="scss">
  .tooltip-container {
    position: relative;
    display: inline-block;

    .tooltip-trigger {
      display: contents;
      cursor: help;
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      color: inherit;
    }
  }

  .tooltip {
    position: absolute;
    z-index: 1000;
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    font-size: var(--font-sm);
    line-height: 1.4;
    box-shadow: var(--shadow-md);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: all var(--transition-normal);
    pointer-events: none;
    word-wrap: break-word;
    white-space: normal;

    &.visible {
      opacity: 0.95;
    }

    .tooltip-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border: 6px solid transparent;
    }

    // Position-specific styles
    &[data-position="top"] {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px) scale(0.95);
      margin-bottom: 8px;

      &.visible {
        transform: translateX(-50%) translateY(-8px) scale(1);
      }

      .tooltip-arrow {
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top-color: var(--surface-tertiary);
      }
    }

    &[data-position="bottom"] {
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(8px) scale(0.95);
      margin-top: 8px;

      &.visible {
        transform: translateX(-50%) translateY(8px) scale(1);
      }

      .tooltip-arrow {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom-color: var(--surface-tertiary);
      }
    }

    &[data-position="left"] {
      right: 100%;
      top: 50%;
      transform: translateX(-8px) translateY(-50%) scale(0.95);
      margin-right: 8px;

      &.visible {
        transform: translateX(-8px) translateY(-50%) scale(1);
      }

      .tooltip-arrow {
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-left-color: var(--surface-tertiary);
      }
    }

    &[data-position="right"] {
      left: 100%;
      top: 50%;
      transform: translateX(8px) translateY(-50%) scale(0.95);
      margin-left: 8px;

      &.visible {
        transform: translateX(8px) translateY(-50%) scale(1);
      }

      .tooltip-arrow {
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        border-right-color: var(--surface-tertiary);
      }
    }
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    .tooltip {
      font-size: var(--font-sm-alt);
      padding: 10px;
      max-width: 250px !important;
    }
  }

  @media (max-width: 480px) {
    .tooltip {
      position: fixed;
      left: var(--gap-lg);
      right: var(--gap-lg);
      top: 50%;
      bottom: auto;
      max-width: none !important;
      width: auto !important;
      transform: translateY(-50%) scale(0.95);

      &.visible {
        transform: translateY(-50%) scale(1);
      }

      .tooltip-arrow {
        display: none;
      }
    }
  }
</style>