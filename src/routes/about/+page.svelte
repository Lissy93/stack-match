<script lang="ts">
  import DataSourceSection from '$lib/components/about-sections/DataSourceSection.svelte';
  import WhyBuiltSection from '$lib/components/about-sections/WhyBuiltSection.svelte';
  import ExperienceSection from '$lib/components/about-sections/ExperienceSection.svelte';
  import MoreProjectsSection from '$lib/components/about-sections/MoreProjectsSection.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>About - Stack Match</title>
  <meta name="description" content="Learn about Stack Match - an unbiased, data-driven framework comparison tool. Discover how we collect data and why this project was created." />
  <meta property="og:title" content="About Stack Match" />
  <meta property="og:description" content="An unbiased, data-driven tool to help you choose the right frontend framework for your project." />
</svelte:head>

<div class="about-page">
  <header class="page-header">
    <div class="animated-bg"></div>
    <div class="header-content">
      <h1>About Stack Match</h1>
      <p class="subtitle">
        An unbiased, data-driven tool to help you choose the right frontend framework for your project.
      </p>
    </div>
  </header>

  <div class="sections-container">
    <div class="section-wrapper" style="--delay: 0">
      <DataSourceSection />
    </div>
    <div class="section-wrapper" style="--delay: 1">
      <WhyBuiltSection />
    </div>
    <div class="section-wrapper" style="--delay: 2">
      <ExperienceSection repoStars={data.repoStars || {}} />
    </div>
    <div class="section-wrapper" style="--delay: 3">
      <MoreProjectsSection />
    </div>
  </div>
</div>

<style lang="scss">
  @keyframes bgPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes sectionSlideIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .about-page {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--gap-xl) var(--gap-lg);
    animation: fadeIn 0.5s ease-out;
  }

  .page-header {
    text-align: center;
    padding: var(--gap-2xl) var(--gap-xl);
    margin: var(--gap-xl) auto;
    border-radius: var(--radius-2xl);
    max-width: 1200px;
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-primary) 30%, var(--accent-gradient) 70%, transparent);
      opacity: 0.4;
      animation: shimmer 6s linear infinite;
    }
  }

  .animated-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--accent-primary) 12%, transparent) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--accent-gradient) 8%, transparent) 0%, transparent 40%);
    animation: bgPulse 16s ease-in-out infinite;
    pointer-events: none;
  }

  .header-content {
    position: relative;
    z-index: 1;

    h1 {
      font-size: var(--font-4xl);
      font-weight: 800;
      margin: 0 0 var(--gap-md) 0;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: var(--font-lg);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .sections-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-2xl);
  }

  .section-wrapper {
    animation: sectionSlideIn 0.5s ease-out backwards;
    animation-delay: calc(var(--delay) * 100ms);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    .about-page {
      padding: var(--gap-lg) var(--gap-md);
    }

    .page-header {
      padding: var(--gap-xl) var(--gap-lg);
    }

    .header-content {
      h1 {
        font-size: var(--font-2xl);
      }

      .subtitle {
        font-size: var(--font-base);
      }
    }

    .sections-container {
      gap: var(--gap-xl);
    }
  }
</style>
