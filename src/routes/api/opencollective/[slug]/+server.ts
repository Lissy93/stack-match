import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { frameworkCache, fetchWithRetry, CACHE_TTL } from "$lib/api-cache";

interface OpenCollectiveData {
  slug: string;
  name: string;
  description: string;
  totalAmountReceived: number;
  yearlyBudget: number;
  currency: string;
  backerCount: number;
  sponsorCount: number;
  url: string;
  balance: number;
  monthlySpending: number;
  totalAmountSpent: number;
  contributorsCount: number;
  runwayMonths: number | null;
  recurringContributions: {
    monthly: number;
    yearly: number;
  };
  createdAt: string;
}

const GRAPHQL_QUERY = `
  query Collective($slug: String!) {
    collective(slug: $slug) {
      slug
      name
      description
      currency
      createdAt
      stats {
        balance {
          valueInCents
        }
        totalAmountReceived {
          valueInCents
        }
        yearlyBudget {
          valueInCents
        }
        monthlySpending {
          valueInCents
        }
        totalAmountSpent {
          valueInCents
        }
        contributorsCount
        activeRecurringContributionsBreakdown {
          label
          count
        }
      }
      members(limit: 1) {
        totalCount
      }
      backers: members(role: BACKER, accountType: INDIVIDUAL, limit: 1) {
        totalCount
      }
      sponsors: members(role: BACKER, accountType: ORGANIZATION, limit: 1) {
        totalCount
      }
    }
  }
`;

export const GET: RequestHandler = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return json(
      {
        error: "Slug parameter is required",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = `opencollective:${slug}`;
  const cached = frameworkCache.get<OpenCollectiveData>(cacheKey);

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
      "https://api.opencollective.com/graphql/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GRAPHQL_QUERY,
          variables: { slug },
        }),
        timeout: 15000,
      }
    );

    if (!response.ok) {
      return json(
        {
          error: "Failed to fetch Open Collective data",
          status: response.status,
          slug,
          timestamp: new Date().toISOString(),
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.errors || !result.data?.collective) {
      return json(
        {
          error: "Collective not found",
          slug,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    const collective = result.data.collective;

    // Calculate runway in months (balance / monthly spending)
    const balance = collective.stats.balance.valueInCents / 100 || 0;
    const monthlySpending =
      collective.stats.monthlySpending.valueInCents / 100 || 0;
    const runwayMonths =
      monthlySpending > 0 ? balance / monthlySpending : null;

    // Extract recurring contributions breakdown
    const recurringBreakdown =
      collective.stats.activeRecurringContributionsBreakdown || [];
    const monthlyRecurring =
      recurringBreakdown.find((r: any) => r.label === "monthly")?.count || 0;
    const yearlyRecurring =
      recurringBreakdown.find((r: any) => r.label === "yearly")?.count || 0;

    const collectiveData: OpenCollectiveData = {
      slug: collective.slug,
      name: collective.name,
      description: collective.description,
      totalAmountReceived:
        collective.stats.totalAmountReceived.valueInCents / 100 || 0,
      yearlyBudget: collective.stats.yearlyBudget.valueInCents / 100 || 0,
      currency: collective.currency,
      backerCount: collective.backers.totalCount || 0,
      sponsorCount: collective.sponsors.totalCount || 0,
      url: `https://opencollective.com/${collective.slug}`,
      balance,
      monthlySpending,
      totalAmountSpent:
        Math.abs(collective.stats.totalAmountSpent.valueInCents / 100) || 0,
      contributorsCount: collective.stats.contributorsCount || 0,
      runwayMonths,
      recurringContributions: {
        monthly: monthlyRecurring,
        yearly: yearlyRecurring,
      },
      createdAt: collective.createdAt,
    };

    // Cache for 24 hours
    frameworkCache.set(cacheKey, collectiveData, CACHE_TTL.GITHUB_REPO);

    return json(collectiveData, {
      headers: {
        "Cache-Control": "public, max-age=86400",
        "X-Cache-Hit": "false",
      },
    });
  } catch (error) {
    console.error("Open Collective API Error:", error);

    return json(
      {
        error: "Failed to fetch Open Collective data",
        message: error instanceof Error ? error.message : "Unknown error",
        slug,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
