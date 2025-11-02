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
    <h1>About Stack Match</h1>
    <p class="subtitle">
      An unbiased, data-driven tool to help you choose the right frontend framework for your project.
    </p>
  </header>

  <div class="sections-container">
    <DataSourceSection />
    <WhyBuiltSection />
    <ExperienceSection repoStars={data.repoStars || {}} />
    <MoreProjectsSection />
  </div>
</div>

<style lang="scss">
  .about-page {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--gap-xl) var(--gap-lg);
    animation: fadeIn 0.5s ease-out;
  }

  .page-header {
    text-align: center;
    padding: var(--gap-2xl) 0;
    margin-bottom: var(--gap-xl);

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
      padding: var(--gap-xl) 0;

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
