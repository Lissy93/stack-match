<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getSimpleIconUrl } from '$lib/utils/branding-utils';
  import { Github, Info, Home, GitCompare } from 'lucide-svelte';
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

  // Get current framework ID from URL
  $: currentFramework = $page.url.pathname.split('/')[1] || null;

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
      <img src="/apple-touch-icon.png" alt="Stack Match" class="logo-icon" />
      <span class="logo-text">Stack Match</span>
    </a>

    <div class="navbar-content" class:open={mobileMenuOpen}>
      <div class="mobile-menu-header">
        <a href="/" class="mobile-logo" on:click={closeMobileMenu}>
          <img src="/apple-touch-icon.png" alt="Stack Match" class="mobile-logo-icon" />
          <div class="mobile-logo-text">
            <span class="mobile-logo-title">Stack Match</span>
            <span class="mobile-logo-description">Compare frontend frameworks</span>
          </div>
        </a>
      </div>

      <div class="frameworks-list">
        {#each frameworks as framework (framework.id)}
          <a
            href="/{framework.id}"
            class="framework-link"
            class:active={currentFramework === framework.id}
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

      <div class="mobile-menu-footer">
        <a
          href="/"
          class="footer-link"
          on:click={closeMobileMenu}
        >
          <Home size={18} />
          <span>Home</span>
        </a>
        <a
          href="/compare"
          class="footer-link"
          on:click={closeMobileMenu}
        >
          <GitCompare size={18} />
          <span>Compare</span>
        </a>
        <a
          href="/about"
          class="footer-link"
          on:click={closeMobileMenu}
        >
          <Info size={18} />
          <span>About</span>
        </a>
        <a
          href="https://github.com/lissy93/stack-match"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
          on:click={closeMobileMenu}
        >
          <Github size={18} />
          <span>GitHub</span>
        </a>
      </div>

      <div class="navbar-actions">
        <a
          href="https://github.com/lissy93/stack-match"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          aria-label="View on GitHub"
        >
          <Github size={20} />
          <span class="github-text">View on GitHub</span>
        </a>
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
    width: 32px;
    height: 32px;
    object-fit: contain;
  }

  .logo-text {
    color: var(--text-primary);
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
    gap: var(--gap-md);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text-secondary);
    font-size: var(--font-sm);
    white-space: nowrap;
    transition: all var(--transition-normal);
    border: 1px solid transparent;
    position: relative;
  }

  .framework-link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-md);
    background: var(--brand-color);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  .framework-link > * {
    position: relative;
    z-index: 1;
  }

  .framework-link:hover {
    border-color: color-mix(in srgb, var(--brand-color) 40%, transparent);
    color: var(--text-primary);
  }

  .framework-link:hover::before {
    opacity: 0.08;
  }

  .framework-link.active {
    background: color-mix(in srgb, var(--brand-color) 12%, transparent);
    border-color: color-mix(in srgb, var(--brand-color) 50%, transparent);
    color: var(--text-primary);
  }

  .framework-link.active .framework-icon {
    filter: grayscale(0);
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

  .github-link {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-lg);
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-sm);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: all var(--transition-normal);
  }

  .github-link::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: var(--radius-md);
    padding: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--accent-primary),
      transparent
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    animation: borderRotate 3s linear infinite;
    animation-play-state: paused;
  }

  @keyframes borderRotate {
    0% {
      transform: translateX(-100%) rotate(0deg);
    }
    100% {
      transform: translateX(200%) rotate(0deg);
    }
  }

  .github-link:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .github-link:hover::before {
    opacity: 1;
    animation-play-state: running;
  }

  .github-text {
    display: inline;
  }

  .mobile-menu-header {
    display: none;
  }

  .mobile-menu-footer {
    display: none;
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
      width: 320px;
      height: 100vh;
      background: var(--surface-primary);
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      padding: var(--gap-lg);
      margin: 0;
      gap: 0;
      transition: right 0.3s ease;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      z-index: 2;
    }

    .navbar-content.open {
      right: 0;
    }

    .mobile-menu-header {
      display: block;
      padding-bottom: var(--gap-md);
      margin-bottom: var(--gap-md);
      border-bottom: 1px solid var(--border-primary);
    }

    .mobile-logo {
      display: flex;
      align-items: center;
      gap: var(--gap-md);
      text-decoration: none;
      transition: opacity var(--transition-normal);
    }

    .mobile-logo:hover {
      opacity: 0.8;
    }

    .mobile-logo-icon {
      width: 48px;
      height: 48px;
      object-fit: contain;
      border-radius: var(--radius-md);
    }

    .mobile-logo-text {
      display: flex;
      flex-direction: column;
      gap: var(--gap-2xs);
    }

    .mobile-logo-title {
      font-size: var(--font-lg);
      font-weight: 700;
      color: var(--text-primary);
    }

    .mobile-logo-description {
      font-size: var(--font-xs);
      color: var(--text-tertiary);
      line-height: 1.4;
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

    .mobile-menu-footer {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      margin-top: auto;
      padding-top: var(--gap-lg);
      border-top: 1px solid var(--border-primary);
    }

    .footer-link {
      display: flex;
      align-items: center;
      gap: var(--gap-md);
      padding: var(--gap-md);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--text-secondary);
      font-size: var(--font-sm);
      font-weight: 500;
      background: var(--surface-secondary);
      border: 1px solid var(--border-primary);
      transition: all var(--transition-normal);
    }

    .footer-link:hover {
      background: var(--surface-tertiary);
      border-color: var(--accent-primary);
      color: var(--text-primary);
    }

    .navbar-actions {
      display: none;
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
      transform: translateY(7px) rotate(45deg);
    }

    .mobile-menu-toggle[aria-expanded='true'] .hamburger-line:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .mobile-menu-toggle[aria-expanded='true'] .hamburger-line:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }

  /* Small mobile - full width */
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
      max-width: 100%;
    }

    .mobile-logo-icon {
      width: 40px;
      height: 40px;
    }

    .mobile-logo-title {
      font-size: var(--font-base);
    }
  }

</style>
