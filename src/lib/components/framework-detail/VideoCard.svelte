<script lang="ts">
  export let videoId: string | undefined;
  export let frameworkName: string;

  let showVideo = false;
</script>

{#if videoId}
  <div class="card video-card">
    <h3>Video Tutorial</h3>

    {#if !showVideo}
      <button
        class="video-thumbnail"
        on:click={() => showVideo = true}
        aria-label="Load video tutorial for {frameworkName}"
      >
        <img
          src="https://img.youtube.com/vi/{videoId}/maxresdefault.jpg"
          alt="Video thumbnail for {frameworkName}"
          class="thumbnail-img"
        />
        <div class="play-button" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </button>
    {:else}
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube-nocookie.com/embed/{videoId}?autoplay=1"
          title="{frameworkName} video tutorial"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    {/if}
  </div>
{/if}

<style>
  .video-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
  }

  h3 {
    margin: 0;
    font-size: var(--font-lg);
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: none;
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    background: var(--surface-tertiary);
    padding: 0;
    transition: transform var(--transition-normal);
  }

  .video-thumbnail:hover {
    transform: scale(1.02);
  }

  .thumbnail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 68px;
    height: 48px;
    background: rgba(239, 68, 68, 0.9);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: background var(--transition-normal);
  }

  .video-thumbnail:hover .play-button {
    background: rgba(239, 68, 68, 1);
  }

  .play-button svg {
    width: 28px;
    height: 28px;
    margin-left: 4px;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--surface-tertiary);
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
