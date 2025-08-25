<script lang="ts">
  import { Zap, Building2, Package, BookOpen, Rocket, Sparkles, Target } from 'lucide-svelte';
  import { PRESETS } from '../constants';
  import type { PresetName } from '../constants';
  import type { Weights } from '../types';

  export let onPresetSelect: (preset: Weights) => void;

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
  function formatPresetName(name: PresetName): string {
    return name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Handle preset selection
  function selectPreset(presetName: PresetName) {
    onPresetSelect(PRESETS[presetName]);
  }
</script>

<div class="preset-container">
  <h3 class="preset-title">Quick Presets</h3>
  <div class="preset-grid">
    {#each Object.keys(PRESETS) as presetName}
      {@const IconComponent = presetIcons[presetName]}
      <button
        type="button"
        class="preset-btn"
        on:click={() => selectPreset(presetName)}
        aria-label="Apply {formatPresetName(presetName)} preset"
      >
        <svelte:component this={IconComponent} size={16} />
        <span class="preset-name">{formatPresetName(presetName)}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .preset-container {
    margin-bottom: 2rem;
  }

  .preset-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
  }

  .preset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .preset-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-gradient));
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .preset-btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .preset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--shadow-color);
  }

  .preset-btn:hover:before {
    left: 100%;
  }

  .preset-btn:active {
    transform: translateY(0);
  }

  .preset-name {
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .preset-grid {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
    
    .preset-btn {
      padding: 0.625rem 0.75rem;
      font-size: 0.8125rem;
    }
  }
</style>