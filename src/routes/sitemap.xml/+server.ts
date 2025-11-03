import type { RequestHandler } from './$types';
import data from '../../data.json';

const SITE_URL = 'https://stack-match.as93.net';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls.map((url) => {
    let entry = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;

    if (url.lastmod) {
      entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }

    if (url.changefreq) {
      entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }

    if (url.priority !== undefined) {
      entry += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    }

    entry += '\n  </url>';
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

export const GET: RequestHandler = async () => {
  const now = new Date().toISOString();

  const urls: SitemapUrl[] = [
    // Homepage - highest priority, changes frequently
    {
      loc: SITE_URL,
      lastmod: now,
      changefreq: 'weekly',
      priority: 1.0
    },
    // About page
    {
      loc: `${SITE_URL}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7
    },
    // Compare page
    {
      loc: `${SITE_URL}/compare`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    // Framework detail pages - dynamic based on data.json
    ...data.meta.map((framework) => ({
      loc: `${SITE_URL}/${framework.id}`,
      lastmod: now,
      changefreq: 'weekly' as const,
      priority: 0.8
    }))
  ];

  const sitemap = generateSitemapXml(urls);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600, s-maxage=3600' // Cache for 1 hour
    }
  });
};

// Enable prerendering for sitemap
export const prerender = true;
