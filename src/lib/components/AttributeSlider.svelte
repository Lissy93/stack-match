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
      style="background: linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) {percentage}%, var(--surface-tertiary) {percentage}%, var(--surface-tertiary) 100%)"
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
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    background: var(--surface-secondary);
    transition: all var(--transition-normal);
    border-bottom: 1px solid var(--border-primary);
    padding: var(--gap-2xs) var(--gap-2xs) var(--gap-sm) var(--gap-2xs);
    border-radius: var(--radius-xs);

    &:hover {
      box-shadow: var(--shadow-md);
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
    }
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
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-sm);
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
        background: var(--accent-primary);
        cursor: pointer;
        transition: all var(--transition-normal);
        border: 3px solid var(--surface-secondary);
        box-shadow: var(--shadow-sm);

        &:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-md);
        }
      }

      &::-moz-range-thumb {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background: var(--accent-primary);
        cursor: pointer;
        transition: all var(--transition-normal);
        border: 3px solid var(--surface-secondary);
        box-shadow: var(--shadow-sm);

        &:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-md);
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
