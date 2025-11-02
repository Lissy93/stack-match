<script lang="ts">
  import { Github, ExternalLink, Heart, Sparkles } from 'lucide-svelte';

  const links = [
    {
      icon: ExternalLink,
      text: 'View all my projects',
      url: 'https://apps.aliciasykes.com'
    },
    {
      icon: Github,
      text: 'Follow me on GitHub',
      url: 'https://github.com/Lissy93'
    }
  ];
</script>

<section class="about-section">
  <div class="section-content">
    <h2>Want more like this?</h2>
    <p>
      I build free and open source apps for developers, with a focus on privacy and security.
      If that sounds interesting to you, check out my other projects or follow me on GitHub.
    </p>

    <div class="cta-buttons">
      {#each links as link}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="cta-button"
        >
          <svelte:component this={link.icon} size={18} />
          <span>{link.text}</span>
        </a>
      {/each}
    </div>

    <div class="sponsor-note">
      <div class="sponsor-text">
        <Heart size={16} />
        <span>This work has been made possible thanks to my very kind sponsors on GitHub.</span>
      </div>
      <a
        href="https://github.com/sponsors/Lissy93"
        target="_blank"
        rel="noopener noreferrer"
        class="sponsor-button"
      >
        <Sparkles size={14} />
        <span>Sponsor</span>
      </a>
    </div>
    <iframe class="sponsors-grid" src="https://readme-contribs.as93.net/sponsors/lissy93?perRow=12&shape=circle&textColor=ffffff" title="sponsors"></iframe>
  </div>
</section>

<style lang="scss">
  .about-section {
    padding: 0;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
    max-width: 1200px;
    margin: 0 auto;

    .section-content {
      background: var(--surface-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: var(--gap-2xl);
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-md);
      }
    }

    h2 {
      font-size: var(--font-2xl);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--gap-lg) 0;
      letter-spacing: -0.02em;
    }

    p {
      font-size: var(--font-base);
      line-height: 1.7;
      color: var(--text-secondary);
      margin: 0 0 var(--gap-md) 0;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .about-section {
      h2 {
        font-size: var(--font-xl);
      }

      .section-content {
        padding: var(--gap-lg);
      }
    }
  }

  .sponsors-grid {
    width: 100%;
    margin-top: var(--gap-md);
    outline: none;
    border: none;
    min-height: 12rem;
  }

  .cta-buttons {
    display: flex;
    gap: var(--gap-md);
    margin: var(--gap-lg) 0;
    flex-wrap: wrap;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-lg);
    background: var(--accent-primary);
    color: var(--text-primary);
    border: 1px solid var(--accent-primary);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: var(--font-base);
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--accent-primary) 80%, black),
        color-mix(in srgb, var(--accent-primary) 70%, black)
      );
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      color: var(--text-primary) !important;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);

      &::before {
        opacity: 1;
      }
    }

    :global(svg),
    span {
      position: relative;
      z-index: 1;
    }
  }

  .sponsor-note {
    --sponsor-color: #ff50c9;

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-md);
    padding: var(--gap-md);
    background: color-mix(in srgb, var(--sponsor-color) 15%, transparent);
    border-left: 3px solid var(--sponsor-color);
    border-radius: var(--radius-sm);
    margin-top: var(--gap-lg);
    flex-wrap: wrap;

    .sponsor-text {
      display: flex;
      align-items: center;
      gap: var(--gap-sm);
      font-size: var(--font-sm);
      color: var(--text-secondary);
      flex: 1;
      min-width: 200px;

      :global(svg) {
        color: var(--sponsor-color);
        flex-shrink: 0;
      }
    }

    .sponsor-button {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);
      padding: var(--gap-xs) var(--gap-md);
      background: var(--sponsor-color);
      color: white;
      border: 1px solid var(--sponsor-color);
      border-radius: var(--radius-sm);
      font-size: var(--font-sm);
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;

      &:hover {
        background: color-mix(in srgb, var(--sponsor-color) 85%, black);
        border-color: color-mix(in srgb, var(--sponsor-color) 85%, black);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--sponsor-color) 30%, transparent);
      }
    }

    a {
      border-bottom: none !important;
    }
  }

  @media (max-width: 768px) {
    .cta-buttons {
      flex-direction: column;
    }

    .cta-button {
      justify-content: center;
    }

    .sponsor-note {
      flex-direction: column;
      align-items: flex-start;

      .sponsor-text {
        min-width: 100%;
      }

      .sponsor-button {
        align-self: stretch;
        justify-content: center;
      }
    }
  }
</style>
