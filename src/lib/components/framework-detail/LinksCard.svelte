<script lang="ts">
  export let frameworkData: any;
  export let staticData: any;

  interface Link {
    label: string;
    url: string;
    icon: string;
    category: 'official' | 'repository' | 'package' | 'community' | 'tools';
  }

  $: links = generateLinks(frameworkData, staticData);

  function generateLinks(framework: any, staticMeta: any): Link[] {
    if (!framework) return [];

    const allLinks: Link[] = [];
    const metadata = framework.metadata;
    const npmName = framework.npm?.name;
    const githubRepo = metadata?.github?.fullName;

    console.log(framework)

    // Official Links
    if (metadata?.website) {
      allLinks.push({
        label: 'Official Website',
        url: metadata?.website,
        icon: '🌐',
        category: 'official'
      });
    }

    if (metadata?.links?.docs) {
      allLinks.push({
        label: 'Documentation',
        url: metadata.links.docs,
        icon: '📚',
        category: 'official'
      });
    }

    // Repository Links
    if (githubRepo) {
      allLinks.push({
        label: 'GitHub Repository',
        url: `https://github.com/${githubRepo}`,
        icon: '💻',
        category: 'official'
      });

      allLinks.push({
        label: 'Issues',
        url: `https://github.com/${githubRepo}/issues`,
        icon: '🐛',
        category: 'repository'
      });

      allLinks.push({
        label: 'Pull Requests',
        url: `https://github.com/${githubRepo}/pulls`,
        icon: '🔀',
        category: 'repository'
      });

      allLinks.push({
        label: 'Releases',
        url: `https://github.com/${githubRepo}/releases`,
        icon: '🏷️',
        category: 'repository'
      });

      allLinks.push({
        label: 'Contributing Guide',
        url: `https://github.com/${githubRepo}/blob/${framework.github?.default_branch || 'main'}/CONTRIBUTING.md`,
        icon: '🤝',
        category: 'repository'
      });

      allLinks.push({
        label: 'Star History',
        url: `https://star-history.com/#${githubRepo}&Date`,
        icon: '⭐',
        category: 'tools'
      });
    }

    // Package Links
    if (npmName) {
      allLinks.push({
        label: 'npm Package',
        url: `https://www.npmjs.com/package/${npmName}`,
        icon: '📦',
        category: 'official'
      });

      allLinks.push({
        label: 'npm Trends',
        url: `https://npmtrends.com/${npmName}`,
        icon: '📈',
        category: 'tools'
      });

      allLinks.push({
        label: 'Bundlephobia',
        url: `https://bundlephobia.com/package/${npmName}`,
        icon: '📊',
        category: 'tools'
      });

      allLinks.push({
        label: 'Package Phobia',
        url: `https://packagephobia.com/result?p=${npmName}`,
        icon: '⚖️',
        category: 'tools'
      });

      allLinks.push({
        label: 'Snyk Advisor',
        url: `https://snyk.io/advisor/npm-package/${npmName}`,
        icon: '🔒',
        category: 'tools'
      });
    }

    // License
    if (framework.github?.license?.key) {
      const licenseKey = framework.github.license.key;
      allLinks.push({
        label: `${framework.github.license.name} License`,
        url: `https://opensource.org/licenses/${licenseKey}`,
        icon: '⚖️',
        category: 'official'
      });
    }

   

    // Additional Tools
    if (githubRepo) {
      allLinks.push({
        label: 'Libraries.io',
        url: `https://libraries.io/github/${githubRepo}`,
        icon: '📚',
        category: 'tools'
      });

      allLinks.push({
        label: 'Open Source Insights',
        url: `https://deps.dev/project/github/${githubRepo}`,
        icon: '🔍',
        category: 'tools'
      });

      allLinks.push({
        label: 'Network Graph',
        url: `https://github.com/${githubRepo}/network`,
        icon: '🕸️',
        category: 'repository'
      });
    }

    if (npmName) {
      allLinks.push({
        label: 'npms.io Analysis',
        url: `https://npms.io/search?q=${npmName}`,
        icon: '🔍',
        category: 'tools'
      });

      allLinks.push({
        label: 'Socket.dev Security',
        url: `https://socket.dev/npm/package/${npmName}`,
        icon: '🛡️',
        category: 'tools'
      });

      allLinks.push({
        label: 'npm Chart',
        url: `https://npmcharts.com/compare/${npmName}`,
        icon: '📈',
        category: 'tools'
      });

      allLinks.push({
        label: 'Moiva.io Compare',
        url: `https://moiva.io/?npm=${npmName}`,
        icon: '⚖️',
        category: 'tools'
      });

      allLinks.push({
        label: 'OSV Vulnerabilities',
        url: `https://osv.dev/list?ecosystem=npm&q=${npmName}`,
        icon: '🔐',
        category: 'tools'
      });

      allLinks.push({
        label: 'npm Dependency Graph',
        url: `https://npm.anvaka.com/#/view/2d/${npmName}`,
        icon: '🗺️',
        category: 'tools'
      });

      allLinks.push({
        label: 'Skypack CDN',
        url: `https://www.skypack.dev/view/${npmName}`,
        icon: '☁️',
        category: 'tools'
      });

      allLinks.push({
        label: 'jsDelivr CDN',
        url: `https://www.jsdelivr.com/package/npm/${npmName}`,
        icon: '🚀',
        category: 'tools'
      });

      allLinks.push({
        label: 'UNPKG CDN',
        url: `https://unpkg.com/browse/${npmName}/`,
        icon: '📦',
        category: 'tools'
      });
    }

    // Stack Overflow
    const frameworkName = framework.metadata?.name || framework.id;
    allLinks.push({
      label: 'Stack Overflow',
      url: `https://stackoverflow.com/questions/tagged/${frameworkName.toLowerCase()}`,
      icon: '💭',
      category: 'community'
    });

    // Reddit
    allLinks.push({
      label: 'Reddit Community',
      url: `https://www.reddit.com/search/?q=${frameworkName}`,
      icon: '🤖',
      category: 'community'
    });

    // Dev.to
    allLinks.push({
      label: 'Dev.to Articles',
      url: `https://dev.to/search?q=${frameworkName}`,
      icon: '📝',
      category: 'community'
    });

    // YouTube
    allLinks.push({
      label: 'YouTube Tutorials',
      url: `https://www.youtube.com/results?search_query=${frameworkName}+tutorial`,
      icon: '🎥',
      category: 'community'
    });

    // Awesome List
    if (githubRepo) {
      allLinks.push({
        label: 'Awesome List',
        url: `https://github.com/search?q=awesome-${frameworkName.toLowerCase()}&type=repositories`,
        icon: '😎',
        category: 'community'
      });
    }

    return allLinks;
  }

  $: categorizedLinks = {
    official: links.filter(l => l.category === 'official'),
    repository: links.filter(l => l.category === 'repository'),
    package: links.filter(l => l.category === 'package'),
    community: links.filter(l => l.category === 'community'),
    tools: links.filter(l => l.category === 'tools'),
  };

  function getDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  }

  function getFaviconUrl(url: string): string {
    const domain = getDomainFromUrl(url);
    return domain ? `https://favicon.im/${domain}` : '';
  }
</script>

<div class="card card-wide links-card">
  <div class="card-header">
    <h3>Links & Resources</h3>
    <span class="link-count">{links.length} links</span>
  </div>

  {#if links.length > 0}
    <div class="links-sections">
      {#if categorizedLinks.official.length > 0}
        <div class="link-section">
          <h4 class="section-title">Official</h4>
          <div class="links-grid">
            {#each categorizedLinks.official as link}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <span class="link-icon">{link.icon}</span>
                <span class="link-label">{link.label}</span>
                <span class="external-icon">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      {#if categorizedLinks.repository.length > 0}
        <div class="link-section">
          <h4 class="section-title">Repository</h4>
          <div class="links-grid">
            {#each categorizedLinks.repository as link}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <span class="link-icon">{link.icon}</span>
                <span class="link-label">{link.label}</span>
                <span class="external-icon">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      {#if categorizedLinks.package.length > 0}
        <div class="link-section">
          <h4 class="section-title">Package</h4>
          <div class="links-grid">
            {#each categorizedLinks.package as link}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <span class="link-icon">{link.icon}</span>
                <span class="link-label">{link.label}</span>
                <span class="external-icon">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      {#if categorizedLinks.community.length > 0}
        <div class="link-section">
          <h4 class="section-title">Community</h4>
          <div class="links-grid">
            {#each categorizedLinks.community as link}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <span class="link-icon">{link.icon}</span>
                <span class="link-label">{link.label}</span>
                <span class="external-icon">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      {#if categorizedLinks.tools.length > 0}
        <div class="link-section">
          <h4 class="section-title">Analysis & Tools</h4>
          <div class="links-grid">
            {#each categorizedLinks.tools as link}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="link-item"
              >
                <span class="link-icon">
                  <img
                    src={getFaviconUrl(link.url)}
                    alt={link.icon}
                    class="favicon"
                    loading="lazy"
                    on:error={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'inline';
                    }}
                  />
                  <span class="emoji-fallback" style="display: none;">{link.icon}</span>
                </span>
                <span class="link-label">{link.label}</span>
                <span class="external-icon">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="no-links">
      <p>No links available</p>
    </div>
  {/if}
</div>

<style>
  .links-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-md);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .link-count {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
    background: var(--surface-tertiary);
    padding: var(--gap-xs) var(--gap-sm);
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .links-sections {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .link-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }

  .section-title {
    margin: 0;
    font-size: var(--font-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--gap-sm);
  }

  .link-item {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    background: var(--surface-secondary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text-primary);
    font-size: var(--font-sm);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .link-item:hover {
    background: var(--surface-tertiary);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .link-item:active {
    transform: translateY(0);
  }

  .link-icon {
    font-size: var(--font-lg);
    flex-shrink: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .favicon {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .emoji-fallback {
    font-size: var(--font-lg);
  }

  .link-label {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .external-icon {
    font-size: var(--font-sm);
    color: var(--text-tertiary);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .link-item:hover .external-icon {
    opacity: 1;
  }

  .no-links {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
  }

  .no-links p {
    margin: 0;
  }

  @media (max-width: 1024px) {
    .links-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .links-grid {
      grid-template-columns: 1fr;
    }

    .card-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .link-item {
      padding: var(--gap-sm) var(--gap-md);
    }

    .external-icon {
      opacity: 1;
    }
  }
</style>
