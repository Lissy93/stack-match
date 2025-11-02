<script lang="ts">
  const paragraphs = [
    'Web frameworks can be a divisive topic. Developers typically have very strong opinions, so it can be hard to find an unbiased, data driven comparison, when choosing a tech stack for any given specific project of use case.',
    'I built Stack Match to (attempt to) solve this. You select the aspects which are important to your project, and we show you a ranked list of suitable frontend frameworks.',
    'The aim was to have real data-driven and objective results, which are not biased by opinions or personal preferences.'
  ];
</script>

<section class="about-section">
  <div class="section-content">
    <h2>Why was this built?</h2>
    {#each paragraphs as paragraph}
      <p>{paragraph}</p>
    {/each}
  </div>
</section>

<style lang="scss">
  .about-section {
    padding: 0;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
    max-width: 1200px;
    margin: 0 auto;

    .section-content {
      background: var(--surface-secondary);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-lg);
      padding: var(--gap-2xl);
      transition: all var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-md);
      }
    }

    h2 {
      font-size: var(--font-2xl);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--gap-lg) 0;
      letter-spacing: -0.02em;
    }

    p {
      font-size: var(--font-base);
      line-height: 1.7;
      color: var(--text-secondary);
      margin: 0 0 var(--gap-md) 0;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .about-section {
      h2 {
        font-size: var(--font-xl);
      }

      .section-content {
        padding: var(--gap-lg);
      }
    }
  }
</style>
