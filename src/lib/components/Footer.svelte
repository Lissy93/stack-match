<script lang="ts">
  import { Github, Info } from 'lucide-svelte';

  const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="footer-content">
    <div class="footer-left">
      <span class="copyright">
        Stack Match is released under the
        <a
          href="https://github.com/Lissy93/stack-match/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer license"
          class="license"
          aria-label="MIT License"
        >
          MIT License
        </a>
        <span class="separator" aria-hidden="true">•</span>
        © {currentYear}
        <a
          href="https://aliciasykes.com"
          target="_blank"
          rel="noopener noreferrer author"
          aria-label="Alicia Sykes's website"
        >
          Alicia Sykes
        </a>
      </span>
    </div>

    <div class="footer-right">
      <a
        href="/about"
        class="footer-link"
        aria-label="About Stack Match"
      >
        <Info size={16} />
        <span>About</span>
      </a>
      <a
        href="https://github.com/Lissy93/stack-match"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-link"
        aria-label="View source code on GitHub"
      >
        <Github size={16} />
        <span>Source</span>
      </a>
    </div>
  </div>
</footer>

<style lang="scss">
  .footer {
    width: 100%;
    background: var(--surface-secondary);
    border-top: 1px solid var(--border-primary);
    margin-top: var(--gap-md);
  }

  .footer-content {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--gap-sm) var(--gap-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-md);
    flex-wrap: wrap;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: var(--gap-sm);
    flex-wrap: wrap;
    font-size: var(--font-sm);
    color: var(--text-tertiary);
  }

  .copyright {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--accent-primary);
      }
    }
  }

  .separator {
    color: var(--border-primary);
    user-select: none;
  }

  .license {
    color: var(--text-tertiary);
    text-decoration: none;
    transition: color var(--transition-fast);
    font-size: var(--font-xs);

    &:hover {
      color: var(--text-secondary);
    }
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: var(--gap-md);
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--gap-xs) var(--gap-sm);
    color: var(--text-secondary);
    text-decoration: none;
    font-size: var(--font-sm);
    font-weight: 500;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);

    &:hover {
      color: var(--accent-primary);
      background: var(--surface-tertiary);
    }

    :global(svg) {
      flex-shrink: 0;
    }
  }

  @media (max-width: 640px) {
    .footer-content {
      flex-direction: column;
      align-items: flex-start;
      padding: var(--gap-md) var(--gap-md);
      gap: var(--gap-sm);
    }

    .footer-left {
      font-size: var(--font-xs);
    }

    .footer-right {
      width: 100%;
      justify-content: flex-start;
    }

    .footer-link {
      font-size: var(--font-xs);
      padding: var(--gap-xs);

      :global(svg) {
        width: 14px;
        height: 14px;
      }
    }
  }
</style>
