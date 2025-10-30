// Branding utility functions
// Framework data comes from data.json, these are pure utility functions

export function getSimpleIconUrl(iconSlug: string, color?: string): string {
  const iconColor = color ? color.replace('#', '') : '';
  return `https://cdn.simpleicons.org/${iconSlug}${iconColor ? `/${iconColor}` : ''}`;
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
