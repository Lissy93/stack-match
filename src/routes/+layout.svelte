<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Framework Comparator - Find Your Perfect Frontend Stack</title>
	<meta name="description" content="Compare frontend frameworks based on performance, maintainability, bundle size, and more. Make data-driven decisions for your next project." />
</svelte:head>

<slot />
