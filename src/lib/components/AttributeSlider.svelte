<script lang="ts">
  import { ATTR_DESCRIPTIONS } from '../constants';
  import type { Attribute } from '../constants';

  export let attribute: Attribute;
  export let value: number;
  export let onValueChange: (value: number) => void;

  // Handle slider value change
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    onValueChange(parseInt(target.value));
  }

  // Set specific values via legend clicks
  function setValue(newValue: number) {
    onValueChange(newValue);
  }

  // Capitalize attribute name for display
  function capitalize(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }
</script>

<div class="slider-container">
  <div class="slider-header">
    <label for={attribute} title={ATTR_DESCRIPTIONS[attribute]}>
      {capitalize(attribute)}
    </label>
    <span class="value-indicator">{value}</span>
  </div>
  
  <input
    id={attribute}
    type="range"
    min="0"
    max="10"
    {value}
    on:input={handleInput}
    class="slider"
    style="--progress: {value * 10}%"
    aria-label="Priority for {capitalize(attribute)}"
  />
  
  <div class="legend">
    <button
      type="button"
      class="legend-item"
      class:active={value === 0}
      on:click={() => setValue(0)}
    >
      Ignore
    </button>
    <button
      type="button"
      class="legend-item"
      class:active={value === 5}
      on:click={() => setValue(5)}
    >
      Balanced
    </button>
    <button
      type="button"
      class="legend-item"
      class:active={value === 10}
      on:click={() => setValue(10)}
    >
      Max
    </button>
  </div>
</div>

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--surface-secondary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-primary);
    transition: all 0.2s ease;
  }

  .slider-container:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
    cursor: help;
  }

  .value-indicator {
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--accent-primary);
    min-width: 1.5rem;
    text-align: right;
  }

  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 0.375rem;
    border-radius: 9999px;
    background: linear-gradient(
      to right,
      var(--accent-primary) 0%,
      var(--accent-primary) var(--progress),
      var(--surface-tertiary) var(--progress),
      var(--surface-tertiary) 100%
    );
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    border: 2px solid var(--surface-primary);
    box-shadow: 0 2px 8px var(--shadow-color);
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  .slider::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--accent-primary);
    cursor: pointer;
    border: 2px solid var(--surface-primary);
    box-shadow: 0 2px 8px var(--shadow-color);
  }

  .legend {
    display: flex;
    justify-content: space-between;
    gap: 0.25rem;
  }

  .legend-item {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }

  .legend-item:hover {
    color: var(--text-primary);
    background: var(--surface-tertiary);
  }

  .legend-item.active {
    color: var(--accent-primary);
    font-weight: 600;
  }
</style>