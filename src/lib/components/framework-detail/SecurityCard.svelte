<script lang="ts">
  export let security: any;

  $: totalVulns = security?.vulnerabilities?.total || 0;
  $: securityClass = totalVulns === 0 ? 'security-excellent' :
                     totalVulns < 5 ? 'security-good' :
                     totalVulns < 15 ? 'security-fair' : 'security-poor';
</script>

<div class="card security-card">
  <h3>Security</h3>

  <div class="security-score {securityClass}">
    <div class="score-icon">🔒</div>
    <div class="score-content">
      <div class="score-value">{totalVulns}</div>
      <div class="score-label">Known Vulnerabilities</div>
    </div>
  </div>

  {#if security?.vulnerabilities}
    <div class="vulnerability-breakdown">
      {#if security.vulnerabilities.critical > 0}
        <div class="vuln-item vuln-critical">
          <span class="vuln-label">Critical</span>
          <span class="vuln-count">{security.vulnerabilities.critical}</span>
        </div>
      {/if}

      {#if security.vulnerabilities.high > 0}
        <div class="vuln-item vuln-high">
          <span class="vuln-label">High</span>
          <span class="vuln-count">{security.vulnerabilities.high}</span>
        </div>
      {/if}

      {#if security.vulnerabilities.moderate > 0}
        <div class="vuln-item vuln-moderate">
          <span class="vuln-label">Moderate</span>
          <span class="vuln-count">{security.vulnerabilities.moderate}</span>
        </div>
      {/if}

      {#if security.vulnerabilities.low > 0}
        <div class="vuln-item vuln-low">
          <span class="vuln-label">Low</span>
          <span class="vuln-count">{security.vulnerabilities.low}</span>
        </div>
      {/if}

      {#if totalVulns === 0}
        <div class="no-vulnerabilities">
          <span>✓ No known vulnerabilities</span>
        </div>
      {/if}
    </div>
  {/if}

  {#if security?.last_audit}
    <div class="audit-time">
      Last audit: {new Date(security.last_audit).toLocaleDateString()}
    </div>
  {/if}
</div>

<style>
  .security-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .security-score {
    display: flex;
    align-items: center;
    gap: var(--gap-lg);
    padding: var(--gap-lg);
    border-radius: var(--radius-lg);
  }

  .score-icon {
    font-size: 3rem;
  }

  .score-content {
    display: flex;
    flex-direction: column;
  }

  .score-value {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .score-label {
    font-size: var(--font-sm);
    opacity: 0.8;
    margin-top: var(--gap-xs);
  }

  .security-excellent {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .security-good {
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-primary);
  }

  .security-fair {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  .security-poor {
    background: rgba(239, 68, 68, 0.15);
    color: var(--text-danger);
  }

  .vulnerability-breakdown {
    display: flex;
    flex-direction: column;
    gap: var(--gap-sm);
  }

  .vuln-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gap-md);
    border-radius: var(--radius-md);
    font-weight: 600;
  }

  .vuln-critical {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .vuln-high {
    background: rgba(251, 146, 60, 0.15);
    color: #fb923c;
  }

  .vuln-moderate {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  .vuln-low {
    background: rgba(59, 130, 246, 0.15);
    color: var(--accent-primary);
  }

  .vuln-label {
    font-size: var(--font-sm);
  }

  .vuln-count {
    font-size: var(--font-lg);
  }

  .no-vulnerabilities {
    padding: var(--gap-md);
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border-radius: var(--radius-md);
    text-align: center;
    font-weight: 600;
  }

  .audit-time {
    padding-top: var(--gap-md);
    border-top: 1px solid var(--border-primary);
    font-size: var(--font-xs);
    color: var(--text-tertiary);
    text-align: center;
  }
</style>
