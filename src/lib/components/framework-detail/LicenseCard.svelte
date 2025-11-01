<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';
  import { Scale } from 'lucide-svelte';

  export let license: any;

  let licenseDetails: any = null;
  let loading = true;
  let showLicenseText = false;
  let rateLimited = false;

  onMount(async () => {
    if (license?.key) {
      try {
        // Use our API endpoint instead of calling GitHub directly
        // This allows us to use GITHUB_TOKEN for authentication
        const response = await fetch(`/api/license/${license.key}`);
        if (response.ok) {
          licenseDetails = await response.json();
        } else if (response.status === 403) {
          // GitHub API rate limit - show basic info
          rateLimited = true;
          console.debug('License details rate limited, using basic info');
        } else {
          console.debug(`License API returned ${response.status}, using basic info`);
        }
      } catch (error) {
        // Network error - silently fall back to basic info
        console.debug('Failed to fetch license details:', error);
      } finally {
        loading = false;
      }
    } else {
      loading = false;
    }
  });

  function toggleLicenseText() {
    showLicenseText = !showLicenseText;
  }
</script>

<BaseCard title="License">
  {#if loading}
    <div class="loading">Loading license details...</div>
  {:else if licenseDetails}
    <div class="license-header">
      <div class="license-name">
        <h4>{licenseDetails.name}</h4>
      </div>
      {#if licenseDetails.html_url}
        <a
          href={licenseDetails.html_url}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary btn-sm"
        >
          Learn More
        </a>
      {/if}
    </div>

    {#if licenseDetails.description}
      <p class="license-description">{licenseDetails.description}</p>
    {/if}

    <div class="license-details">
      {#if licenseDetails.permissions && licenseDetails.permissions.length > 0}
        <div class="license-section">
          <h5>✓ Permissions</h5>
          <ul>
            {#each licenseDetails.permissions as permission}
              <li class="permission-item">{permission.replace(/-/g, ' ')}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if licenseDetails.conditions && licenseDetails.conditions.length > 0}
        <div class="license-section">
          <h5>⚠ Conditions</h5>
          <ul>
            {#each licenseDetails.conditions as condition}
              <li class="condition-item">{condition.replace(/-/g, ' ')}</li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if licenseDetails.limitations && licenseDetails.limitations.length > 0}
        <div class="license-section">
          <h5>✕ Limitations</h5>
          <ul>
            {#each licenseDetails.limitations as limitation}
              <li class="limitation-item">{limitation.replace(/-/g, ' ')}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    {#if licenseDetails.body}
      <div class="license-text-section">
        <button
          class="btn btn-ghost btn-sm"
          on:click={toggleLicenseText}
          aria-expanded={showLicenseText}
        >
          {showLicenseText ? '▼ Hide' : '▶ Show'} Full License Text
        </button>

        {#if showLicenseText}
          <pre class="license-text">{licenseDetails.body}</pre>
        {/if}
      </div>
    {/if}
  {:else if license}
    <div class="license-fallback">
      <p class="license-name-text">
        <Scale size={16} />
        {license.name}
      </p>
      {#if rateLimited}
        <p class="rate-limit-notice">
          Full license details temporarily unavailable. Visit the GitHub repository for complete information.
        </p>
      {/if}
    </div>
  {:else}
    <p class="no-license">No license information available</p>
  {/if}
</BaseCard>

<style>

  .loading {
    color: var(--text-tertiary);
    font-style: italic;
    padding: var(--gap-md);
  }

  .license-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-md);
  }

  .license-name {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    flex: 1;
  }

  .license-badge {
    display: inline-block;
    padding: var(--gap-xs) var(--gap-sm);
    background: var(--accent-secondary);
    color: var(--accent-primary);
    border-radius: var(--radius-sm);
    font-size: var(--font-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: fit-content;
  }

  .license-name h4 {
    margin: 0;
    font-size: var(--font-base);
    color: var(--text-primary);
  }

  .license-description {
    color: var(--text-secondary);
    font-size: var(--font-sm);
    line-height: 1.6;
    margin: 0;
  }

  .license-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--gap-lg);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .license-section h5 {
    margin: 0 0 var(--gap-sm) 0;
    font-size: var(--font-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
  }

  .license-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .license-section li {
    font-size: var(--font-sm);
    color: var(--text-primary);
    text-transform: capitalize;
    padding-left: var(--gap-md);
    position: relative;
  }

  .permission-item::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #22c55e;
    font-weight: 700;
  }

  .condition-item::before {
    content: '⚠';
    position: absolute;
    left: 0;
    color: #fbbf24;
  }

  .limitation-item::before {
    content: '✕';
    position: absolute;
    left: 0;
    color: #ef4444;
    font-weight: 700;
  }

  .license-text-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }

  .btn-sm {
    padding: var(--gap-sm) var(--gap-md);
    font-size: var(--font-sm);
  }

  .license-text {
    background: var(--surface-tertiary);
    padding: var(--gap-lg);
    border-radius: var(--radius-md);
    font-size: var(--font-xs);
    line-height: 1.6;
    color: var(--text-secondary);
    overflow-x: auto;
    max-height: 400px;
    overflow-y: auto;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .license-fallback {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
  }

  .license-fallback .license-name-text {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-base);
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .rate-limit-notice {
    margin: var(--gap-sm) 0 0 0;
    padding: var(--gap-sm);
    background: var(--surface-secondary);
    border-radius: var(--radius-sm);
    color: var(--text-tertiary);
    font-size: var(--font-xs);
    font-style: italic;
  }

  .no-license {
    color: var(--text-tertiary);
    font-style: italic;
    padding: var(--gap-md);
    margin: 0;
  }

  @media (max-width: 768px) {
    .license-details {
      grid-template-columns: 1fr;
    }

    .license-header {
      flex-direction: column;
    }
  }
</style>
