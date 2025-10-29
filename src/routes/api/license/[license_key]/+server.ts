import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { frameworkCache, fetchWithRetry, CACHE_TTL } from "$lib/api-cache";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubLicenseResponse {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  html_url: string;
  description: string;
  implementation: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  body: string;
  featured: boolean;
}

export const GET: RequestHandler = async ({ params }) => {
  const licenseKey = params["license_key"];

  if (!licenseKey) {
    return json(
      {
        error: "License key is required",
        timestamp: new Date().toISOString(),
      },
      { status: 400 },
    );
  }

  // Check cache first
  const cacheKey = `license:${licenseKey}`;
  const cachedLicense = frameworkCache.get<GitHubLicenseResponse>(cacheKey);

  if (cachedLicense) {
    return json(cachedLicense, {
      headers: {
        "Cache-Control": "public, max-age=86400", // 24 hours
        "X-Cache-Hit": "true",
      },
    });
  }

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Stack-Match-App",
    };

    if (GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetchWithRetry(
      `https://api.github.com/licenses/${licenseKey}`,
      { headers, timeout: 15000 },
    );

    if (!response.ok) {
      return json(
        {
          error: `Failed to fetch license data`,
          status: response.status,
          license_key: licenseKey,
          timestamp: new Date().toISOString(),
        },
        { status: response.status },
      );
    }

    const licenseData = (await response.json()) as GitHubLicenseResponse;

    // Cache the response for 24 hours (licenses don't change often)
    frameworkCache.set(cacheKey, licenseData, CACHE_TTL.GITHUB_REPO);

    return json(licenseData, {
      headers: {
        "Cache-Control": "public, max-age=86400", // 24 hours
        "X-Cache-Hit": "false",
      },
    });
  } catch (error) {
    console.error("License API Error:", error);

    return json(
      {
        error: "Failed to fetch license data",
        message: error instanceof Error ? error.message : "Unknown error",
        license_key: licenseKey,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
};
