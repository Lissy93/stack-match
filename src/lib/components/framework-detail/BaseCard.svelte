<script lang="ts">
  export let title: string = '';
  export let size: 'default' | 'large' | 'wide' = 'default';
  export let headerSlot: boolean = false;
</script>

<div class="card" class:card-large={size === 'large'} class:card-wide={size === 'wide'}>
  {#if headerSlot}
    <div class="card-header">
      <slot name="header" />
    </div>
  {:else if title}
    <h3>{title}</h3>
  {/if}

  <slot />
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header :global(h2),
  .card-header :global(h3) {
    margin: 0;
    font-size: var(--font-xl);
  }
</style>
