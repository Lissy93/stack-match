<script lang="ts">
  import data from '../../../data.json';
  import { Globe, Github, Rocket } from 'lucide-svelte';

  export let example: {
    title?: string;
    description?: string;
    repo?: string;
    website?: string;
    logo?: string;
  } | undefined = undefined;
  export let frameworkId: string | undefined = undefined;
  export let small: boolean = false;

  // If example is not provided but frameworkId is, fetch from data.json
  $: actualExample = example || (frameworkId ? data.meta.find((m: any) => m.id === frameworkId)?.example : undefined);

  $: hasExample = actualExample && actualExample.title && actualExample.repo;
  $: title = actualExample?.title || '';
  $: description = actualExample?.description || '';
  $: repo = actualExample?.repo || '';
  $: website = actualExample?.website || '';
  $: logo = actualExample?.logo || '';

  // Extract repo name from GitHub URL for the star badge
  $: repoName = repo ? repo.match(/github\.com\/[^\/]+\/([^\/]+)/)?.[1] || '' : '';
  $: starBadgeUrl = repoName ? `https://img.shields.io/github/stars/lissy93/${repoName}?label=lissy93%2F${repoName}` : '';
  $: githubUrl = repoName ? `https://github.com/lissy93/${repoName}` : repo;
</script>

{#if hasExample}
  <div class="card example-project-card" class:compact={small}>
    {#if !small}
      <div class="card-header">
        <h3>
          <span class="title-icon"><Rocket size={20} /></span>
          Example Project
        </h3>
      </div>
    {/if}

    <a
      href={repo}
      target="_blank"
      rel="noopener noreferrer"
      class="project-header"
    >
      {#if logo}
        <div class="project-logo" class:small>
          <img src={logo} alt="{title} logo" />
        </div>
      {/if}

      <div class="project-info">
        <h4 class="project-title" class:small>{title}</h4>
        {#if description}
          <p class="project-description" class:small>{description}</p>
        {/if}
        {#if !small && starBadgeUrl}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="star-badge-link"
          >
            <img src={starBadgeUrl} alt="{title} GitHub stars" class="star-badge" />
          </a>
        {/if}
      </div>
    </a>

    {#if small && starBadgeUrl}
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="star-badge-link"
      >
        <img src={starBadgeUrl} alt="{title} GitHub stars" class="star-badge" />
      </a>
    {/if}

    {#if !small}
      <div class="project-links">
        {#if website}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            <Globe size={18} />
            <span>Visit Website</span>
          </a>
        {/if}
        {#if repo}
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-secondary"
          >
            <Github size={18} />
            <span>View Source</span>
          </a>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .star-badge-link {
    display: inline-flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .star-badge-link:hover {
    transform: translateY(-1px);
  }

  .star-badge {
    filter: invert(1) brightness(1.25) sepia(3) hue-rotate(212deg);
    height: 22px;
    max-width: 100%;
    width: auto;
  }


  .example-project-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .example-project-card.compact {
    gap: var(--gap-sm);
    justify-content: space-between;
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    margin: 0;
    font-size: var(--font-lg);
  }

  .title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
  }

  .project-header {
    display: flex;
    gap: var(--gap-lg);
    align-items: center;
    text-decoration: none;
    color: inherit;
    padding: var(--gap-sm);
    margin: calc(-1 * var(--gap-sm));
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .project-header:hover {
    background: var(--surface-tertiary);
    transform: translateY(-1px);
  }

  .project-header:hover .project-title {
    color: var(--accent-primary);
  }

  .project-logo {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-lg);
    padding: var(--gap-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-primary);
  }

  .project-logo.small {
    width: 40px;
    height: 40px;
    padding: var(--gap-xs);
  }

  .project-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: var(--radius-md);
  }

  .project-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .project-title {
    margin: 0;
    font-size: var(--font-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  .project-title.small {
    font-size: var(--font-sm);
  }

  .project-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-sm);
    line-height: 1.5;
  }

  .project-description.small {
    font-size: var(--font-xs);
    line-height: 1.4;
  }

  .project-links {
    display: flex;
    gap: var(--gap-md);
    flex-wrap: wrap;
    padding-top: var(--gap-sm);
  }


  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-lg);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-sm);
    transition: all 0.2s ease;
    border: 1px solid transparent;
    cursor: pointer;
  }



  .btn-primary {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
  }

  .btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .btn-secondary {
    background: var(--surface-secondary);
    color: var(--text-primary);
    border-color: var(--border-primary);
  }

  .btn-secondary:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
  }


  @media (max-width: 768px) {
    .project-header {
      flex-direction: row;
      align-items: flex-start;
    }

    .project-logo {
      width: 64px;
      height: 64px;
    }

    .project-title {
      font-size: var(--font-base);
    }

    .project-description {
      font-size: var(--font-xs);
    }

    .project-links {
      flex-direction: column;
      width: 100%;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
