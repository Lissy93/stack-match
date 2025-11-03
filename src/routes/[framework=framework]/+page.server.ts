import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import data from '../../data.json';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
  const frameworkId = params.framework;

  try {
    // Fetch API data
    const apiResponse = await fetch(`${url.origin}/api/framework/${frameworkId}`);

    // Handle API response
    let frameworkData = null;
    let apiError = null;

    if (apiResponse.ok) {
      frameworkData = await apiResponse.json();
    } else {
      // Store error but don't throw - we still want to show the page with loading state
      apiError = {
        status: apiResponse.status,
        message: apiResponse.status === 404
          ? `Framework "${frameworkId}" not found`
          : apiResponse.status === 429
            ? 'Rate limit exceeded. Please try again later.'
            : `Failed to load framework data (${apiResponse.status})`
      };
    }

    // Handle static data from import
    const framework = data.frameworks.find((f: any) => f.name === frameworkId);
    const meta = data.meta.find((m: any) => m.id === frameworkId);

    let staticData = null;
    if (framework || meta) {
      staticData = { framework, meta };
    }

    // If we couldn't find the framework in static data, throw 404
    if (!staticData?.meta) {
      throw error(404, `Framework "${frameworkId}" not found`);
    }

    return {
      frameworkId,
      frameworkData,
      staticData,
      apiError
    };
  } catch (err) {
    console.error('Error in load function:', err);

    // If it's already a SvelteKit error, rethrow it
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }

    // Otherwise, throw a 500 error
    throw error(500, 'Failed to load framework data');
  }
};

// Enable prerendering for all framework pages
export const prerender = true;

// Provide entries for prerendering
export const entries: EntryGenerator = () => {
  return data.meta.map((meta: any) => ({ framework: meta.id }));
};
