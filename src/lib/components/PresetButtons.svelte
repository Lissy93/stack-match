<script lang="ts">
  import { Zap, Building2, Package, BookOpen, Rocket, Sparkles, Target } from 'lucide-svelte';
  import { PRESETS } from '../constants';
  import type { PresetName } from '../constants';
  import type { Weights } from '../types';

  export let onPresetSelect: (preset: Weights) => void;
  export let activePreset: string | null = null;

  // Icon mapping for presets
  const presetIcons: Record<PresetName, any> = {
    balanced: Sparkles,
    performance: Zap,
    enterprise: Building2,
    'tiny-bundle': Package,
    ecosystem: BookOpen,
    'easy-learning': BookOpen,
    startup: Rocket
  };

  // Capitalize preset names for display
  function formatPresetName(name: string): string {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Handle preset selection
  function selectPreset(presetName: string) {
    onPresetSelect(PRESETS[presetName as PresetName]);
  }

  // Get icon component for preset
  function getIconComponent(presetName: string) {
    return presetIcons[presetName as PresetName];
  }
</script>

<div class="preset-container">
  <h3 class="preset-title">Quick Presets</h3>
  <div class="preset-grid">
    {#each Object.keys(PRESETS) as presetName}
      {@const IconComponent = getIconComponent(presetName)}
      <button
        type="button"
        class="preset-btn"
        class:selected={activePreset === presetName}
        on:click={() => selectPreset(presetName)}
        aria-label="Apply {formatPresetName(presetName)} preset"
      >
        <svelte:component this={IconComponent} size={16} />
        <span class="preset-name">{formatPresetName(presetName)}</span>
      </button>
    {/each}
  </div>
</div>

<style lang="scss">
  .preset-container {
    margin-bottom: var(--gap-lg);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-xs);

    .preset-title {
      font-size: var(--font-base);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      min-width: 128px;
      opacity: 0.85;
    }

    .preset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--gap-sm);
      width: 100%;
    }
  }

  .preset-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-lg);
    background: var(--color-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    font-weight: 600;
    font-size: var(--font-sm);
    cursor: pointer;
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
    min-height: 40px;

    &.selected {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-gradient));
      border-color: var(--accent-primary);
      box-shadow: var(--shadow-accent-md);

      &:hover {
        box-shadow: var(--shadow-accent-lg);

        &:before {
          background: linear-gradient(90deg, transparent, var(--overlay-medium), transparent);
        }
      }
    }

    :global(svg) {
      flex-shrink: 0;
      min-width: 16px;
      min-height: 16px;
    }

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--overlay-light), transparent);
      transition: left 0.5s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);

      &:before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
    }

    .preset-name {
      white-space: nowrap;
    }
  }

  @media (max-width: 640px) {
    .preset-container .preset-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .preset-btn {
      padding: 10px var(--gap-md);
      font-size: var(--font-sm-alt);
      min-height: 36px;
      gap: 6px;

      .preset-name {
        font-size: var(--font-xs);
      }
    }

    :global(.preset-btn svg) {
      min-width: 14px;
      min-height: 14px;
    }
  }
</style>
