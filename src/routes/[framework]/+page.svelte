<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
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
  import { getFrameworkBranding, getSimpleIconUrl, addAlpha, getContrastColor } from '$lib/utils/framework-branding';

  let frameworkData: any = null;
  let staticData: any = null;
  let loading = true;
  let error: string | null = null;

  $: frameworkId = $page.params.framework || '';
  $: branding = getFrameworkBranding(frameworkId);
  $: brandColor = staticData?.meta?.branding?.color || branding.color;
  $: iconUrl = getSimpleIconUrl(frameworkId);
  $: brandColorRgba = addAlpha(brandColor, 0.1);
  $: brandColorRgbaMedium = addAlpha(brandColor, 0.2);
  $: textColor = getContrastColor(brandColor);

  // Track missing data sections
  $: missingDataSections = frameworkData ? [
    !frameworkData.github?.stars && 'GitHub statistics',
    !frameworkData.npm?.name && 'NPM statistics',
    !frameworkData.bundle?.size && 'Bundle size data',
    !frameworkData.security?.vulnerabilities && 'Security audit',
    (!frameworkData.github?.commit_activity || !Array.isArray(frameworkData.github?.commit_activity)) && 'Commit activity',
    (!frameworkData.github?.contributors || frameworkData.github?.contributors?.length === 0) && 'Contributors data',
    (!frameworkData.ecosystem?.packages || frameworkData.ecosystem?.packages?.length === 0) && 'Ecosystem packages',
    !frameworkData.github?.license && 'License information',
  ].filter(Boolean) : [];

  // Reload data when frameworkId changes
  $: if (frameworkId) {
    loadData();
  }

  async function loadData() {
    loading = true;
    error = null;
    frameworkData = null;
    staticData = null;
    await Promise.all([fetchFrameworkData(), fetchStaticData()]);
  }

  onMount(async () => {
    await loadData();
  });

  async function fetchFrameworkData() {
    try {
      const response = await fetch(`/api/framework/${frameworkId}`);

      if (!response.ok) {
        if (response.status === 404) {
          error = `Framework "${frameworkId}" not found`;
        } else if (response.status === 429) {
          error = 'Rate limit exceeded. Please try again later.';
        } else {
          error = `Failed to load framework data (${response.status})`;
        }
        return;
      }

      frameworkData = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load framework data';
      console.error('Error fetching framework data:', e);
    }
  }

  async function fetchStaticData() {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) {
        console.error('Failed to load static data');
        return;
      }

      const data = await response.json();
      const framework = data.frameworks.find((f: any) => f.name === frameworkId);
      const meta = data.meta.find((m: any) => m.id === frameworkId);

      if (framework || meta) {
        staticData = { framework, meta };
      }
    } catch (e) {
      console.error('Error fetching static data:', e);
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{frameworkData?.name || frameworkId} - Framework Details | Stack Match</title>
  <meta name="description" content="Detailed statistics and ecosystem health for {frameworkData?.name || frameworkId}" />
</svelte:head>

<div class="framework-detail-page">
  {#if loading}
    <div class="loading-state">
      <div class="loading-container">
        <div class="loading-icon">
          <div class="pulse-ring"></div>
          <div class="pulse-ring delay-1"></div>
          <div class="pulse-ring delay-2"></div>
          <img src={iconUrl} alt="{frameworkId} icon" class="framework-icon" />
        </div>
        <h2>Loading {frameworkId}</h2>
        <p>Fetching framework data and statistics...</p>
        <div class="loading-bar">
          <div class="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  {:else if error}
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
          </div>
        </div>

        <div class="header-actions">
          {#if frameworkData.metadata?.links?.website}
            <a href={frameworkData.metadata.links.website} target="_blank" rel="noopener noreferrer" class="btn btn-branded">
              Website
            </a>
          {/if}
          {#if frameworkData.metadata?.links?.docs}
            <a href={frameworkData.metadata.links.docs} target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              Docs
            </a>
          {/if}
          {#if frameworkData.metadata?.github?.fullName}
            <a href="https://github.com/{frameworkData.metadata.github.fullName}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
              GitHub
            </a>
          {/if}
        </div>
      </div>

      <div class="header-description">
        <p>{frameworkData.metadata?.description || ''}</p>
      </div>
    </header>

    <div class="bento-grid" style="--brand-color: {brandColor}; --brand-color-rgba: {brandColorRgba}">
      <OverviewCard
        metadata={frameworkData.metadata}
        ecosystem={frameworkData.ecosystem}
        github={frameworkData.github}
        brandColor={brandColor}
      />

      {#if staticData?.framework}
        <FrameworkScoresCard scores={staticData.framework} brandColor={brandColor} />
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

      {#if frameworkData.metadata?.github?.fullName}
        <StarHistoryCard repoFullName={frameworkData.metadata.github.fullName} brandColor={brandColor} />
      {/if}

      {#if frameworkData.github?.contributors && frameworkData.github.contributors.length > 0}
        <ContributorsCard contributors={frameworkData.github.contributors} />
      {/if}

      {#if staticData?.meta?.links?.video}
        <VideoCard
          videoId={staticData.meta.links.video}
          frameworkName={frameworkData.name}
        />
      {/if}

      {#if staticData?.meta?.example}
        <ExampleProjectCard example={staticData.meta.example} />
      {/if}

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
