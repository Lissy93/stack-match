<script lang="ts">
  import BaseCard from './BaseCard.svelte';

  export let packageName: string | undefined;
  export let browserSupportUrl: string | undefined;

  const browsers = [
    { name: 'Chrome', icon: '🌐' },
    { name: 'Firefox', icon: '🦊' },
    { name: 'Safari', icon: '🧭' },
    { name: 'Edge', icon: '⚡' }
  ];
</script>

<BaseCard title="Browser Support" size="medium">
  {#if !packageName}
    <div class="no-data">
      <p>No package information available</p>
    </div>
  {:else}
    <div class="content">
      <div class="browsers-grid">
        {#each browsers as browser}
          <div class="browser-item">
            <span class="browser-icon" aria-hidden="true">{browser.icon}</span>
            <span class="browser-name">{browser.name}</span>
            <span class="support-badge supported">Supported</span>
          </div>
        {/each}
      </div>

      <div class="note">
        Modern frameworks typically support all evergreen browsers
      </div>

      {#if browserSupportUrl}
        <a
          href={browserSupportUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary"
          aria-label="View browser support documentation"
        >
          View Browser Support →
        </a>
      {:else}
        <a
          href="https://caniuse.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary"
          aria-label="Check compatibility on Can I Use"
        >
          Check on Can I Use →
        </a>
      {/if}
    </div>
  {/if}
</BaseCard>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .browsers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
  }

  .browser-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-lg);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .browser-icon {
    font-size: var(--font-2xl);
  }

  .browser-name {
    font-size: var(--font-sm);
    font-weight: 600;
    color: var(--text-primary);
  }

  .support-badge {
    font-size: var(--font-xs);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .supported {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .note {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
    text-align: center;
    font-style: italic;
    padding: 0 var(--gap-md);
  }

  .btn {
    padding: var(--gap-xs) var(--gap-md);
    width: fit-content;
    margin: 0 auto;
    font-size: var(--font-xs);
    color: var(--text-secondary);
    background: transparent;
    border: none;
    text-decoration: none;
    font-weight: 500;
    transition: all var(--transition-normal);
    text-align: center;
  }

  .btn:hover {
    color: var(--accent-primary);
    transform: translateX(2px);
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
    min-height: 150px;
  }

  .no-data p {
    margin: 0;
  }

  @media (max-width: 768px) {
    .browsers-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
