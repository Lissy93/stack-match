import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import * as sass from 'sass-embedded'; 

// Import all possible adapters
import autoAdapter from "@sveltejs/adapter-auto";
import vercelAdapter from "@sveltejs/adapter-vercel";

// Conditional adapter selection based on environment
function getAdapter() {
  // Check for Vercel environment or explicit VERCEL env var
  if (process.env.VERCEL || process.env.ADAPTER === "vercel") {
    console.log("🔧 Using Vercel adapter with Node.js 20 runtime");
    return vercelAdapter({
      runtime: "nodejs22.x",
    });
  }

  // Check for Netlify environment or explicit NETLIFY env var
  if (process.env.NETLIFY || process.env.ADAPTER === "netlify") {
    console.log("🔧 Using Netlify adapter (auto-detected)");
    console.warn("Netlify adapter not installed, using auto adapter");
    return autoAdapter();
  }

  // Check for static build
  if (process.env.ADAPTER === "static") {
    console.log("🔧 Using static adapter (manual override)");
    console.warn("Static adapter not installed, using auto adapter");
    return autoAdapter();
  }

  // Default to auto adapter for other environments
  console.log("🔧 Using auto adapter (default)");
  return autoAdapter();
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [ 
    vitePreprocess(),
  ],

  kit: {
    // Use conditional adapter selection
    adapter: getAdapter(),
  },
};

export default config;
