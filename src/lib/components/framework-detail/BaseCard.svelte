<script lang="ts">
  export let title: string = '';
  export let size: 'default' | 'large' | 'wide' = 'default';
  export let headerSlot: boolean = false;
  export let icon: any = undefined;
</script>

<div class="card" class:card-large={size === 'large'} class:card-wide={size === 'wide'}>
  {#if headerSlot}
    <div class="card-header">
      <slot name="header" />
    </div>
  {:else if title}
    <h3 class:with-icon={icon}>
      {#if icon}
        <span class="title-icon">
          <svelte:component this={icon} size={20} />
        </span>
      {/if}
      {title}
    </h3>
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

  h3.with-icon {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
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
