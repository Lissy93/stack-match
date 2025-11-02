<div class="no-data">
  <p><slot>No data available</slot></p>
</div>

<style>
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--gap-xl);
    gap: var(--gap-md);
    color: var(--text-tertiary);
    min-height: 150px;
  }

  .no-data p {
    margin: 0;
    font-style: italic;
  }
</style>
