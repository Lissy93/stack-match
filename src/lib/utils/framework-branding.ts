// Framework branding utilities for colors and icons

export interface FrameworkBranding {
  color: string;
  iconSlug: string;
}

// Map framework IDs to Simple Icons slugs and brand colors
export const FRAMEWORK_BRANDING: Record<string, FrameworkBranding> = {
  react: { color: '#61DAFB', iconSlug: 'react' },
  angular: { color: '#DD0031', iconSlug: 'angular' },
  vue: { color: '#4FC08D', iconSlug: 'vuedotjs' },
  svelte: { color: '#FF3E00', iconSlug: 'svelte' },
  'next-js': { color: '#000000', iconSlug: 'nextdotjs' },
  'nuxt-js': { color: '#00DC82', iconSlug: 'nuxtdotjs' },
  astro: { color: '#FF5D01', iconSlug: 'astro' },
  solid: { color: '#2C4F7C', iconSlug: 'solid' },
  qwik: { color: '#AC7EF4', iconSlug: 'qwik' },
  lit: { color: '#324FFF', iconSlug: 'lit' },
  alpine: { color: '#8BC0D0', iconSlug: 'alpinedotjs' },
  preact: { color: '#673AB8', iconSlug: 'preact' },
  remix: { color: '#000000', iconSlug: 'remix' },
  gatsby: { color: '#663399', iconSlug: 'gatsby' },
  ember: { color: '#E04E39', iconSlug: 'emberdotjs' },
  backbone: { color: '#0071B5', iconSlug: 'backbone.js' },
  stimulus: { color: '#77E8B9', iconSlug: 'hotwire' },
  fresh: { color: '#FFDB1E', iconSlug: 'fresh' },
  jquery: { color: '#0769AD', iconSlug: 'jquery' },
  marko: { color: '#4A90E2', iconSlug: 'marko' },
  nue: { color: '#000000', iconSlug: 'nuedotjs' },
  vanjs: { color: '#F44336', iconSlug: 'vitess' },
  vanilla: { color: '#F7DF1E', iconSlug: 'javascript' },
};

export function getFrameworkBranding(frameworkId: string): FrameworkBranding {
  return FRAMEWORK_BRANDING[frameworkId] || { color: '#3b82f6', iconSlug: frameworkId };
}

export function getSimpleIconUrl(frameworkId: string, color?: string): string {
  const branding = getFrameworkBranding(frameworkId);
  const iconSlug = branding.iconSlug;
  const iconColor = (color || branding.color).replace('#', '');
  return `https://cdn.simpleicons.org/${iconSlug}/${iconColor}`;
}

export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white or black for contrast
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function addAlpha(hexColor: string, alpha: number): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
