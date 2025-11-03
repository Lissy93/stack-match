import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { frameworkCache, fetchWithRetry, CACHE_TTL } from "$lib/api-cache";

interface StackOverflowTagInfo {
  count: number;
  name: string;
  is_required: boolean;
  is_moderator_only: boolean;
  synonyms?: string[];
}

interface StackOverflowResponse {
  items: StackOverflowTagInfo[];
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
}

export const GET: RequestHandler = async ({ params }) => {
  const tag = params.tag;

  if (!tag) {
    return json(
      {
        error: "Tag parameter is required",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = `stackoverflow:${tag}`;
  const cached = frameworkCache.get<StackOverflowTagInfo>(cacheKey);

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
      `https://api.stackexchange.com/2.3/tags/${encodeURIComponent(tag)}/info?site=stackoverflow`,
      { timeout: 10000 }
    );

    if (!response.ok) {
      return json(
        {
          error: "Failed to fetch Stack Overflow data",
          status: response.status,
          tag,
          timestamp: new Date().toISOString(),
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as StackOverflowResponse;

    if (!data.items || data.items.length === 0) {
      return json(
        {
          error: "Tag not found",
          tag,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const tagInfo = data.items[0];

    // Cache for 24 hours
    frameworkCache.set(cacheKey, tagInfo, CACHE_TTL.GITHUB_REPO);

    return json(tagInfo, {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "X-Cache-Hit": "false",
      },
    });
  } catch (error) {
    console.error("Stack Overflow API Error:", error);

    return json(
      {
        error: "Failed to fetch Stack Overflow data",
        message: error instanceof Error ? error.message : "Unknown error",
        tag,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
