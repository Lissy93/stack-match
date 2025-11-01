import type { ParamMatcher } from '@sveltejs/kit';
import { getAllFrameworkIds } from '$lib/framework-meta';

/**
 * Param matcher to ensure the framework route only matches valid framework IDs.
 * This prevents the route from matching file requests like sw.js, robots.txt, etc.
 */
export const match: ParamMatcher = (param) => {
  // Check if the param matches any of the known framework IDs
  const validFrameworks = getAllFrameworkIds();
  return validFrameworks.includes(param);
};
