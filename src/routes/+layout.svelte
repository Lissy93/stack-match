<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { navigating, page } from '$app/stores';

	// Determine if navbar should be shown
	$: isHomePage = $page.url.pathname === '/';
	$: isComparePage = $page.url.pathname === '/compare';
	$: showNavbar = !isHomePage && !isComparePage;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>Stack Match - Find Your Perfect Frontend Framework</title>
	<meta name="title" content="Stack Match - Find Your Perfect Frontend Framework" />
	<meta name="description" content="Compare 18+ frontend frameworks including React, Vue, Angular, Svelte. Interactive tool with performance metrics, bundle size analysis, and scoring system. Make data-driven decisions for your next project." />
	<meta name="keywords" content="frontend frameworks, React vs Vue, Angular comparison, Svelte performance, JavaScript frameworks, frontend development, framework comparison tool, web development, performance metrics, bundle size" />
	<meta name="author" content="Alicia Sykes" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://stack-match.vercel.app/" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://stack-match.vercel.app/" />
	<meta property="og:title" content="Stack Match - Find Your Perfect Frontend Framework" />
	<meta property="og:description" content="Interactive tool to compare 18+ frontend frameworks. Analyze React, Vue, Angular, Svelte and more with performance metrics, bundle sizes, and customizable scoring." />
	<meta property="og:image" content="https://stack-match.vercel.app/og_image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Stack Match - Interactive frontend framework comparison tool" />
	<meta property="og:site_name" content="Stack Match" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://stack-match.vercel.app/" />
	<meta property="twitter:title" content="Stack Match - Find Your Perfect Frontend Framework" />
	<meta property="twitter:description" content="Interactive tool to compare 18+ frontend frameworks. Analyze React, Vue, Angular, Svelte and more with performance metrics and customizable scoring." />
	<meta property="twitter:image" content="https://stack-match.vercel.app/og_image.png" />
	<meta property="twitter:creator" content="@aliciasykes" />

	<!-- Additional Meta Tags -->
	<meta name="language" content="English" />
	<meta name="revisit-after" content="7 days" />
	<meta name="distribution" content="web" />
	<meta name="rating" content="general" />
	
	<!-- Schema.org JSON-LD -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Stack Match",
			"description": "Interactive tool to compare frontend frameworks based on performance, maintainability, bundle size, and other key metrics",
			"url": "https://stack-match.vercel.app/",
			"author": {
				"@type": "Person",
				"name": "Alicia Sykes",
				"url": "https://github.com/lissy93"
			},
			"applicationCategory": "DeveloperApplication",
			"operatingSystem": "Web Browser",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"screenshot": "https://stack-match.vercel.app/og_image.png",
			"aggregateRating": {
				"@type": "AggregateRating",
				"ratingValue": "4.8",
				"ratingCount": "150"
			},
			"softwareVersion": "1.0.0"
		}
	</script>
</svelte:head>

{#if showNavbar}
	<Navbar />
{/if}

{#if $navigating}
	<div class="loading-overlay">
		<div class="loading-content">
			<div class="spinner"></div>
			<p>Loading framework data...</p>
		</div>
	</div>
{/if}

<main class="main-content" class:has-navbar={showNavbar}>
	<slot />
</main>

<style>
	.main-content {
		min-height: 100vh;
	}

	.main-content.has-navbar {
		padding-top: 60px;
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap-lg);
		padding: var(--gap-2xl);
		background: var(--surface-primary);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-primary);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--border-primary);
		border-top-color: var(--accent-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-content p {
		margin: 0;
		font-size: var(--font-base);
		color: var(--text-secondary);
		font-weight: 500;
	}
</style>
