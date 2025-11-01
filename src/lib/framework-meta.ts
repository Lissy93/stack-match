// Comprehensive framework metadata for API integration
// This file contains static metadata needed for dynamic data fetching

export interface FrameworkMetadata {
  id: string;
  name: string;
  github: {
    owner: string;
    repo: string;
    fullName: string; // owner/repo format
  };
  npm: {
    packageName: string;
    alternativePackages?: string[]; // For multi-package frameworks
  };
  bundle: {
    // Package name for bundlephobia, might differ from npm package
    bundlephobiaName?: string;
    // Alternative bundle analyzers
    alternatives?: string[];
  };
  website?: string;
  docs?: string;
  category: "framework" | "library" | "meta-framework" | "build-tool";
  type: "spa" | "ssr" | "ssg" | "hybrid" | "build-tool";
  // Additional package names for ecosystem analysis
  ecosystem?: {
    corePackages?: string[];
    devTools?: string[];
    plugins?: string[];
  };
}

export const FRAMEWORK_METADATA: Record<string, FrameworkMetadata> = {
  react: {
    id: "react",
    name: "React",
    github: {
      owner: "facebook",
      repo: "react",
      fullName: "facebook/react",
    },
    npm: {
      packageName: "react",
      alternativePackages: ["react-dom", "react-router-dom"],
    },
    bundle: {
      bundlephobiaName: "react",
    },
    website: "https://reactjs.org",
    docs: "https://reactjs.org/docs",
    category: "library",
    type: "spa",
    ecosystem: {
      corePackages: ["react-dom", "react-router", "react-scripts"],
      devTools: ["@testing-library/react", "react-devtools"],
      plugins: ["babel-preset-react", "eslint-plugin-react"],
    },
  },

  angular: {
    id: "angular",
    name: "Angular",
    github: {
      owner: "angular",
      repo: "angular",
      fullName: "angular/angular",
    },
    npm: {
      packageName: "@angular/core",
      alternativePackages: [
        "@angular/common",
        "@angular/router",
        "@angular/forms",
      ],
    },
    bundle: {
      bundlephobiaName: "@angular/core",
    },
    website: "https://angular.io",
    docs: "https://angular.io/docs",
    category: "framework",
    type: "spa",
    ecosystem: {
      corePackages: ["@angular/cli", "@angular/common", "@angular/router"],
      devTools: ["@angular/devkit/build-angular", "angular-devtools"],
      plugins: ["@angular/eslint-plugin"],
    },
  },

  vue: {
    id: "vue",
    name: "Vue.js",
    github: {
      owner: "vuejs",
      repo: "core",
      fullName: "vuejs/core",
    },
    npm: {
      packageName: "vue",
      alternativePackages: ["vue-router", "vuex", "pinia"],
    },
    bundle: {
      bundlephobiaName: "vue",
    },
    website: "https://vuejs.org",
    docs: "https://vuejs.org/guide/",
    category: "framework",
    type: "spa",
    ecosystem: {
      corePackages: ["vue-router", "pinia", "@vue/cli"],
      devTools: ["@vue/devtools", "vite"],
      plugins: ["@vue/eslint-config", "vue-loader"],
    },
  },

  svelte: {
    id: "svelte",
    name: "Svelte",
    github: {
      owner: "sveltejs",
      repo: "svelte",
      fullName: "sveltejs/svelte",
    },
    npm: {
      packageName: "svelte",
    },
    bundle: {
      bundlephobiaName: "svelte",
    },
    website: "https://svelte.dev",
    docs: "https://svelte.dev/docs",
    category: "framework",
    type: "spa",
    ecosystem: {
      corePackages: ["@sveltejs/kit", "svelte-check"],
      devTools: ["@sveltejs/vite-plugin-svelte"],
      plugins: ["eslint-plugin-svelte3"],
    },
  },

  "next-js": {
    id: "next-js",
    name: "Next.js",
    github: {
      owner: "vercel",
      repo: "next.js",
      fullName: "vercel/next.js",
    },
    npm: {
      packageName: "next",
    },
    bundle: {
      bundlephobiaName: "next",
    },
    website: "https://nextjs.org",
    docs: "https://nextjs.org/docs",
    category: "meta-framework",
    type: "hybrid",
    ecosystem: {
      corePackages: ["react", "react-dom"],
      devTools: ["eslint-config-next"],
      plugins: ["@next/eslint-plugin-next"],
    },
  },

  "nuxt-js": {
    id: "nuxt-js",
    name: "Nuxt.js",
    github: {
      owner: "nuxt",
      repo: "nuxt",
      fullName: "nuxt/nuxt",
    },
    npm: {
      packageName: "nuxt",
    },
    bundle: {
      bundlephobiaName: "nuxt",
    },
    website: "https://nuxtjs.org",
    docs: "https://nuxtjs.org/docs",
    category: "meta-framework",
    type: "hybrid",
    ecosystem: {
      corePackages: ["vue", "@nuxt/devtools"],
      devTools: ["@nuxt/eslint-config"],
      plugins: ["@nuxt/module-builder"],
    },
  },

  astro: {
    id: "astro",
    name: "Astro",
    github: {
      owner: "withastro",
      repo: "astro",
      fullName: "withastro/astro",
    },
    npm: {
      packageName: "astro",
    },
    bundle: {
      bundlephobiaName: "astro",
    },
    website: "https://astro.build",
    docs: "https://docs.astro.build",
    category: "meta-framework",
    type: "ssg",
    ecosystem: {
      corePackages: ["@astrojs/node"],
      devTools: ["@astrojs/check"],
      plugins: ["@astrojs/react", "@astrojs/vue", "@astrojs/svelte"],
    },
  },

  solid: {
    id: "solid",
    name: "SolidJS",
    github: {
      owner: "solidjs",
      repo: "solid",
      fullName: "solidjs/solid",
    },
    npm: {
      packageName: "solid-js",
    },
    bundle: {
      bundlephobiaName: "solid-js",
    },
    website: "https://solidjs.com",
    docs: "https://solidjs.com/docs",
    category: "framework",
    type: "spa",
    ecosystem: {
      corePackages: ["solid-start", "@solidjs/router"],
      devTools: ["solid-devtools", "vite-plugin-solid"],
      plugins: ["babel-preset-solid", "eslint-plugin-solid"],
    },
  },

  qwik: {
    id: "qwik",
    name: "Qwik",
    github: {
      owner: "BuilderIO",
      repo: "qwik",
      fullName: "BuilderIO/qwik",
    },
    npm: {
      packageName: "@builder.io/qwik",
    },
    bundle: {
      bundlephobiaName: "@builder.io/qwik",
    },
    website: "https://qwik.builder.io",
    docs: "https://qwik.builder.io/docs",
    category: "framework",
    type: "hybrid",
    ecosystem: {
      corePackages: ["@builder.io/qwik-city"],
      devTools: ["@builder.io/eslint-plugin-qwik"],
      plugins: ["vite-plugin-qwik"],
    },
  },

  lit: {
    id: "lit",
    name: "Lit",
    github: {
      owner: "lit",
      repo: "lit",
      fullName: "lit/lit",
    },
    npm: {
      packageName: "lit",
    },
    bundle: {
      bundlephobiaName: "lit",
    },
    website: "https://lit.dev",
    docs: "https://lit.dev/docs/",
    category: "library",
    type: "spa",
    ecosystem: {
      corePackages: ["@lit/reactive-element", "lit-html"],
      devTools: ["@lit/eslint-plugin"],
      plugins: ["@lit/localize"],
    },
  },

  alpine: {
    id: "alpine",
    name: "Alpine.js",
    github: {
      owner: "alpinejs",
      repo: "alpine",
      fullName: "alpinejs/alpine",
    },
    npm: {
      packageName: "alpinejs",
    },
    bundle: {
      bundlephobiaName: "alpinejs",
    },
    website: "https://alpinejs.dev",
    docs: "https://alpinejs.dev/start-here",
    category: "library",
    type: "spa",
  },

  preact: {
    id: "preact",
    name: "Preact",
    github: {
      owner: "preactjs",
      repo: "preact",
      fullName: "preactjs/preact",
    },
    npm: {
      packageName: "preact",
    },
    bundle: {
      bundlephobiaName: "preact",
    },
    website: "https://preactjs.com",
    docs: "https://preactjs.com/guide/v10/getting-started",
    category: "library",
    type: "spa",
    ecosystem: {
      corePackages: ["preact-router"],
      devTools: ["@preact/preset-vite"],
      plugins: ["@babel/preset-react"],
    },
  },

  remix: {
    id: "remix",
    name: "Remix",
    github: {
      owner: "remix-run",
      repo: "remix",
      fullName: "remix-run/remix",
    },
    npm: {
      packageName: "@remix-run/react",
    },
    bundle: {
      bundlephobiaName: "@remix-run/react",
    },
    website: "https://remix.run",
    docs: "https://remix.run/docs",
    category: "meta-framework",
    type: "ssr",
    ecosystem: {
      corePackages: ["@remix-run/node", "@remix-run/serve"],
      devTools: ["@remix-run/dev"],
      plugins: ["@remix-run/eslint-config"],
    },
  },

  gatsby: {
    id: "gatsby",
    name: "Gatsby",
    github: {
      owner: "gatsbyjs",
      repo: "gatsby",
      fullName: "gatsbyjs/gatsby",
    },
    npm: {
      packageName: "gatsby",
    },
    bundle: {
      bundlephobiaName: "gatsby",
    },
    website: "https://gatsbyjs.com",
    docs: "https://gatsbyjs.com/docs",
    category: "meta-framework",
    type: "ssg",
    ecosystem: {
      corePackages: ["gatsby-cli", "gatsby-plugin-react-helmet"],
      devTools: ["gatsby-plugin-eslint"],
      plugins: ["gatsby-source-filesystem", "gatsby-transformer-remark"],
    },
  },

  ember: {
    id: "ember",
    name: "Ember.js",
    github: {
      owner: "emberjs",
      repo: "ember.js",
      fullName: "emberjs/ember.js",
    },
    npm: {
      packageName: "ember-source",
    },
    bundle: {
      bundlephobiaName: "ember-source",
    },
    website: "https://emberjs.com",
    docs: "https://guides.emberjs.com",
    category: "framework",
    type: "spa",
    ecosystem: {
      corePackages: ["ember-cli", "ember-data"],
      devTools: ["ember-inspector"],
      plugins: ["eslint-plugin-ember"],
    },
  },

  backbone: {
    id: "backbone",
    name: "Backbone.js",
    github: {
      owner: "jashkenas",
      repo: "backbone",
      fullName: "jashkenas/backbone",
    },
    npm: {
      packageName: "backbone",
    },
    bundle: {
      bundlephobiaName: "backbone",
    },
    website: "https://backbonejs.org",
    docs: "https://backbonejs.org",
    category: "library",
    type: "spa",
  },

  stimulus: {
    id: "stimulus",
    name: "Stimulus",
    github: {
      owner: "hotwired",
      repo: "stimulus",
      fullName: "hotwired/stimulus",
    },
    npm: {
      packageName: "@hotwired/stimulus",
    },
    bundle: {
      bundlephobiaName: "@hotwired/stimulus",
    },
    website: "https://stimulus.hotwired.dev",
    docs: "https://stimulus.hotwired.dev/handbook/introduction",
    category: "library",
    type: "spa",
  },

  fresh: {
    id: "fresh",
    name: "Fresh",
    github: {
      owner: "denoland",
      repo: "fresh",
      fullName: "denoland/fresh",
    },
    npm: {
      packageName: "$fresh",
    },
    bundle: {
      bundlephobiaName: "$fresh",
    },
    website: "https://fresh.deno.dev",
    docs: "https://fresh.deno.dev/docs",
    category: "meta-framework",
    type: "ssr",
  },

  jquery: {
    id: "jquery",
    name: "jQuery",
    github: {
      owner: "jquery",
      repo: "jquery",
      fullName: "jquery/jquery",
    },
    npm: {
      packageName: "jquery",
    },
    bundle: {
      bundlephobiaName: "jquery",
    },
    website: "https://jquery.com",
    docs: "https://api.jquery.com",
    category: "library",
    type: "spa",
  },

  marko: {
    id: "marko",
    name: "Marko",
    github: {
      owner: "marko-js",
      repo: "marko",
      fullName: "marko-js/marko",
    },
    npm: {
      packageName: "marko",
    },
    bundle: {
      bundlephobiaName: "marko",
    },
    website: "https://markojs.com",
    docs: "https://markojs.com/docs",
    category: "framework",
    type: "hybrid",
  },

  nue: {
    id: "nue",
    name: "Nue",
    github: {
      owner: "nuejs",
      repo: "nue",
      fullName: "nuejs/nue",
    },
    npm: {
      packageName: "nue",
    },
    bundle: {
      bundlephobiaName: "nue",
    },
    website: "https://nuejs.org",
    docs: "https://nuejs.org/docs",
    category: "framework",
    type: "spa",
  },

  rax: {
    id: "rax",
    name: "Rax",
    github: {
      owner: "alibaba",
      repo: "rax",
      fullName: "alibaba/rax",
    },
    npm: {
      packageName: "rax",
    },
    bundle: {
      bundlephobiaName: "rax",
    },
    website: "https://rax.js.org",
    docs: "https://rax.js.org/docs",
    category: "framework",
    type: "hybrid",
  },

  riot: {
    id: "riot",
    name: "Riot",
    github: {
      owner: "riot",
      repo: "riot",
      fullName: "riot/riot",
    },
    npm: {
      packageName: "riot",
    },
    bundle: {
      bundlephobiaName: "riot",
    },
    website: "https://riot.js.org",
    docs: "https://riot.js.org/documentation",
    category: "library",
    type: "spa",
  },

  vanilla: {
    id: "vanilla",
    name: "Vanilla JS",
    github: {
      owner: "javascript",
      repo: "javascript",
      fullName: "javascript/javascript",
    },
    npm: {
      packageName: "vanilla-js",
    },
    bundle: {
      bundlephobiaName: "vanilla-js",
    },
    website: "http://vanilla-js.com",
    docs: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    category: "library",
    type: "spa",
  },

  vanjs: {
    id: "vanjs",
    name: "Van.js",
    github: {
      owner: "vanjs-org",
      repo: "van",
      fullName: "vanjs-org/van",
    },
    npm: {
      packageName: "vanjs-core",
    },
    bundle: {
      bundlephobiaName: "vanjs-core",
    },
    website: "https://vanjs.org",
    docs: "https://vanjs.org/tutorial",
    category: "library",
    type: "spa",
  },
};

// Helper functions
export function getFrameworkMeta(id: string): FrameworkMetadata | null {
  return FRAMEWORK_METADATA[id] || null;
}

export function getAllFrameworkIds(): string[] {
  return Object.keys(FRAMEWORK_METADATA);
}

export function getFrameworksByCategory(
  category: FrameworkMetadata["category"],
): FrameworkMetadata[] {
  return Object.values(FRAMEWORK_METADATA).filter(
    (framework) => framework.category === category,
  );
}

export function getFrameworksByType(
  type: FrameworkMetadata["type"],
): FrameworkMetadata[] {
  return Object.values(FRAMEWORK_METADATA).filter(
    (framework) => framework.type === type,
  );
}
