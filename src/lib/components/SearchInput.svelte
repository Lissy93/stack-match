<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import { debounce } from '../utils';

  export let value: string = '';
  export let onValueChange: (value: string) => void;
  export let placeholder: string = 'Search frameworks...';

  // Debounced search to avoid excessive updates
  const debouncedSearch = debounce((query: string) => {
    onValueChange(query);
  }, 300);

  // Handle input changes
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    debouncedSearch(value);
  }

  // Clear search
  function clearSearch() {
    value = '';
    onValueChange('');
  }
</script>

<div class="search-container">
  <div class="search-input-wrapper">
    <Search size={18} class="search-icon" />
    <input
      type="text"
      {placeholder}
      bind:value
      on:input={handleInput}
      class="search-input"
      aria-label="Search frameworks"
    />
    {#if value}
      <button
        type="button"
        class="clear-btn"
        on:click={clearSearch}
        aria-label="Clear search"
      >
        <X size={16} />
      </button>
    {/if}
  </div>
</div>

<style>
  .search-container {
    position: relative;
    width: 100%;
    max-width: 320px;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-secondary);
  }

  .search-input::placeholder {
    color: var(--text-secondary);
  }

  :global(.search-icon) {
    position: absolute;
    left: 0.875rem;
    color: var(--text-secondary);
    pointer-events: none;
    z-index: 1;
  }

  .clear-btn {
    position: absolute;
    right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
  }

  .clear-btn:hover {
    color: var(--text-primary);
    background: var(--surface-tertiary);
  }
</style>