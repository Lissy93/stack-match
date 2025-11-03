import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { frameworkCache, fetchWithRetry, CACHE_TTL } from "$lib/api-cache";

interface JsDelivrStats {
  total: number;
  rank: number;
  last30Days: number;
  packageName: string;
}

export const GET: RequestHandler = async ({ params }) => {
  const packageName = params.package;

  if (!packageName) {
    return json(
      {
        error: "Package parameter is required",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = `jsdelivr:${packageName}`;
  const cached = frameworkCache.get<JsDelivrStats>(cacheKey);

  if (cached) {
    return json(cached, {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "X-Cache-Hit": "true",
      },
    });
  }

  try {
    const response = await fetchWithRetry(
      `https://data.jsdelivr.com/v1/stats/packages/npm/${encodeURIComponent(packageName)}`,
      { timeout: 10000 }
    );

    if (!response.ok) {
      return json(
        {
          error: "Failed to fetch jsDelivr data",
          status: response.status,
          packageName,
          timestamp: new Date().toISOString(),
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data || !data.hits) {
      return json(
        {
          error: "Package not found or no data available",
          packageName,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Calculate last 30 days total
    const dates = Object.entries(data.hits.dates || {});
    const last30Days = dates
      .slice(-30)
      .reduce((sum, [, hits]) => sum + (hits as number), 0);

    const statsData: JsDelivrStats = {
      total: data.hits.total || 0,
      rank: data.hits.rank || 0,
      last30Days,
      packageName,
    };

    // Cache for 24 hours
    frameworkCache.set(cacheKey, statsData, CACHE_TTL.GITHUB_REPO);

    return json(statsData, {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "X-Cache-Hit": "false",
      },
    });
  } catch (error) {
    console.error("jsDelivr API Error:", error);

    return json(
      {
        error: "Failed to fetch jsDelivr data",
        message: error instanceof Error ? error.message : "Unknown error",
        packageName,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
