<script lang="ts">
  export let scores: any;
  export let brandColor: string | undefined = undefined;

  const attributeLabels: Record<string, string> = {
    performance: 'Performance',
    maintainability: 'Maintainability',
    bundleSize: 'Bundle Size',
    buildTimes: 'Build Times',
    ecosystem: 'Ecosystem',
    scalability: 'Scalability',
    learningCurve: 'Learning Curve',
    tooling: 'Tooling',
    stability: 'Stability',
    viability: 'Viability'
  };

  const attributeDescriptions: Record<string, string> = {
    performance: 'Runtime speed and efficiency',
    maintainability: 'Code quality and ease of maintenance',
    bundleSize: 'Output size and load time',
    buildTimes: 'Development build speed',
    ecosystem: 'Available libraries and tools',
    scalability: 'Handles large applications',
    learningCurve: 'Ease of learning',
    tooling: 'Developer experience and tools',
    stability: 'API stability and maturity',
    viability: 'Long-term support and adoption'
  };

  function getScoreColor(score: number): string {
    if (score >= 8) return '#22c55e';
    if (score >= 6) return '#3b82f6';
    if (score >= 4) return '#fbbf24';
    return '#ef4444';
  }

  $: attributes = scores ? Object.entries(attributeLabels).map(([key, label]) => ({
    key,
    label,
    description: attributeDescriptions[key],
    value: scores[key] || 0
  })) : [];

  $: avgScore = attributes.length > 0
    ? Math.round(attributes.reduce((sum, attr) => sum + attr.value, 0) / attributes.length * 10) / 10
    : 0;
</script>

<div class="card card-large framework-scores-card">
  <div class="card-header">
    <h3>Framework Ratings</h3>
    <div class="avg-score">
      <span class="avg-value">{avgScore}</span>
      <span class="avg-label">/10 avg</span>
    </div>
  </div>

  {#if attributes.length > 0}
    <div class="scores-grid">
      {#each attributes as attr}
        <div class="score-item" title={attr.description}>
          <div class="score-header">
            <span class="score-label">{attr.label}</span>
            <span class="score-value" style="color: {getScoreColor(attr.value)}">
              {attr.value}/10
            </span>
          </div>
          <div class="score-bar">
            <div
              class="score-fill"
              style="width: {attr.value * 10}%; background-color: {getScoreColor(attr.value)}"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="no-data">
      <p>No rating data available</p>
    </div>
  {/if}
</div>

<style>
  .framework-scores-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .avg-score {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
    padding: var(--gap-sm) var(--gap-md);
    background: var(--brand-color-rgba, var(--accent-secondary));
    border-radius: var(--radius-md);
  }

  .avg-value {
    font-size: var(--font-2xl);
    font-weight: 700;
    color: var(--brand-color, var(--accent-primary));
  }

  .avg-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
  }

  .scores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--gap-lg);
  }

  .score-item {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
  }

  .score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .score-label {
    font-size: var(--font-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }

  .score-value {
    font-size: var(--font-base);
    font-weight: 700;
  }

  .score-bar {
    height: 8px;
    background: var(--surface-tertiary);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .score-fill {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width 0.8s ease;
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    color: var(--text-tertiary);
    font-style: italic;
  }

  @media (max-width: 768px) {
    .scores-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
