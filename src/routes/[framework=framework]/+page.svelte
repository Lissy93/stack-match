<script lang="ts">
  import type { PageData } from './$types';
  import OverviewCard from '$lib/components/framework-detail/OverviewCard.svelte';
  import GitHubStatsCard from '$lib/components/framework-detail/GitHubStatsCard.svelte';
  import NPMStatsCard from '$lib/components/framework-detail/NPMStatsCard.svelte';
  import BundleSizeCard from '$lib/components/framework-detail/BundleSizeCard.svelte';
  import SecurityCard from '$lib/components/framework-detail/SecurityCard.svelte';
  import ActivityChartCard from '$lib/components/framework-detail/ActivityChartCard.svelte';
  import ContributorsCard from '$lib/components/framework-detail/ContributorsCard.svelte';
  import EcosystemHealthCard from '$lib/components/framework-detail/EcosystemHealthCard.svelte';
  import FrameworkScoresCard from '$lib/components/framework-detail/FrameworkScoresCard.svelte';
  import VideoCard from '$lib/components/framework-detail/VideoCard.svelte';
  import LicenseCard from '$lib/components/framework-detail/LicenseCard.svelte';
  import CommitHeatmapCard from '$lib/components/framework-detail/CommitHeatmapCard.svelte';
  import EcosystemPackagesCard from '$lib/components/framework-detail/EcosystemPackagesCard.svelte';
  import InstallMetricsCard from '$lib/components/framework-detail/InstallMetricsCard.svelte';
  import DownloadTrendsCard from '$lib/components/framework-detail/DownloadTrendsCard.svelte';
  import SourceRankCard from '$lib/components/framework-detail/SourceRankCard.svelte';
  import StarHistoryCard from '$lib/components/framework-detail/StarHistoryCard.svelte';
  import LinksCard from '$lib/components/framework-detail/LinksCard.svelte';
  import ExampleProjectCard from '$lib/components/framework-detail/ExampleProjectCard.svelte';
  import AuthorReview from '$lib/components/framework-detail/AuthorReview.svelte';
  import StackOverflowCard from '$lib/components/framework-detail/StackOverflowCard.svelte';
  import OpenCollectiveCard from '$lib/components/framework-detail/OpenCollectiveCard.svelte';
  import JsDelivrStatsCard from '$lib/components/framework-detail/JsDelivrStatsCard.svelte';
  import BrowserCompatCard from '$lib/components/framework-detail/BrowserCompatCard.svelte';
  import { getSimpleIconUrl, addAlpha, getContrastColor } from '$lib/utils/branding-utils';
  import { goto } from '$app/navigation';
  import { ChevronDown } from 'lucide-svelte';
  import rawData from '../../data.json';
  import { generateFrameworkMetaTags, generateFrameworkSchema, generateBreadcrumbSchema } from '$lib/seo';

  export let data: PageData;

  let dropdownOpen = false;
  let compareButtonElement: HTMLButtonElement;
  let dropdownPosition = { top: 0, left: 0, right: 'auto' };

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
    if (dropdownOpen && compareButtonElement) {
      const rect = compareButtonElement.getBoundingClientRect();
      const dropdownWidth = 280; // min-width from CSS
      const spaceOnRight = window.innerWidth - rect.right;
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // On mobile, center the dropdown or make it full-width with padding
        const padding = 16;
        dropdownPosition = {
          top: rect.bottom + 8,
          left: padding,
          right: 'auto'
        };
      } else {
        // On desktop, align to the right of the button
        dropdownPosition = {
          top: rect.bottom + 8,
          left: spaceOnRight >= dropdownWidth ? rect.right - dropdownWidth : rect.left,
          right: 'auto'
        };
      }
    }
  }

  function handleCompareWith(compareFrameworkId: string) {
    dropdownOpen = false;
    goto(`/compare?frameworks=${frameworkId},${compareFrameworkId}`);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.compare-dropdown')) {
      dropdownOpen = false;
    }
  }

  $: ({ frameworkId, frameworkData, staticData, apiError } = data);
  $: error = apiError?.message || null;
  $: brandColor = staticData?.meta?.branding?.color || '#3b82f6';
  $: iconUrl = staticData?.meta?.branding?.iconName ? getSimpleIconUrl(staticData.meta.branding.iconName, brandColor) : '';
  $: brandColorRgba = addAlpha(brandColor, 0.1);
  $: brandColorRgbaMedium = addAlpha(brandColor, 0.2);
  $: textColor = getContrastColor(brandColor);

  // Get all available frameworks for comparison dropdown
  $: availableFrameworks = (rawData?.meta || [])
    .filter(fw => fw.id !== frameworkId && fw.id !== 'vanilla')
    .sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));

  // Track missing data sections
  $: missingDataSections = frameworkData ? [
    !frameworkData.github?.stars && 'GitHub statistics',
    !frameworkData.npm?.name && 'NPM statistics',
    !frameworkData.bundle?.size && 'Bundle size data',
    !frameworkData.security?.vulnerabilities && 'Security audit',
    (!frameworkData.github?.commit_activity || !Array.isArray(frameworkData.github?.commit_activity)) && 'Commit activity',
    (!frameworkData.github?.contributors?.top_contributors || frameworkData.github.contributors.top_contributors.length === 0) && 'Contributors data',
    (!frameworkData.ecosystem?.packages || frameworkData.ecosystem?.packages?.length === 0) && 'Ecosystem packages',
    !frameworkData.github?.license && 'License information',
  ].filter(Boolean) : [];

  // SEO meta tags
  $: metaTags = staticData?.meta ? generateFrameworkMetaTags({
    id: frameworkId,
    name: staticData.meta.name || frameworkId,
    description: staticData.meta.description || '',
    longDescription: staticData.meta.longDescription,
    branding: staticData.meta.branding
  }) : null;

  // Structured data
  $: frameworkSchema = staticData?.meta ? generateFrameworkSchema({
    id: frameworkId,
    name: staticData.meta.name || frameworkId,
    description: staticData.meta.description || '',
    links: staticData.meta.links
  }, {
    github: frameworkData?.github,
    npm: frameworkData?.npm
  }) : null;

  $: breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://stack-match.as93.net/' },
    { name: staticData?.meta?.name || frameworkId, url: `https://stack-match.as93.net/${frameworkId}` }
  ]);
</script>

<svelte:head>
  {#if metaTags}
    <!-- Primary Meta Tags -->
    <title>{metaTags.title}</title>
    <meta name="title" content={metaTags.title} />
    <meta name="description" content={metaTags.description} />
    <meta name="keywords" content={metaTags.keywords} />
    <meta name="author" content="Alicia Sykes" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={metaTags.canonical} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={metaTags.openGraph.type} />
    <meta property="og:url" content={metaTags.openGraph.url} />
    <meta property="og:title" content={metaTags.openGraph.title} />
    <meta property="og:description" content={metaTags.openGraph.description} />
    <meta property="og:image" content={metaTags.openGraph.image} />
    <meta property="og:image:width" content={metaTags.openGraph.imageWidth} />
    <meta property="og:image:height" content={metaTags.openGraph.imageHeight} />
    <meta property="og:image:alt" content={metaTags.openGraph.imageAlt} />
    <meta property="og:site_name" content={metaTags.openGraph.siteName} />

    <!-- Twitter -->
    <meta property="twitter:card" content={metaTags.twitter.card} />
    <meta property="twitter:url" content={metaTags.twitter.url} />
    <meta property="twitter:title" content={metaTags.twitter.title} />
    <meta property="twitter:description" content={metaTags.twitter.description} />
    <meta property="twitter:image" content={metaTags.twitter.image} />
    <meta property="twitter:creator" content={metaTags.twitter.creator} />
  {:else}
    <!-- Fallback Meta Tags -->
    <title>{frameworkData?.name || frameworkId} - Framework Details | Stack Match</title>
    <meta name="description" content="Detailed statistics and ecosystem health for {frameworkData?.name || frameworkId}" />
  {/if}

  <!-- Structured Data -->
  {#if frameworkSchema}
    <script type="application/ld+json">
      {JSON.stringify(frameworkSchema)}
    </script>
  {/if}

  {#if breadcrumbSchema}
    <script type="application/ld+json">
      {JSON.stringify(breadcrumbSchema)}
    </script>
  {/if}
</svelte:head>

<svelte:window on:click={handleClickOutside} />

<div class="framework-detail-page">
  {#if error}
    <div class="error-state" role="alert">
      <h2>Error</h2>
      <p>{error}</p>
      <a href="/" class="btn btn-primary">Back to Home</a>
    </div>
  {:else if frameworkData}
    <header
      class="page-header"
      style="--brand-color: {brandColor}; --brand-color-rgba: {brandColorRgba}; --brand-color-rgba-medium: {brandColorRgbaMedium}; --text-color: {textColor}"
    >
      <div class="header-bg"></div>

      {#if frameworkData.github?.archived || frameworkData.github?.disabled}
        <div class="warning-banner" role="alert">
          {#if frameworkData.github?.archived}
            <span class="warning-icon">⚠️</span>
            <div class="warning-content">
              <strong>Archived Repository</strong>
              <p>This repository has been archived and is no longer actively maintained.</p>
            </div>
          {:else if frameworkData.github?.disabled}
            <span class="warning-icon">⚠️</span>
            <div class="warning-content">
              <strong>Disabled Repository</strong>
              <p>This repository has been disabled.</p>
            </div>
          {/if}
        </div>
      {/if}

      <div class="header-top">
        <div class="header-left">
          <div class="header-icon">
            <img src={iconUrl} alt="{frameworkData.name} icon" />
          </div>
          <div class="header-title">
            <h1>{frameworkData.name}</h1>
            <p class="description-short">{staticData?.meta?.description || frameworkData.metadata?.description || ''}</p>

            <div class="header-links" style="--link-brand-color: {brandColor};">
              {#if frameworkData.metadata?.links?.website}
                <a href={frameworkData.metadata.links.website} target="_blank" rel="noopener noreferrer" class="btn btn-sm header-link-btn">
                  Website
                </a>
              {/if}
              {#if frameworkData.metadata?.links?.docs}
                <a href={frameworkData.metadata.links.docs} target="_blank" rel="noopener noreferrer" class="btn btn-sm header-link-btn">
                  Docs
                </a>
              {/if}
              {#if frameworkData.metadata?.links?.github || frameworkData.metadata?.github?.fullName}
                <a href={frameworkData.metadata.links?.github || `https://github.com/${frameworkData.metadata.github.fullName}`} target="_blank" rel="noopener noreferrer" class="btn btn-sm header-link-btn">
                  GitHub
                </a>
              {/if}
            </div>
          </div>
        </div>

        <div class="header-actions">
          <div class="compare-dropdown">
            <button
              bind:this={compareButtonElement}
              type="button"
              class="btn compare-btn"
              on:click={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              style="--btn-brand-color: {brandColor}; --btn-text-color: {textColor};"
            >
              <span>Compare with</span>
              <span class="chevron" class:open={dropdownOpen}>
                <ChevronDown size={16} />
              </span>
            </button>
          </div>

          {#if dropdownOpen}
            <div
              class="dropdown-menu"
              role="menu"
              style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; {window.innerWidth <= 768 ? 'right: 16px; min-width: auto;' : ''}"
            >
              <div class="dropdown-header">
                <span class="dropdown-title">Select a framework to compare</span>
              </div>
              <div class="dropdown-list">
                {#each availableFrameworks as framework}
                  <button
                    type="button"
                    class="dropdown-item"
                    role="menuitem"
                    on:click={() => handleCompareWith(framework.id)}
                  >
                    <img
                      src={getSimpleIconUrl(framework.branding.iconName, framework.branding.color)}
                      alt={framework.name}
                      class="framework-icon"
                    />
                    <span>{framework.name}</span>
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <div class="header-description">
        {#if staticData?.meta?.longDescription}
          <p class="description-long">{staticData.meta.longDescription}</p>
        {/if}
      </div>
    </header>

    <div class="bento-grid" style="--brand-color: {brandColor}; --brand-color-rgba: {brandColorRgba}">
      <OverviewCard
        metadata={frameworkData.metadata}
        ecosystem={frameworkData.ecosystem}
        github={frameworkData.github}
        npm={frameworkData.npm}
        bundle={frameworkData.bundle}
        security={frameworkData.security}
        brandColor={brandColor}
      />

      {#if staticData?.framework}
        <FrameworkScoresCard scores={staticData.framework} />
      {/if}

      {#if frameworkData.github?.stars}
        <GitHubStatsCard github={frameworkData.github} />
      {/if}

      {#if frameworkData.npm?.name}
        <NPMStatsCard npm={frameworkData.npm} />
      {/if}

      {#if frameworkData.bundle?.size}
        <BundleSizeCard bundle={frameworkData.bundle} />
      {/if}

      {#if frameworkData.install_metrics}
        <InstallMetricsCard installMetrics={frameworkData.install_metrics} />
      {/if}

      {#if staticData?.meta?.openCollective}
        <OpenCollectiveCard slug={staticData.meta.openCollective} />
      {/if}

      {#if frameworkData.security?.vulnerabilities}
        <SecurityCard security={frameworkData.security} />
      {/if}

      {#if frameworkData.npm?.name}
        <SourceRankCard packageName={frameworkData.npm.name} />
      {/if}

      <EcosystemHealthCard
        ecosystem={frameworkData.ecosystem}
        lastUpdated={frameworkData.last_updated}
      />

      {#if frameworkData.ecosystem?.packages && frameworkData.ecosystem.packages.length > 0}
        <EcosystemPackagesCard ecosystem={frameworkData.ecosystem} />
      {/if}

      {#if frameworkData.github?.license}
        <LicenseCard license={frameworkData.github.license} />
      {/if}

      {#if frameworkData.github?.commit_activity && Array.isArray(frameworkData.github.commit_activity) && frameworkData.github.commit_activity.length > 0}
        <CommitHeatmapCard commitActivity={frameworkData.github.commit_activity} brandColor={brandColor} />
      {/if}

      {#if frameworkData.download_trends}
        <DownloadTrendsCard downloadTrends={frameworkData.download_trends} brandColor={brandColor} />
      {/if}

      {#if frameworkData.metadata?.github?.fullName || frameworkData.metadata?.links?.github}
        {@const githubUrl = frameworkData.metadata?.links?.github}
        {@const repoMatch = githubUrl?.match(/github\.com\/([^\/]+\/[^\/]+)/)}
        {@const repoFullName = frameworkData.metadata?.github?.fullName || repoMatch?.[1]}
        {#if repoFullName}
          <div class="card-large">
            <StarHistoryCard repoFullName={repoFullName} />
          </div>
        {/if}
      {/if}

      {#if frameworkData.github?.contributors?.top_contributors && frameworkData.github.contributors.top_contributors.length > 0}
        <div class="card-x-tall">
          <ContributorsCard contributors={frameworkData.github.contributors} />
        </div>
      {/if}

      {#if frameworkData.metadata?.name}
        <StackOverflowCard tag={frameworkData.metadata.name.toLowerCase()} />
      {/if}

      {#if frameworkData.npm?.name}
        <JsDelivrStatsCard packageName={frameworkData.npm.name} />
      {/if}

      {#if frameworkData.npm?.name}
        <BrowserCompatCard
          packageName={frameworkData.npm.name}
          browserSupportUrl={staticData?.meta?.links?.browserSupport}
        />
      {/if}

      {#if staticData?.meta?.example}
        <div class="card-large">
          <ExampleProjectCard example={staticData.meta.example} />
        </div>
      {/if}

      {#if staticData?.meta?.links?.video}
        <div class="card-large">
          <VideoCard
            videoId={staticData.meta.links.video}
            frameworkName={frameworkData.name}
          />
        </div>
      {/if}

      <div class="card-wide">
        <AuthorReview frameworkId={frameworkId} example={staticData?.meta?.example} />
      </div>

      <LinksCard frameworkData={frameworkData} staticData={staticData} />
    </div>

    {#if missingDataSections.length > 0}
      <details class="missing-data-section">
        <summary>Missing Data Sections ({missingDataSections.length})</summary>
        <p class="info-text">The following data sections could not be displayed due to missing or incomplete data:</p>
        <ul>
          {#each missingDataSections as section}
            <li>{section}</li>
          {/each}
        </ul>
      </details>
    {/if}

    {#if frameworkData.errors && frameworkData.errors.length > 0}
      <details class="errors-section">
        <summary>Data Collection Issues ({frameworkData.errors.length})</summary>
        <ul>
          {#each frameworkData.errors as err}
            <li>
              <strong>{err.source}:</strong> {err.message}
              <time>{new Date(err.timestamp).toLocaleString()}</time>
            </li>
          {/each}
        </ul>
      </details>
    {/if}
  {/if}
</div>

<style>
  @import './framework-detail.css';
</style>
