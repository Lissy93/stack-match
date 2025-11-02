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
  @import './about-shared.scss';
</style>
