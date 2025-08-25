import { ATTRIBUTES, SCORE_COLORS, API_ENDPOINTS } from './constants';
import type { Framework, FrameworkScore, FrameworkMeta, Weights, FrameworkStats, FrameworkCommentary } from './types';

// Compute weighted score for a framework
export function computeScore(framework: Framework, weights: Weights): number {
  let score = 0;
  let totalWeight = 0;
  
  ATTRIBUTES.forEach(attr => {
    if (weights[attr] > 0) {
      score += framework[attr] * weights[attr];
      totalWeight += 10 * weights[attr];
    }
  });
  
  return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
}

// Get color based on score
export function getScoreColor(score: number): string {
  if (score >= 8) return SCORE_COLORS.high;
  if (score >= 5) return SCORE_COLORS.medium;
  return SCORE_COLORS.low;
}

// Capitalize attribute names for display
export function capitalize(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

// Get framework metadata with fallback
export function getFrameworkMeta(name: string, metaList: FrameworkMeta[]): FrameworkMeta {
  const meta = metaList.find(m => m.id === name || m.id === name.replace('-js', ''));
  
  if (!meta) {
    return {
      id: name,
      name: capitalize(name),
      description: 'Framework information not available',
      branding: {
        iconName: 'javascript',
        fallbackEmoji: '📦',
        color: '#666666'
      },
      links: {}
    };
  }
  
  return meta;
}

// Get best attributes for a framework
export function getBestAttributes(framework: Framework, count = 3): Array<{attr: string, score: number}> {
  return ATTRIBUTES
    .map(attr => ({ attr: capitalize(attr), score: framework[attr] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// Get worst attributes for a framework  
export function getWorstAttributes(framework: Framework, count = 3): Array<{attr: string, score: number}> {
  return ATTRIBUTES
    .map(attr => ({ attr: capitalize(attr), score: framework[attr] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

// Fuzzy search match
export function isFuzzyMatch(name: string, query: string): boolean {
  if (!query) return true;
  
  name = name.toLowerCase();
  query = query.toLowerCase();
  
  let i = 0;
  for (const char of query) {
    i = name.indexOf(char, i);
    if (i === -1) return false;
    i++;
  }
  
  return true;
}

// Get icon URL with fallback
export function getIconUrl(meta: FrameworkMeta): string {
  const { iconName, color } = meta.branding;
  const cleanColor = color.replace('#', '');
  return `${API_ENDPOINTS.simpleIconsBase}/${iconName}/${cleanColor}`;
}

// Format large numbers  
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Fetch framework stats with error handling
export async function fetchFrameworkStats(): Promise<FrameworkStats[]> {
  try {
    const response = await fetch(API_ENDPOINTS.frameworkStats);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid data structure');
    }
    
    return data.items;
  } catch (error) {
    console.warn('Failed to fetch framework stats:', error);
    return [];
  }
}

// Fetch framework commentary with error handling
export async function fetchFrameworkCommentary(): Promise<FrameworkCommentary[]> {
  try {
    const response = await fetch(API_ENDPOINTS.frameworkCommentary);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid data structure');
    }
    
    return data.items;
  } catch (error) {
    console.warn('Failed to fetch framework commentary:', error);
    return [];
  }
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}