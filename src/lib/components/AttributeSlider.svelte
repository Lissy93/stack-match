<script lang="ts">
  import Tooltip from './Tooltip.svelte';
  import { ATTR_DESCRIPTIONS } from '../constants';
  import { capitalize, getScoreColor } from '../utils';
  import type { Attribute } from '../constants';

  export let attribute: Attribute;
  export let value: number;
  export let onChange: (value: number) => void;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    onChange(parseInt(target.value));
  }

  function setLow() {
    onChange(1);
  }

  function setHigh() {
    onChange(10);
  }

  // Calculate percentage for gradient
  $: percentage = ((value - 1) / 9) * 100;

  // Get color for the value indicator
  $: valueColor = getScoreColor(value);
</script>

<div class="slider-container">
  <div class="slider-header">
    <Tooltip content={ATTR_DESCRIPTIONS[attribute]} position="top" maxWidth="250px">
      <label for="slider-{attribute}" class="tooltip-label">
        {capitalize(attribute)}
      </label>
    </Tooltip>
    <span class="value-indicator" style="color: {valueColor}">{value}</span>
  </div>

  <div class="slider-track">
    <input
      id="slider-{attribute}"
      type="range"
      min="1"
      max="10"
      step="1"
      {value}
      class="slider"
      style="background: linear-gradient(to right, {valueColor} 0%, {valueColor} {percentage}%, var(--surface-tertiary) {percentage}%, var(--surface-tertiary) 100%); --slider-color: {valueColor};"
      on:input={handleInput}
      aria-label="{capitalize(attribute)} importance level"
    />
  </div>

  <div class="slider-labels">
    <button type="button" class="slider-label" on:click={setLow}>Low</button>
    <button type="button" class="slider-label" on:click={setHigh}>High</button>
  </div>
</div>

<style lang="scss">
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  .slider-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    background: var(--surface-secondary);
    transition: all var(--transition-normal);
    border-bottom: 1px solid var(--border-primary);
    padding: var(--gap-2xs) var(--gap-2xs) var(--gap-sm) var(--gap-2xs);
    border-radius: var(--radius-xs);
    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;

    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tooltip-label {
      font-weight: 600;
      font-size: var(--font-sm);
      color: var(--text-primary);
      cursor: help;
    }

    .value-indicator {
      font-weight: 700;
      font-size: var(--font-sm);
      min-width: 1.5rem;
      text-align: right;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .slider-container:active .value-indicator {
    animation: pulse 0.3s ease-out;
  }

  .slider-track {
    position: relative;

    .slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 0.375rem;
      border-radius: 9999px;
      outline: none;
      cursor: pointer;
      transition: box-shadow var(--transition-normal), height 0.2s ease;

      &:hover {
        box-shadow: var(--shadow-sm);
        height: 0.5rem;
      }

      &:active {
        height: 0.5rem;
      }

      &:focus {
        box-shadow: var(--shadow-md);
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: var(--slider-color);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: 3px solid var(--surface-secondary);
        box-shadow: var(--shadow-sm);

        &:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--slider-color) 40%, transparent);
        }

        &:active {
          transform: scale(1.05);
        }
      }

      &::-moz-range-thumb {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: var(--slider-color);
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: 3px solid var(--surface-secondary);
        box-shadow: var(--shadow-sm);

        &:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--slider-color) 40%, transparent);
        }

        &:active {
          transform: scale(1.05);
        }
      }
    }
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;

    .slider-label {
      font-size: var(--font-xs);
      color: var(--text-tertiary);
      font-weight: 500;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: var(--gap-xs);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;

      &:hover {
        color: var(--accent-primary);
        background: var(--surface-tertiary);
      }
    }
  }
</style>
