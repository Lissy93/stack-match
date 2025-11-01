/**
 * Parse GitHub Link header to extract total count from pagination
 * @param linkHeader - The Link header from GitHub API response
 * @returns The total count from the last page number, or 1 if no pagination
 */
export function parseGitHubLinkHeader(linkHeader: string | null): number {
  if (!linkHeader) return 1;

  const match = linkHeader.match(/page=(\d+)>; rel="last"/);
  return match ? parseInt(match[1], 10) : 1;
}
