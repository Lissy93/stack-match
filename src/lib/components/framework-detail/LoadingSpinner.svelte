<div class="loading">
  <div class="spinner"></div>
  <p><slot>Loading...</slot></p>
</div>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    gap: var(--gap-md);
    color: var(--text-tertiary);
    min-height: 150px;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-primary);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading p {
    margin: 0;
    font-style: italic;
  }
</style>
