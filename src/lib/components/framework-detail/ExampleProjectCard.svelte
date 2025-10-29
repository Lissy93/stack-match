<script lang="ts">
  export let example: {
    title?: string;
    description?: string;
    repo?: string;
    website?: string;
    logo?: string;
  } | undefined = undefined;

  $: hasExample = example && example.title && example.repo;
  $: title = example?.title || '';
  $: description = example?.description || '';
  $: repo = example?.repo || '';
  $: website = example?.website || '';
  $: logo = example?.logo || '';
</script>

{#if hasExample}
  <div class="card example-project-card">
    <div class="card-header">
      <h3>Example Project</h3>
    </div>

    <div class="project-header">
      {#if logo}
        <div class="project-logo">
          <img src={logo} alt="{title} logo" />
        </div>
      {/if}

      <div class="project-info">
        <h4 class="project-title">{title}</h4>
        {#if description}
          <p class="project-description">{description}</p>
        {/if}
      </div>
    </div>

    <div class="project-links">
      {#if website}
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary"
        >
          <span class="link-icon">🌐</span>
          Visit Website
        </a>
      {/if}
      {#if repo}
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary"
        >
          <span class="link-icon">💻</span>
          View Source
        </a>
      {/if}
    </div>
  </div>
{/if}

<style>
  .example-project-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .project-header {
    display: flex;
    gap: var(--gap-lg);
    align-items: center;
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

  .project-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-sm);
    line-height: 1.5;
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

  .link-icon {
    font-size: var(--font-base);
    line-height: 1;
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
