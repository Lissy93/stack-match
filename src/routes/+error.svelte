<script lang="ts">
  import { page } from '$app/stores';
  import { Home, ArrowLeft, Github, ChevronDown } from 'lucide-svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import data from '../data.json';

  $: status = $page.status;
  $: message = $page.error?.message || 'An unexpected error occurred';

  const errorDetails = {
    404: {
      title: 'Page Not Found',
      description: 'The page you\'re looking for doesn\'t exist or has been moved.'
    },
    500: {
      title: 'Server Error',
      description: 'Something went wrong on our end. Please try again later.'
    },
    403: {
      title: 'Forbidden',
      description: 'You don\'t have permission to access this resource.'
    },
    default: {
      title: 'Error',
      description: 'Something unexpected happened.'
    }
  };

  $: error = errorDetails[status as keyof typeof errorDetails] || errorDetails.default;

  let showIndex = false;

  const frameworks = data.frameworks.map(f => ({
    name: f.name.charAt(0).toUpperCase() + f.name.slice(1),
    slug: f.name
  })).sort((a, b) => a.name.localeCompare(b.name));

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }
</script>

<svelte:head>
  <title>{status} - {error.title} | Stack Match</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Navbar />

<div class="error-page">
  <div class="error-content">
    <div class="error-code">{status}</div>
    <h1>{error.title}</h1>
    <p class="error-description">{error.description}</p>
    {#if message && status !== 404}
      <p class="error-message">{message}</p>
    {/if}

    <p class="github-notice">
      If you expected to see something else here, or this issue persists, please raise a ticket on our GitHub at
      <a href="https://github.com/Lissy93/stack-match/issues" target="_blank" rel="noopener noreferrer">
        github.com/lissy93/stack-match
      </a>
    </p>

    <div class="error-actions">
      <button on:click={goBack} class="action-button secondary">
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <a href="/" class="action-button primary">
        <Home size={18} />
        <span>Home</span>
      </a>
      <a href="https://github.com/Lissy93/stack-match" target="_blank" rel="noopener noreferrer" class="action-button secondary">
        <Github size={18} />
        <span>GitHub</span>
      </a>
    </div>

    <button class="site-index-toggle" on:click={() => showIndex = !showIndex}>
      <span>Site Index</span>
      <ChevronDown size={18} class={showIndex ? 'rotated' : ''} />
    </button>

    {#if showIndex}
      <div class="site-index">
        <div class="index-section">
          <h3>Main Pages</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/compare">Compare</a></li>
          </ul>
        </div>
        <div class="index-section">
          <h3>Frameworks</h3>
          <ul class="frameworks-list">
            {#each frameworks as framework}
              <li><a href="/{framework.slug}">{framework.name}</a></li>
            {/each}
          </ul>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .error-page {
    min-height: calc(100vh - 126px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    padding-top: calc(60px + var(--gap-xl));
    background: linear-gradient(
      135deg,
      var(--surface-primary) 0%,
      color-mix(in srgb, var(--surface-secondary) 50%, transparent) 100%
    );
    position: relative;
    overflow: hidden;
  }

  .error-page::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      color-mix(in srgb, var(--accent-primary) 5%, transparent) 0%,
      transparent 70%
    );
    animation: pulse 8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }

  .error-content {
    text-align: center;
    max-width: 600px;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

  .error-code {
    font-size: 10rem;
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(
      135deg,
      var(--accent-primary),
      color-mix(in srgb, var(--accent-primary) 70%, white)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--gap-md);
    letter-spacing: -0.05em;
    animation: glitch 3s ease-in-out infinite;
    position: relative;
  }

  @keyframes glitch {
    0%, 90%, 100% {
      transform: translate(0, 0) skew(0deg);
    }
    91% {
      transform: translate(-2px, 1px) skew(-0.5deg);
    }
    93% {
      transform: translate(2px, -1px) skew(0.5deg);
    }
    95% {
      transform: translate(-1px, 2px) skew(0.3deg);
    }
  }

  h1 {
    font-size: var(--font-3xl);
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--gap-md) 0;
    letter-spacing: -0.02em;
  }

  .error-description {
    font-size: var(--font-lg);
    color: var(--text-secondary);
    margin: 0 0 var(--gap-lg) 0;
    line-height: 1.6;
  }

  .error-message {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
    font-family: 'Courier New', monospace;
    background: var(--surface-tertiary);
    padding: var(--gap-sm) var(--gap-md);
    border-radius: var(--radius-md);
    margin: var(--gap-md) 0;
    border-left: 3px solid var(--accent-primary);
    text-align: left;
    word-break: break-word;
  }

  .github-notice {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
    margin: var(--gap-lg) 0;
    line-height: 1.6;
  }

  .github-notice a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-fast);
  }

  .github-notice a:hover {
    color: color-mix(in srgb, var(--accent-primary) 80%, white);
    text-decoration: underline;
  }

  .error-actions {
    display: flex;
    gap: var(--gap-md);
    justify-content: center;
    margin-top: var(--gap-2xl);
    flex-wrap: wrap;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md) var(--gap-xl);
    border-radius: var(--radius-lg);
    font-size: var(--font-base);
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  .action-button.primary {
    background: var(--accent-primary);
    color: white;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--accent-primary) 30%, transparent);
  }

  .action-button.primary:hover {
    background: color-mix(in srgb, var(--accent-primary) 90%, white);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px color-mix(in srgb, var(--accent-primary) 40%, transparent);
  }

  .action-button.secondary {
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
  }

  .action-button.secondary:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
  }

  .site-index-toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-sm) var(--gap-md);
    margin-top: var(--gap-2xl);
    background: transparent;
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: var(--font-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
  }

  .site-index-toggle:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
    color: var(--text-primary);
  }

  .site-index-toggle :global(svg) {
    transition: transform 0.3s ease;
  }

  .site-index-toggle :global(svg.rotated) {
    transform: rotate(180deg);
  }

  .site-index {
    margin-top: var(--gap-md);
    padding: var(--gap-lg);
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    text-align: left;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .index-section {
    margin-bottom: var(--gap-lg);
  }

  .index-section:last-child {
    margin-bottom: 0;
  }

  .index-section h3 {
    font-size: var(--font-base);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 var(--gap-sm) 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: var(--font-xs);
    color: var(--text-tertiary);
  }

  .index-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .frameworks-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--gap-xs) !important;
  }

  .index-section a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: var(--font-sm);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-sm);
    display: block;
    transition: all var(--transition-fast);
  }

  .index-section a:hover {
    color: var(--accent-primary);
    background: var(--surface-tertiary);
  }

  @media (max-width: 640px) {
    .error-page {
      padding: var(--gap-lg);
      padding-top: calc(60px + var(--gap-lg));
    }

    .error-code {
      font-size: 6rem;
    }

    h1 {
      font-size: var(--font-2xl);
    }

    .error-description {
      font-size: var(--font-base);
    }

    .error-actions {
      flex-direction: column;
      width: 100%;
    }

    .action-button {
      width: 100%;
      justify-content: center;
    }

    .frameworks-list {
      grid-template-columns: 1fr;
    }
  }
</style>
