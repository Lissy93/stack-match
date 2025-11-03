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

<style lang="scss">
  .search-container {
    position: relative;
    width: 100%;
    max-width: 320px;

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .search-input {
        width: 100%;
        padding: var(--gap-md) var(--gap-lg) var(--gap-md) 2.75rem;
        background: var(--surface-secondary);
        border: 1px solid var(--border-primary);
        border-radius: var(--radius-lg);
        font-size: var(--font-sm);
        color: var(--text-primary);
        transition: all var(--transition-normal);

        &:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-secondary);
        }

        &::placeholder {
          color: var(--text-secondary);
        }
      }

      :global(.search-icon) {
        position: absolute;
        left: var(--gap-sm-alt);
        color: var(--text-secondary);
        pointer-events: none;
        z-index: 1;
      }

      .clear-btn {
        position: absolute;
        right: var(--gap-md);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--gap-xs);
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: all var(--transition-normal);

        &:hover {
          color: var(--text-primary);
          background: var(--surface-tertiary);
        }
      }
    }
  }
</style>