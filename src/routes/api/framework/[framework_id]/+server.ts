import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getFrameworkMeta, getAllFrameworkIds } from "$lib/framework-meta";
import {
  frameworkCache,
  rateLimiter,
  fetchWithRetry,
  getCacheKey,
  getGitHubCacheKey,
  getNPMCacheKey,
  getBundleCacheKey,
  getSecurityCacheKey,
  CACHE_TTL,
} from "$lib/api-cache";

// Environment variables for API keys (optional - some APIs work without auth)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// GitHub API response interface
interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  subscribers_count: number;
  network_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  language: string;
  license?: {
    key: string;
    name: string;
  };
  topics: string[];
  archived: boolean;
  disabled: boolean;
  default_branch: string;
}

// Response interfaces
interface APIError {
  source: string;
  message: string;
  code?: string | number;
  timestamp: string;
}

interface GitHubRepoData {
  stars: number;
  forks: number;
  watchers: number;
  open_issues: number;
  subscribers_count: number;
  network_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  language: string;
  license?: {
    key: string;
    name: string;
  };
  topics: string[];
  archived: boolean;
  disabled: boolean;
  default_branch: string;
}

interface GitHubCommitActivity {
  total: number;
  week: number;
  days: number[];
}

interface GitHubContributorsData {
  total_contributors: number;
  top_contributors: Array<{
    login: string;
    contributions: number;
    avatar_url: string;
  }>;
}

interface GitHubReleasesData {
  latest_release?: {
    tag_name: string;
    published_at: string;
    prerelease: boolean;
    draft: boolean;
  };
  total_releases: number;
}

interface NPMData {
  name: string;
  version: string;
  description: string;
  keywords: string[];
  license: string;
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  downloads: {
    last_day: number;
    last_week: number;
    last_month: number;
  };
  versions: {
    latest: string;
    beta?: string;
    next?: string;
  };
  dependencies_count: number;
  dev_dependencies_count: number;
  peer_dependencies_count: number;
  maintainers: Array<{
    name: string;
    email: string;
  }>;
  created: string;
  modified: string;
}

interface BundleData {
  name: string;
  size: number;
  gzip: number;
  dependency_count: number;
  dependencies: Array<{
    name: string;
    size: number;
  }>;
}

interface SecurityData {
  vulnerabilities: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
    total: number;
  };
  last_audit: string;
}

interface EcosystemHealth {
  github_activity_score: number; // 0-100
  npm_popularity_score: number; // 0-100
  maintenance_score: number; // 0-100
  community_score: number; // 0-100
  security_score: number; // 0-100
  overall_health: number; // 0-100
}

interface FrameworkStats {
  id: string;
  name: string;
  metadata: any;
  github: GitHubRepoData & {
    commit_activity: GitHubCommitActivity[];
    contributors: GitHubContributorsData;
    releases: GitHubReleasesData;
    health_percentage: number;
  };
  npm: NPMData;
  bundle: BundleData;
  security: SecurityData;
  ecosystem: EcosystemHealth;
  last_updated: string;
  errors: APIError[];
}

// Utility function to get client IP for rate limiting
function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("x-remote-addr");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return realIP || remoteAddr || "unknown";
}

// GitHub API calls
async function fetchGitHubData(
  owner: string,
  repo: string,
  errors: APIError[],
): Promise<Partial<FrameworkStats["github"]>> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Stack-Match-App",
  };

  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }

  const result: Partial<FrameworkStats["github"]> = {};

  // Fetch repository data with caching
  try {
    const cacheKey = getGitHubCacheKey(owner, repo, "repo");
    let repoData = frameworkCache.get<GitHubRepoResponse>(cacheKey);

    if (!repoData) {
      const repoResponse = await fetchWithRetry(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers, timeout: 15000 },
      );

      if (repoResponse.ok) {
        repoData = await repoResponse.json() as GitHubRepoResponse;
        frameworkCache.set(cacheKey, repoData, CACHE_TTL.GITHUB_REPO);
      } else {
        errors.push({
          source: "github-repo",
          message: `Failed to fetch repository data: ${repoResponse.status}`,
          code: repoResponse.status,
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (repoData) {
      result.stars = repoData.stargazers_count;
      result.forks = repoData.forks_count;
      result.watchers = repoData.watchers_count;
      result.open_issues = repoData.open_issues_count;
      result.subscribers_count = repoData.subscribers_count;
      result.network_count = repoData.network_count;
      result.created_at = repoData.created_at;
      result.updated_at = repoData.updated_at;
      result.pushed_at = repoData.pushed_at;
      result.size = repoData.size;
      result.language = repoData.language;
      result.license = repoData.license;
      result.topics = repoData.topics || [];
      result.archived = repoData.archived;
      result.disabled = repoData.disabled;
      result.default_branch = repoData.default_branch;
    }
  } catch (error) {
    errors.push({
      source: "github-repo",
      message: `Error fetching repository data: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Fetch commit activity (52 weeks) with caching
  try {
    const cacheKey = getGitHubCacheKey(owner, repo, "activity");
    let activityData = frameworkCache.get<GitHubCommitActivity[]>(cacheKey);

    if (!activityData) {
      const activityResponse = await fetchWithRetry(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        { headers, timeout: 15000 },
      );

      if (activityResponse.ok) {
        activityData = await activityResponse.json() as GitHubCommitActivity[];
        frameworkCache.set(cacheKey, activityData, CACHE_TTL.GITHUB_ACTIVITY);
      }
    }

    if (activityData) {
      result.commit_activity = activityData;
    }
  } catch (error) {
    errors.push({
      source: "github-activity",
      message: `Error fetching commit activity: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Fetch contributors
  try {
    const contributorsResponse = await fetchWithRetry(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`,
      { headers },
    );

    if (contributorsResponse.ok) {
      const contributors = await contributorsResponse.json();
      result.contributors = {
        total_contributors: contributors.length,
        top_contributors: contributors.slice(0, 5).map((c: any) => ({
          login: c.login,
          contributions: c.contributions,
          avatar_url: c.avatar_url,
        })),
      };
    }
  } catch (error) {
    errors.push({
      source: "github-contributors",
      message: `Error fetching contributors: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Fetch releases
  try {
    const releasesResponse = await fetchWithRetry(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=1`,
      { headers },
    );

    if (releasesResponse.ok) {
      const releases = await releasesResponse.json();
      if (releases.length > 0) {
        result.releases = {
          latest_release: {
            tag_name: releases[0].tag_name,
            published_at: releases[0].published_at,
            prerelease: releases[0].prerelease,
            draft: releases[0].draft,
          },
          total_releases: releases.length,
        };
      }
    }
  } catch (error) {
    errors.push({
      source: "github-releases",
      message: `Error fetching releases: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Calculate health percentage based on available metrics
  if (result.pushed_at && result.open_issues !== undefined && result.stars) {
    const daysSinceLastPush =
      (Date.now() - new Date(result.pushed_at).getTime()) /
      (1000 * 60 * 60 * 24);
    const issueRatio = result.open_issues / Math.max(result.stars / 1000, 1);
    const activityScore = Math.max(0, 100 - daysSinceLastPush);
    const issueScore = Math.max(0, 100 - issueRatio * 10);
    result.health_percentage = Math.round((activityScore + issueScore) / 2);
  }

  return result;
}

// NPM API calls
async function fetchNPMData(
  packageName: string,
  errors: APIError[],
): Promise<Partial<NPMData>> {
  const result: Partial<NPMData> = {};

  try {
    // Fetch package info
    const packageResponse = await fetchWithRetry(
      `https://registry.npmjs.org/${packageName}/latest`,
    );

    if (packageResponse.ok) {
      const packageData = await packageResponse.json();
      result.name = packageData.name;
      result.version = packageData.version;
      result.description = packageData.description;
      result.keywords = packageData.keywords || [];
      result.license = packageData.license;
      result.homepage = packageData.homepage;
      result.repository = packageData.repository;
      result.dependencies_count = Object.keys(
        packageData.dependencies || {},
      ).length;
      result.dev_dependencies_count = Object.keys(
        packageData.devDependencies || {},
      ).length;
      result.peer_dependencies_count = Object.keys(
        packageData.peerDependencies || {},
      ).length;
      result.maintainers = packageData.maintainers || [];
    } else {
      errors.push({
        source: "npm-package",
        message: `Failed to fetch NPM package data: ${packageResponse.status}`,
        code: packageResponse.status,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    errors.push({
      source: "npm-package",
      message: `Error fetching NPM package data: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Fetch download stats
    const downloadsResponse = await fetchWithRetry(
      `https://api.npmjs.org/downloads/point/last-month/${packageName}`,
    );

    if (downloadsResponse.ok) {
      const downloadsData = await downloadsResponse.json();
      result.downloads = {
        last_month: downloadsData.downloads,
        last_week: 0, // Would need additional API call
        last_day: 0, // Would need additional API call
      };
    }
  } catch (error) {
    errors.push({
      source: "npm-downloads",
      message: `Error fetching NPM download stats: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Fetch all versions info
    const versionsResponse = await fetchWithRetry(
      `https://registry.npmjs.org/${packageName}`,
    );

    if (versionsResponse.ok) {
      const versionsData = await versionsResponse.json();
      result.created = versionsData.time?.created;
      result.modified = versionsData.time?.modified;

      const distTags = versionsData["dist-tags"] || {};
      result.versions = {
        latest: distTags.latest,
        beta: distTags.beta,
        next: distTags.next,
      };
    }
  } catch (error) {
    errors.push({
      source: "npm-versions",
      message: `Error fetching NPM versions: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
}

// Bundle Phobia API
async function fetchBundleData(
  packageName: string,
  errors: APIError[],
): Promise<Partial<BundleData>> {
  const result: Partial<BundleData> = {};

  try {
    const bundleResponse = await fetchWithRetry(
      `https://bundlephobia.com/api/size?package=${packageName}`,
    );

    if (bundleResponse.ok) {
      const bundleData = await bundleResponse.json();
      result.name = bundleData.name;
      result.size = bundleData.size;
      result.gzip = bundleData.gzip;
      result.dependency_count = bundleData.dependencyCount || 0;
      result.dependencies =
        bundleData.dependencies
          ?.map((dep: any) => ({
            name: dep.name,
            size: dep.approximateSize,
          }))
          .slice(0, 10) || [];
    } else {
      errors.push({
        source: "bundlephobia",
        message: `Failed to fetch bundle data: ${bundleResponse.status}`,
        code: bundleResponse.status,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    errors.push({
      source: "bundlephobia",
      message: `Error fetching bundle data: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
}

// Security audit (NPM audit API alternative - using Snyk or similar)
async function fetchSecurityData(
  packageName: string,
  errors: APIError[],
): Promise<Partial<SecurityData>> {
  const result: Partial<SecurityData> = {
    vulnerabilities: {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      total: 0,
    },
    last_audit: new Date().toISOString(),
  };

  try {
    // Using OSV.dev API for vulnerability data
    const securityResponse = await fetchWithRetry(
      "https://api.osv.dev/v1/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package: {
            name: packageName,
            ecosystem: "npm",
          },
        }),
      },
    );

    if (securityResponse.ok) {
      const securityData = await securityResponse.json();
      const vulnerabilities = securityData.vulns || [];

      result.vulnerabilities = vulnerabilities.reduce(
        (acc: any, vuln: any) => {
          const severity =
            vuln.database_specific?.severity?.toLowerCase() || "low";
          if (severity.includes("critical")) acc.critical++;
          else if (severity.includes("high")) acc.high++;
          else if (severity.includes("moderate") || severity.includes("medium"))
            acc.moderate++;
          else acc.low++;
          acc.total++;
          return acc;
        },
        { critical: 0, high: 0, moderate: 0, low: 0, total: 0 },
      );
    }
  } catch (error) {
    errors.push({
      source: "security-audit",
      message: `Error fetching security data: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: new Date().toISOString(),
    });
  }

  return result;
}

// Calculate ecosystem health scores
function calculateEcosystemHealth(
  github: Partial<FrameworkStats["github"]>,
  npm: Partial<NPMData>,
  bundle: Partial<BundleData>,
  security: Partial<SecurityData>,
): EcosystemHealth {
  // GitHub activity score (0-100)
  const github_activity_score = github.health_percentage || 0;

  // NPM popularity score based on downloads and stars
  const npm_downloads = npm.downloads?.last_month || 0;
  const github_stars = github.stars || 0;
  const npm_popularity_score = Math.min(
    100,
    Math.log(npm_downloads + 1) * 5 + Math.log(github_stars + 1) * 3,
  );

  // Maintenance score based on recent activity
  const days_since_push = github.pushed_at
    ? (Date.now() - new Date(github.pushed_at).getTime()) /
      (1000 * 60 * 60 * 24)
    : 365;
  const maintenance_score = Math.max(0, 100 - days_since_push / 2);

  // Community score based on contributors and issues
  const contributors_count = github.contributors?.total_contributors || 0;
  const issue_resolution = github.open_issues
    ? Math.max(
        0,
        100 - (github.open_issues / Math.max(github.stars || 1, 1)) * 100,
      )
    : 50;
  const community_score = Math.min(
    100,
    contributors_count * 5 + issue_resolution / 2,
  );

  // Security score based on vulnerabilities
  const vuln_count = security.vulnerabilities?.total || 0;
  const critical_vulns = security.vulnerabilities?.critical || 0;
  const high_vulns = security.vulnerabilities?.high || 0;
  const security_score = Math.max(
    0,
    100 - critical_vulns * 30 - high_vulns * 15 - vuln_count * 2,
  );

  // Overall health (weighted average)
  const overall_health = Math.round(
    github_activity_score * 0.25 +
      npm_popularity_score * 0.2 +
      maintenance_score * 0.25 +
      community_score * 0.15 +
      security_score * 0.15,
  );

  return {
    github_activity_score: Math.round(github_activity_score),
    npm_popularity_score: Math.round(npm_popularity_score),
    maintenance_score: Math.round(maintenance_score),
    community_score: Math.round(community_score),
    security_score: Math.round(security_score),
    overall_health,
  };
}

export const GET: RequestHandler = async ({ params, request }) => {
  const frameworkId = params["framework_id"];
  const errors: APIError[] = [];

  // Rate limiting check
  const clientIP = getClientIP(request);
  if (!rateLimiter.isAllowed(clientIP)) {
    return json(
      {
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        reset_time: new Date(rateLimiter.getResetTime(clientIP)).toISOString(),
        timestamp: new Date().toISOString(),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimiter.getResetTime(clientIP) - Date.now()) / 1000),
          ),
          "X-RateLimit-Remaining": String(
            rateLimiter.getRemainingRequests(clientIP),
          ),
          "X-RateLimit-Reset": String(rateLimiter.getResetTime(clientIP)),
        },
      },
    );
  }

  // Validate framework ID
  const frameworkMeta = getFrameworkMeta(frameworkId);
  if (!frameworkMeta) {
    return json(
      {
        error: `Framework '${frameworkId}' not found`,
        available_frameworks: getAllFrameworkIds(),
        timestamp: new Date().toISOString(),
      },
      { status: 404 },
    );
  }

  // Check cache first for complete response
  const fullCacheKey = getCacheKey("framework-stats", frameworkId);
  const cachedResponse = frameworkCache.get<FrameworkStats>(fullCacheKey);

  if (cachedResponse) {
    return json(cachedResponse, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Framework-ID": frameworkId,
        "X-Data-Sources": "github,npm,bundlephobia,osv",
        "X-Cache-Hit": "true",
        "X-RateLimit-Remaining": String(
          rateLimiter.getRemainingRequests(clientIP),
        ),
      },
    });
  }

  try {
    // Fetch data from all sources in parallel for better performance
    const [githubData, npmData, bundleData, securityData] =
      await Promise.allSettled([
        fetchGitHubData(
          frameworkMeta.github.owner,
          frameworkMeta.github.repo,
          errors,
        ),
        fetchNPMData(frameworkMeta.npm.packageName, errors),
        fetchBundleData(
          frameworkMeta.bundle.bundlephobiaName ||
            frameworkMeta.npm.packageName,
          errors,
        ),
        fetchSecurityData(frameworkMeta.npm.packageName, errors),
      ]);

    // Extract data from settled promises
    const github = githubData.status === "fulfilled" ? githubData.value : {};
    const npm = npmData.status === "fulfilled" ? npmData.value : {};
    const bundle = bundleData.status === "fulfilled" ? bundleData.value : {};
    const security =
      securityData.status === "fulfilled" ? securityData.value : {};

    // Add errors from rejected promises
    [githubData, npmData, bundleData, securityData].forEach((result, index) => {
      if (result.status === "rejected") {
        const sources = ["github", "npm", "bundle", "security"];
        errors.push({
          source: sources[index],
          message: `Promise rejected: ${result.reason}`,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Calculate ecosystem health
    const ecosystem = calculateEcosystemHealth(github, npm, bundle, security);

    const response: FrameworkStats = {
      id: frameworkId,
      name: frameworkMeta.name,
      metadata: frameworkMeta,
      github: github as FrameworkStats["github"],
      npm: npm as NPMData,
      bundle: bundle as BundleData,
      security: security as SecurityData,
      ecosystem,
      last_updated: new Date().toISOString(),
      errors,
    };

    // Cache the complete response
    frameworkCache.set(fullCacheKey, response, CACHE_TTL.FRAMEWORK_STATS);

    // Set cache headers for 1 hour
    return json(response, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "X-Framework-ID": frameworkId,
        "X-Data-Sources": "github,npm,bundlephobia,osv",
        "X-Cache-Hit": "false",
        "X-RateLimit-Remaining": String(
          rateLimiter.getRemainingRequests(clientIP),
        ),
        "X-Error-Count": String(errors.length),
        "X-Response-Time": Date.now().toString(),
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    return json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        framework_id: frameworkId,
        timestamp: new Date().toISOString(),
        errors,
      },
      { status: 500 },
    );
  }
};
