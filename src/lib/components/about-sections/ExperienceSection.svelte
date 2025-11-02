<script lang="ts">
  import { Github, ExternalLink, Star } from 'lucide-svelte';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';
  import rawData from '../../../data.json';

  export let repoStars: Record<string, number> = {};

  const intro = [
    "Over the years, I've worked on hundreds of apps, everything from e-commerce for fortune-500 companies, to banking and high-frequency trading, to developer tools. "
    + "And, I've seen first-hand poor tech decisions being made based on incomplete data, personal preference, but most commonly people tend to just favour what they're already familiar with.",
    "Outside of work, I also build open source tools for developers. Through choosing the right tools for each job, these projects have been able to serve millions of users."
  ];

  // Format star count: exact number if < 1000, otherwise with 1 decimal like 8.2k
  function formatStars(count: number): string {
    if (count < 1000) return count.toString();
    return (count / 1000).toFixed(1) + 'k';
  }

  // Extract all example projects from data.json
  const projects = rawData.meta
    .filter(fw => fw.example && fw.example.title && fw.example.description)
    .map(fw => {
      const repoName = fw.example.repo?.split('/').pop()?.toLowerCase() || '';
      const starCount = repoStars[repoName] || 0;
      return {
        ...fw.example,
        frameworkId: fw.id,
        frameworkName: fw.name,
        brandColor: fw.branding?.color || '#3b82f6',
        iconName: fw.branding?.iconName || fw.id,
        stars: starCount,
        starsFormatted: formatStars(starCount)
      };
    })
    .sort((a, b) => b.stars - a.stars);
</script>

<section class="about-section">
  <div class="section-content">
    <h2>My experience in frontend</h2>
    {#each intro as paragraph}
      <p>{paragraph}</p>
    {/each}

    <div class="projects-grid">
      {#each projects as project}
        <article class="project-card">
          <div class="project-header">
            {#if project.logo}
              <img src={project.logo} alt={project.title} class="project-logo" />
            {/if}
            <h3>{project.title}</h3>
          </div>
          <p>{project.description}</p>
          <div class="project-badges">
            <a
              href="/{project.frameworkId}"
              class="badge framework-badge"
              style="--fw-color: {project.brandColor}"
            >
              <img
                src={getSimpleIconUrl(project.iconName, project.brandColor)}
                alt={project.frameworkName}
              />
              <span>{project.frameworkName}</span>
            </a>
            {#if project.website}
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                class="badge website-badge"
                aria-label="View {project.title} demo"
              >
                <ExternalLink size={14} />
                <span>Demo</span>
              </a>
            {/if}
            {#if project.repo}
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                class="badge github-badge"
                aria-label="View {project.title} on GitHub"
              >
                <span class="github-label">
                  <Github size={14} />
                  <span>GitHub</span>
                </span>
                <span class="github-separator"></span>
                <span class="github-stars">
                  <Star size={12} />
                  <span>{project.starsFormatted}</span>
                </span>
              </a>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style lang="scss">
  @import './about-shared.scss';

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--gap-md);
    margin-top: var(--gap-xl);
  }

  .project-card {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--surface-primary) 25%, transparent),
      color-mix(in srgb, var(--surface-primary) 20%, transparent)
    );
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--gap-lg);
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--accent-primary) 1%, transparent),
        transparent
      );
      transition: left 0.6s ease;
      pointer-events: none;
    }

    &:hover {
      box-shadow: var(--shadow-sm);

      &::before {
        left: 100%;
      }
    }

    h3 {
      font-size: var(--font-lg);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    p {
      font-size: var(--font-sm);
      color: var(--text-primary);
      margin: 0;
      flex: 1;
    }
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--gap-2xs) var(--gap-sm);
    background: var(--surface-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-sm);
    font-size: var(--font-xs);
    font-weight: 500;
    color: var(--text-secondary);
    transition: all var(--transition-normal);

    &:hover {
      background: var(--accent-primary);
      color: white;
      border-color: var(--accent-primary);
    }

    img {
      width: 14px;
      height: 14px;
      object-fit: contain;
    }
  }

  .project-header {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    margin-bottom: var(--gap-sm);
  }

  .project-logo {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    object-fit: contain;
    background: var(--surface-primary);
    padding: var(--gap-xs);
    border: 1px solid var(--border-primary);
  }

  .project-badges {
    .badge {
      padding: var(--gap-xs) var(--gap-sm);
    }
  }

  .github-badge {
    padding: 0 !important;
  }

  .framework-badge {
    background: color-mix(in srgb, var(--fw-color) 15%, transparent) !important;
    border-color: color-mix(in srgb, var(--fw-color) 30%, transparent) !important;
    color: var(--fw-color) !important;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    img {
      transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      background: var(--fw-color) !important;
      border-color: var(--fw-color) !important;
      color: var(--text-primary) !important;

      img {
        filter: brightness(0) invert(1);
      }
    }
  }

  .github-badge,
  .website-badge {
    &:hover {
      background: var(--accent-primary) !important;
      color: white !important;
      border-color: var(--accent-primary) !important;
    }
  }

  .github-badge {
    padding: 0;
    overflow: hidden;

    .github-label {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);
      padding: var(--gap-xs) var(--gap-sm);
    }

    .github-separator {
      width: 1px;
      height: 100%;
      background: var(--border-primary);
      opacity: 0.5;
    }

    .github-stars {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-2xs);
      background: color-mix(in srgb, var(--surface-primary) 20%, transparent);
      font-weight: 600;
      opacity: 0.9;
      padding: var(--gap-xs) var(--gap-sm);
    }
  }

  @media (max-width: 768px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
