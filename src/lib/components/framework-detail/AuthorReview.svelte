<script lang="ts">
  import { marked } from 'marked';
  import BaseCard from './BaseCard.svelte';
  import { MessageSquareText } from 'lucide-svelte';

  export let frameworkId: string;
  export let example: {
    title?: string;
    repo?: string;
  } | undefined = undefined;

  let loading = true;
  let error: string | null = null;
  let thoughts: string = '';
  let about: string = '';

  // Extract repo name from GitHub URL
  $: exampleRepoName = example?.repo ? example.repo.match(/github\.com\/[^\/]+\/([^\/]+)/)?.[1] || '' : '';
  $: exampleUrl = exampleRepoName ? `https://github.com/lissy93/${exampleRepoName}` : example?.repo;

  // Configure marked for better security and consistent rendering
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  async function fetchCommentary() {
    try {
      loading = true;
      error = null;
      thoughts = '';
      about = '';

      const response = await fetch(
        'https://raw.githubusercontent.com/Lissy93/framework-benchmarks/refs/heads/main/website/static/framework-commentary.json'
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch commentary: ${response.status}`);
      }

      const data = await response.json();
      const framework = data.items?.find((item: any) => item.id === frameworkId);

      if (framework && framework.thoughts) {
        thoughts = await marked.parse(framework.thoughts);
        about = framework.about || '';
      } else {
        error = 'No author review available for this framework yet.';
      }
    } catch (err) {
      console.error('Error fetching framework commentary:', err);
      error = err instanceof Error ? err.message : 'Failed to load author review';
    } finally {
      loading = false;
    }
  }

  // Reactively fetch commentary when frameworkId changes
  $: if (frameworkId) {
    fetchCommentary();
  }
</script>

{#if loading}
  <BaseCard title="Author's Review" icon={MessageSquareText} size="wide">
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading review...</p>
    </div>
  </BaseCard>
{:else if error}
  <BaseCard title="Author's Review" icon={MessageSquareText} size="wide">
    <div class="error-state">
      <p>{error}</p>
    </div>
  </BaseCard>
{:else if thoughts}
  <BaseCard title="Author's Review" icon={MessageSquareText} size="wide">
    {#if about}
      <div class="about-section">
        <p>{about}</p>
      </div>
    {/if}

    <div class="review-content">
      {@html thoughts}
    </div>

    <div class="attribution">
      <p>
        Review by <a href="https://github.com/Lissy93" target="_blank" rel="noopener noreferrer">Alicia Sykes</a>
        based on hands-on experience building
        {#if example?.title && exampleUrl}
          <a href={exampleUrl} target="_blank" rel="noopener noreferrer">{example.title}</a>
          and
        {/if}
        <a href="https://github.com/Lissy93/framework-benchmarks" target="_blank" rel="noopener noreferrer">framework-benchmarks</a>.
      </p>
    </div>
  </BaseCard>
{/if}

<style lang="scss">
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-2xl);
    text-align: center;

    p {
      margin-top: var(--gap-md);
      color: var(--text-secondary);
      font-size: var(--font-sm);
    }
  }

  .error-state p {
    margin-top: 0;
    color: var(--text-tertiary);
  }

  .spinner {
    width: var(--gap-2xl);
    height: var(--gap-2xl);
    border: 3px solid var(--border-primary);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .about-section {
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-left: 3px solid var(--accent-primary);
    border-radius: var(--radius-md);

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--font-sm);
      line-height: 1.6;
    }
  }

  .review-content {
    color: var(--text-primary);
    font-size: var(--font-base);
    line-height: 1.7;

    :global(p) {
      margin: 0 0 var(--gap-md) 0;
      &:last-child { margin-bottom: 0; }
    }

    :global(strong) {
      font-weight: 600;
      color: var(--text-primary);
    }

    :global(em) {
      font-style: italic;
      color: var(--text-secondary);
    }

    :global(code) {
      padding: var(--gap-xs) var(--gap-sm);
      background: var(--surface-tertiary);
      border-radius: var(--radius-sm);
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      color: var(--accent-primary);
    }

    :global(a) {
      color: var(--accent-primary);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color var(--transition-fast);

      &:hover { border-bottom-color: var(--accent-primary); }
    }

    :global(ul),
    :global(ol) {
      margin: var(--gap-md) 0;
      padding-left: var(--gap-xl);
    }

    :global(li) {
      margin: var(--gap-sm) 0;
      line-height: 1.6;
    }

    :global(ul li) { list-style-type: disc; }
    :global(ol li) { list-style-type: decimal; }

    :global(blockquote) {
      margin: var(--gap-lg) 0;
      padding: var(--gap-md) var(--gap-lg);
      border-left: 3px solid var(--accent-primary);
      background: var(--surface-tertiary);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
    }

    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4) {
      margin: var(--gap-lg) 0 var(--gap-md) 0;
      font-weight: 600;
      color: var(--text-primary);
    }

    :global(h1) { font-size: var(--font-2xl); }
    :global(h2) { font-size: var(--font-xl); }
    :global(h3) { font-size: var(--font-lg); }
    :global(h4) { font-size: var(--font-base); }

    @media (max-width: 768px) {
      font-size: var(--font-sm);
    }
  }

  .attribution {
    padding-top: var(--gap-sm);
    border-top: 1px solid var(--border-primary);
    opacity: 0.65;

    p {
      margin: 0;
      font-size: var(--font-sm);
      color: var(--text-tertiary);
      font-style: italic;
    }

    a {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 500;
      transition: color var(--transition-fast);

      &:hover {
        color: color-mix(in srgb, var(--accent-primary) 80%, white);
        text-decoration: underline;
      }
    }
  }
</style>
