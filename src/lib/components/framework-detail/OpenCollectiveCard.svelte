<script lang="ts">
  import { onMount } from 'svelte';
  import BaseCard from './BaseCard.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import NoData from './NoData.svelte';
  import type { OpenCollectiveData } from '$lib/types';

  export let slug: string | undefined;

  let loading = true;
  let error = false;
  let data: OpenCollectiveData | null = null;

  function formatCurrency(amount: number, currency: string): string {
    if (amount === null || amount === undefined) return 'N/A';
    const formatted = amount >= 1000 ? `${(amount / 1000).toFixed(1)}K` : amount.toFixed(0);
    const symbol = currency === 'USD' ? '$' : currency;
    return `${symbol}${formatted}`;
  }

  function formatRunway(months: number | null): string {
    if (months === null || months === 0) return 'N/A';
    if (months < 1) return '<1 month';
    if (months >= 12) {
      const years = (months / 12).toFixed(1);
      return `${years} years`;
    }
    return `${Math.round(months)} months`;
  }

  function getRunwayClass(months: number | null): string {
    if (months === null) return '';
    if (months < 3) return 'runway-critical';
    if (months < 12) return 'runway-warning';
    return 'runway-healthy';
  }

  function hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== 0;
  }

  onMount(async () => {
    if (!slug) {
      loading = false;
      return;
    }

    try {
      const response = await fetch(`/api/opencollective/${encodeURIComponent(slug)}`);
      if (response.ok) {
        data = await response.json();
      } else {
        error = true;
      }
    } catch (err) {
      console.error('Failed to fetch Open Collective data:', err);
      error = true;
    } finally {
      loading = false;
    }
  });
</script>

<BaseCard title="Community Funding">
  {#if !slug}
    <NoData>No Open Collective information</NoData>
  {:else if loading}
    <LoadingSpinner>Loading funding data...</LoadingSpinner>
  {:else if error || !data}
    <NoData>Unable to load funding data</NoData>
  {:else}
    <div class="content">
      <div class="stats-grid">
        {#if hasValue(data.balance)}
          <div class="stat">
            <div class="stat-value">{formatCurrency(data.balance, data.currency)}</div>
            <div class="stat-label">Current Balance</div>
          </div>
        {/if}

        {#if hasValue(data.runwayMonths)}
          <div class="stat {getRunwayClass(data.runwayMonths)}">
            <div class="stat-value">{formatRunway(data.runwayMonths)}</div>
            <div class="stat-label">Financial Runway</div>
          </div>
        {/if}

        {#if hasValue(data.monthlySpending)}
          <div class="stat">
            <div class="stat-value">{formatCurrency(data.monthlySpending, data.currency)}</div>
            <div class="stat-label">Monthly Spending</div>
          </div>
        {/if}

        {#if hasValue(data.totalAmountReceived)}
          <div class="stat">
            <div class="stat-value">{formatCurrency(data.totalAmountReceived, data.currency)}</div>
            <div class="stat-label">Total Raised</div>
          </div>
        {/if}

        {#if hasValue(data.totalAmountSpent)}
          <div class="stat">
            <div class="stat-value">{formatCurrency(data.totalAmountSpent, data.currency)}</div>
            <div class="stat-label">Total Spent</div>
          </div>
        {/if}

        {#if hasValue(data.yearlyBudget)}
          <div class="stat">
            <div class="stat-value">{formatCurrency(data.yearlyBudget, data.currency)}</div>
            <div class="stat-label">Yearly Budget</div>
          </div>
        {/if}

        {#if hasValue(data.contributorsCount)}
          <div class="stat">
            <div class="stat-value">{data.contributorsCount}</div>
            <div class="stat-label">Contributors</div>
          </div>
        {/if}

        {#if data.recurringContributions && hasValue((data.recurringContributions.monthly || 0) + (data.recurringContributions.yearly || 0))}
          <div class="stat">
            <div class="stat-value">{(data.recurringContributions.monthly || 0) + (data.recurringContributions.yearly || 0)}</div>
            <div class="stat-label">Recurring Supporters</div>
          </div>
        {/if}

        {#if hasValue(data.backerCount)}
          <div class="stat">
            <div class="stat-value">{data.backerCount}</div>
            <div class="stat-label">Individual Backers</div>
          </div>
        {/if}

        {#if hasValue(data.sponsorCount)}
          <div class="stat">
            <div class="stat-value">{data.sponsorCount}</div>
            <div class="stat-label">Org Sponsors</div>
          </div>
        {/if}
      </div>

      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
        aria-label="View on Open Collective"
      >
        Support on Open Collective →
      </a>
    </div>
  {/if}
</BaseCard>

<style>

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap-md);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--gap-md);
    background: var(--surface-tertiary);
    border-radius: var(--radius-md);
    transition: all var(--transition-normal);
  }

  .stat-value {
    font-size: var(--font-lg);
    font-weight: 700;
    color: var(--accent-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    text-align: center;
  }

  /* Runway color coding */
  .runway-healthy .stat-value {
    color: #10b981; /* Green */
  }

  .runway-warning .stat-value {
    color: #f59e0b; /* Yellow/Orange */
  }

  .runway-critical .stat-value {
    color: #ef4444; /* Red */
  }


  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-value {
      font-size: var(--font-base);
    }
  }
</style>
