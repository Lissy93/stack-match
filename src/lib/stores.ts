import { writable, derived } from "svelte/store";
import { PRESETS } from "./constants";
import { computeScore, getFrameworkMeta, isFuzzyMatch } from "./utils";
import type {
  Weights,
  FrameworkData,
  FrameworkScore,
  FrameworkStats,
  FrameworkCommentary,
} from "./types";

// Core application state
export const weights = writable<Weights>(PRESETS.balanced);
export const searchQuery = writable<string>("");
export const shortlist = writable<string[]>([]);
export const frameworkData = writable<FrameworkData | null>(null);

// External data
export const frameworkStats = writable<FrameworkStats[]>([]);
export const frameworkCommentary = writable<FrameworkCommentary[]>([]);

// Expanded cards state
export const expandedCards = writable<Set<string>>(new Set());

// Derived stores
export const sortedFrameworks = derived(
  [frameworkData, weights, searchQuery],
  ([$frameworkData, $weights, $searchQuery]) => {
    if (!$frameworkData) return [];

    return $frameworkData.frameworks
      .map((framework) => ({
        ...framework,
        score: computeScore(framework, $weights),
        meta: getFrameworkMeta(framework.name, $frameworkData.meta),
      }))
      .filter((framework) => isFuzzyMatch(framework.name, $searchQuery))
      .sort((a, b) => b.score - a.score);
  },
);

// Get stats for a specific framework
export function getFrameworkStats(
  frameworkName: string,
  statsArray: FrameworkStats[],
): FrameworkStats | null {
  return statsArray.find((stats) => stats.id === frameworkName) || null;
}

// Get commentary for a specific framework
export function getFrameworkCommentary(
  frameworkName: string,
  commentaryArray: FrameworkCommentary[],
): FrameworkCommentary | null {
  return (
    commentaryArray.find((commentary) => commentary.id === frameworkName) ||
    null
  );
}
