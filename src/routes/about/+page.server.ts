import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const repoStars: Record<string, number> = {};

  // List of repos to fetch stars for
  const repos = [
    'Lissy93/web-check',
    'Lissy93/dashy',
    'Lissy93/personal-security-checklist',
    'Lissy93/domain-locker',
    'Lissy93/networking-toolbox',
    'Lissy93/cso',
    'Lissy93/who-dat',
    'Lissy93/email-comparison',
    'Lissy93/permissionator',
    'Lissy93/raid-calculator'
  ];

  // Fetch all repos in parallel
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Stack-Match'
    };

    if (env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
    }

    const results = await Promise.allSettled(
      repos.map(async (repo) => {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          headers
        });

        if (!response.ok) {
          console.warn(`Failed to fetch stars for ${repo}: ${response.status}`);
          return null;
        }

        const data = await response.json();
        return {
          repo: repo.split('/')[1].toLowerCase(),
          stars: data.stargazers_count || 0
        };
      })
    );

    // Process results
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        repoStars[result.value.repo] = result.value.stars;
      }
    });
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
  }

  return {
    repoStars
  };
};
