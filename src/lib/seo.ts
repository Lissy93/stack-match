/**
 * SEO Utilities for Stack Match
 * Provides centralized SEO configuration and meta tag generation
 */

export const SITE_CONFIG = {
  name: 'Stack Match',
  shortName: 'Stack Match',
  url: 'https://stack-match.as93.net',
  description: 'Compare 18+ frontend frameworks including React, Vue, Angular, Svelte. Interactive tool with performance metrics, bundle size analysis, and scoring system. Make data-driven decisions for your next project.',
  author: 'Alicia Sykes',
  twitterHandle: '@aliciasykes',
  keywords: [
    'frontend frameworks',
    'React vs Vue',
    'Angular comparison',
    'Svelte performance',
    'JavaScript frameworks',
    'frontend development',
    'framework comparison tool',
    'web development',
    'performance metrics',
    'bundle size'
  ]
} as const;

interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  canonical?: string;
}

/**
 * Generate dynamic meta tags for a page
 */
export function generateMetaTags(config: MetaTagsConfig) {
  const {
    title,
    description,
    url,
    image = `${SITE_CONFIG.url}/og_image.png`,
    imageAlt = `${SITE_CONFIG.name} - Interactive frontend framework comparison tool`,
    type = 'website',
    keywords = SITE_CONFIG.keywords,
    canonical = url
  } = config;

  return {
    title,
    description,
    canonical,
    keywords: keywords.join(', '),
    openGraph: {
      type,
      url,
      title,
      description,
      image,
      imageAlt,
      siteName: SITE_CONFIG.name,
      imageWidth: '1200',
      imageHeight: '630'
    },
    twitter: {
      card: 'summary_large_image',
      url,
      title,
      description,
      image,
      creator: SITE_CONFIG.twitterHandle
    }
  };
}

/**
 * Generate meta tags for framework detail pages
 */
export function generateFrameworkMetaTags(framework: {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  branding?: {
    color?: string;
    logo?: string;
  };
}) {
  const title = `${framework.name} - Framework Comparison | Stack Match`;
  const description = framework.longDescription || framework.description ||
    `In-depth analysis and comparison of ${framework.name}. See performance metrics, bundle size, ecosystem stats, GitHub activity, and more.`;

  const url = `${SITE_CONFIG.url}/${framework.id}`;
  const image = framework.branding?.logo
    ? `${SITE_CONFIG.url}/og_image.png` // Use default for now, could generate dynamic OG images later
    : `${SITE_CONFIG.url}/og_image.png`;

  const keywords = [
    framework.name,
    `${framework.name} framework`,
    `${framework.name} performance`,
    `${framework.name} comparison`,
    `${framework.name} vs React`,
    `${framework.name} vs Vue`,
    'frontend framework comparison',
    'JavaScript frameworks',
    ...SITE_CONFIG.keywords
  ];

  return generateMetaTags({
    title,
    description,
    url,
    image,
    imageAlt: `${framework.name} - Framework analysis and comparison`,
    type: 'article',
    keywords,
    canonical: url
  });
}

/**
 * Generate Schema.org structured data for framework pages
 */
export function generateFrameworkSchema(framework: {
  id: string;
  name: string;
  description: string;
  links?: {
    website?: string;
    github?: string;
    docs?: string;
  };
}, stats?: {
  github?: {
    stars?: number;
    forks?: number;
  };
  npm?: {
    downloads?: number;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: framework.name,
    description: framework.description,
    url: framework.links?.website,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    ...(framework.links?.github && {
      codeRepository: framework.links.github
    }),
    ...(stats?.github?.stars && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Math.min(5, Math.max(1, Math.log10(stats.github.stars))).toFixed(1),
        ratingCount: stats.github.stars,
        bestRating: '5',
        worstRating: '1'
      }
    }),
    ...(stats?.npm?.downloads && {
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/DownloadAction',
        userInteractionCount: stats.npm.downloads
      }
    })
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
