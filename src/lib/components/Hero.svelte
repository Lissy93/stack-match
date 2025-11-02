<script lang="ts">
  import { frameworkData } from '$lib/stores';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';
  import { ArrowRight, Github } from 'lucide-svelte';

  export let heroElement: HTMLElement | undefined = undefined;
  export let hideFrameworkList: boolean = false;
</script>

<div class="hero-wrapper">
  <header class="hero" bind:this={heroElement}>
    <div class="animated-bg"></div>

    <a
      href="https://github.com/lissy93/stack-match"
      target="_blank"
      rel="noopener noreferrer"
      class="github-button"
      aria-label="View on GitHub"
    >
      <Github size={20} />
      <span class="github-text">View on GitHub</span>
    </a>

    <div class="hero-main">
      <a href="/" class="title-group">
        <div class="icon-pulse">
          <img src="/logo.png" alt="Stack Match Logo" />
        </div>
        <h1>Stack Match</h1>
      </a>
      <p class="tagline">
        Compare frontend JavaScript frameworks, to find the best fit for your project
      </p>
      <p class="another-tagline">
        Data comes from <a href="https://github.com/Lissy93/framework-benchmarks" target="_blank" rel="noopener noreferrer">framework-benchmarks</a>,
        combined with analysis of source, bundle, downloads, community stats and more.
        Learn more <a href="/about">about the methodology</a>.
      </p>
    </div>

    {#if !hideFrameworkList && $frameworkData?.meta}
      <nav class="frameworks-nav" aria-label="Framework quick links">
        {#each $frameworkData.meta.filter(fw => fw.id !== 'vanilla') as framework, i}
          <a
            href="/{framework.id}"
            class="fw-link"
            title="View {framework.name} details"
            style="--brand: {framework.branding.color}; --delay: {i * 0.05}s"
          >
            <img
              src={getSimpleIconUrl(framework.branding.iconName, framework.branding.color)}
              alt={framework.name}
              width="32"
              height="32"
            />
          </a>
        {/each}
        <a href="/compare" class="compare-link" title="Compare frameworks">
          <ArrowRight size={20} />
          <span class="compare-text">Go!</span>
        </a>
      </nav>
    {/if}
  </header>
</div>

<style lang="scss">
  @keyframes heroFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bgPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      // box-shadow: 0 4px 20px color-mix(in srgb, var(--accent-primary) 30%, transparent);
    }
    50% {
      transform: scale(1.05);
      // box-shadow: 0 6px 30px color-mix(in srgb, var(--accent-primary) 50%, transparent);
    }
  }

  @keyframes iconSlideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideDownFade {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .hero-wrapper {
    margin: 0 auto var(--gap-xl) auto;
  }

  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xl);
    padding: var(--gap-2xl) var(--gap-xl);
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-2xl);
    position: relative;
    overflow: hidden;
    animation: heroFadeIn 0.8s ease-out;

    &::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-primary) 30%, var(--accent-gradient) 70%, transparent);
      opacity: 0.4;
      animation: shimmer 3s linear infinite;
    }
  }

  .github-button {
    position: absolute;
    top: var(--gap-lg);
    right: var(--gap-lg);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--surface-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--font-sm);
    font-weight: 500;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: var(--shadow-md);
    animation: slideDownFade 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.3s backwards;

    &:hover {
      background: var(--surface-tertiary);
      border-color: var(--accent-primary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      color: var(--text-primary);
    }
  }

  .github-text {
    white-space: nowrap;
  }

  .animated-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--accent-primary) 12%, transparent) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--accent-gradient) 8%, transparent) 0%, transparent 40%);
    animation: bgPulse 8s ease-in-out infinite;
    pointer-events: none;
  }

  .hero-main {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
    position: relative;
    z-index: 1;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
    text-decoration: none;
    cursor: pointer;
    transition: opacity var(--transition-normal);

    &:hover {
      opacity: 0.8;
    }
  }

  .icon-pulse {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    // background: linear-gradient(135deg, var(--accent-primary), var(--accent-gradient));
    background: none;
    border-radius: var(--radius-lg);
    color: white;
    animation: pulse 9s ease-in-out infinite;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  h1 {
    font-size: var(--font-4xl);
    font-weight: 800;
    margin: 0;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    font-size: var(--font-xl);
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
  .another-tagline {
    font-size: var(--font-md);
    color: var(--text-tertiary);
    margin: 0;
    line-height: 1.4;

    a {
      color: var(--accent-primary);
      text-decoration: underline;

      &:hover {
        color: var(--accent-gradient);
      }
    }
  }

  .frameworks-nav {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: var(--gap-sm);
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto;
  }

  .fw-link {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-primary);
    background: var(--surface-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    animation: iconSlideIn 0.5s ease-out backwards;
    animation-delay: var(--delay);
    padding: var(--gap-lg);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--brand);
      opacity: 0;
      transition: opacity 0.3s;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, var(--brand), transparent);
      border-radius: var(--radius-lg);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s;
    }

    &:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--brand) 35%, transparent);

      &::before { opacity: 0.15; }
      &::after { opacity: 0.4; }

      img {
        filter: grayscale(0);
        transform: scale(1.1) rotate(-3deg);
      }
    }

    img {
      position: relative;
      z-index: 1;
      filter: grayscale(0.1);
      transition: all 0.3s;
    }
  }

  .compare-link {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
    flex-direction: column;
    border-radius: var(--radius-lg);
    border: 2px solid var(--accent-primary);
    background: linear-gradient(135deg, var(--surface-primary), var(--surface-secondary));
    color: var(--accent-primary);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--accent-primary) 15%, transparent);
    font-weight: 600;
    font-size: var(--font-xs);
    text-decoration: none;
    animation: iconSlideIn 0.5s ease-out backwards;
    animation-delay: 0.85s;

    &:hover {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-gradient));
      color: white;
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--accent-primary) 40%, transparent);
    }
  }

  .compare-text {
    display: inline;
    line-height: 1;
  }

  @media (max-width: 1024px) {
    .hero-wrapper { margin: 48px auto var(--gap-xl); }

    .hero {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-lg);
      padding: var(--gap-xl) var(--gap-lg);
    }

    .frameworks-nav {
      grid-template-columns: repeat(9, 1fr);
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .hero-wrapper { margin: 32px auto var(--gap-lg); }
    .hero { padding: var(--gap-lg) var(--gap-md); }
    .icon-pulse { width: 44px; height: 44px; }
    h1 { font-size: var(--font-2xl); }
    .tagline { font-size: var(--font-sm); }
    .fw-link img { width: 28px; height: 28px; }

    .github-button {
      top: var(--gap-md);
      right: var(--gap-md);
      padding: 0.625rem 0.875rem;
      font-size: 0.8125rem;
    }

    .github-text {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .hero { padding: var(--gap-md); gap: var(--gap-md); }
    .title-group { gap: var(--gap-sm); }
    .icon-pulse { width: 40px; height: 40px; }
    h1 { font-size: var(--font-xl); }
    .tagline { font-size: var(--font-xs); }
    .frameworks-nav { grid-template-columns: repeat(6, 1fr); gap: var(--gap-xs); }
    .fw-link img { width: 24px; height: 24px; }
    .compare-text { font-size: 0.65rem; }

    .github-button {
      padding: 0.5rem;
    }
  }
</style>
