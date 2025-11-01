<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';
  import data from '../../data.json';

  interface Framework {
    id: string;
    name: string;
    branding: {
      iconName: string;
      color: string;
    };
  }

  let frameworks: Framework[] = data.meta.map((meta: any) => ({
    id: meta.id,
    name: meta.name,
    branding: meta.branding,
  }));
  let mobileMenuOpen = false;
  let scrolled = false;

  // Hide navbar on homepage
  $: isHomePage = $page.url.pathname === '/';

  onMount(() => {

    // Handle scroll event for navbar styling
    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

{#if !isHomePage}
<nav class="navbar" class:scrolled>
  <div class="navbar-container">
    <a href="/" class="logo">
      <span class="logo-icon">🎯</span>
      <span class="logo-text">Stack Match</span>
    </a>

    <div class="navbar-content" class:open={mobileMenuOpen}>
      <div class="frameworks-list">
        {#each frameworks as framework (framework.id)}
          <a
            href="/{framework.id}"
            class="framework-link"
            title={framework.name}
            style="--brand-color: {framework.branding.color}"
            on:click={closeMobileMenu}
          >
            <img
              src={getSimpleIconUrl(framework.branding.iconName, framework.branding.color)}
              alt="{framework.name} icon"
              class="framework-icon"
            />
            <span class="framework-name">{framework.name}</span>
          </a>
        {/each}
      </div>

      <div class="navbar-actions">
        <a href="/compare" class="btn btn-secondary">Compare</a>
        <a href="/" class="btn btn-primary">Compare All</a>
      </div>
    </div>

    <button
      class="mobile-menu-toggle"
      aria-label="Toggle navigation menu"
      aria-expanded={mobileMenuOpen}
      on:click={toggleMobileMenu}
    >
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </div>

  {#if mobileMenuOpen}
    <div
      class="mobile-overlay"
      on:click={closeMobileMenu}
      on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
      role="button"
      tabindex="0"
      aria-label="Close menu"
    ></div>
  {/if}
</nav>
{/if}

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: var(--surface-primary);
    border-bottom: 1px solid var(--border-primary);
    transition: all 0.3s ease;
  }

  .navbar.scrolled {
    background: var(--surface-primary);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .navbar-container {
    margin: 0 auto;
    padding: 0 var(--gap-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .logo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 700;
    font-size: var(--font-lg);
    transition: opacity 0.2s ease;
  }

  .logo:hover {
    opacity: 0.8;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    background: linear-gradient(135deg, var(--accent-primary), #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 3;
  }

  .hamburger-line {
    width: 100%;
    height: 3px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .navbar-content {
    display: flex;
    align-items: center;
    gap: var(--gap-xl);
    flex: 1;
    justify-content: space-between;
    margin-left: var(--gap-xl);
  }

  .frameworks-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-sm);
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    padding: var(--gap-xs) 0;
    scrollbar-width: none;
  }

  .frameworks-list::-webkit-scrollbar {
    display: none;
  }

  .framework-link {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text-secondary);
    font-size: var(--font-sm);
    white-space: nowrap;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .framework-link:hover {
    background: var(--surface-secondary);
    border-color: var(--brand-color);
    color: var(--text-primary);
  }

  .framework-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: grayscale(0.3);
    transition: filter 0.2s ease;
  }

  .framework-link:hover .framework-icon {
    filter: grayscale(0);
  }

  .framework-name {
    display: none;
  }

  /* Show framework names on large screens */
  @media (min-width: 2000px) {
    .framework-name {
      display: inline;
    }

    .frameworks-list {
      justify-content: flex-start;
    }
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
  }

  .btn-primary {
    padding: var(--gap-sm) var(--gap-lg);
    background: var(--accent-primary);
    color: white;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-sm);
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-primary:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    padding: var(--gap-sm) var(--gap-lg);
    background: var(--surface-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-sm);
    transition: all 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
  }

  .btn-secondary:hover {
    background: var(--surface-secondary);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
  }

  .mobile-overlay {
    display: none;
  }

  /* Tablet - keep icons only, centered */
  @media (max-width: 1024px) {
    .frameworks-list {
      gap: var(--gap-md);
      justify-content: center;
    }
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .navbar-container {
      padding: 0 var(--gap-md);
    }

    .mobile-menu-toggle {
      display: flex;
    }

    .navbar-content {
      position: fixed;
      top: 0;
      right: -100%;
      width: 280px;
      height: 100vh;
      background: var(--surface-primary);
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      padding: 80px var(--gap-lg) var(--gap-xl);
      margin: 0;
      gap: var(--gap-lg);
      transition: right 0.3s ease;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      z-index: 2;
    }

    .navbar-content.open {
      right: 0;
    }

    .frameworks-list {
      flex-direction: column;
      align-items: stretch;
      gap: var(--gap-xs);
      overflow: visible;
      padding: 0;
    }

    .framework-link {
      padding: var(--gap-md);
      justify-content: flex-start;
    }

    .framework-icon {
      width: 24px;
      height: 24px;
    }

    .framework-name {
      display: inline;
      font-size: var(--font-base);
    }

    .navbar-actions {
      flex-direction: column;
      width: 100%;
      gap: var(--gap-md);
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      text-align: center;
      padding: var(--gap-md);
    }

    .mobile-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }

    .mobile-menu-toggle[aria-expanded='true'] .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translateY(8px);
    }

    .mobile-menu-toggle[aria-expanded='true'] .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle[aria-expanded='true'] .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translateY(-8px);
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    .navbar-container {
      height: 56px;
      padding: 0 var(--gap-md);
    }

    .logo-text {
      font-size: var(--font-base);
    }

    .navbar-content {
      width: 100%;
      max-width: 320px;
    }
  }

</style>
