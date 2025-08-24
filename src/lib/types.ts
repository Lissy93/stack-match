import type { Attribute } from "./constants";

export type { Attribute };

export interface Framework {
  name: string;
  performance: number;
  maintainability: number;
  bundleSize: number;
  buildTimes: number;
  ecosystem: number;
  scalability: number;
  learningCurve: number;
  tooling: number;
  stability: number;
  viability: number;
}

export type Weights = Record<Attribute, number>;

export interface FrameworkMeta {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  branding: {
    iconName: string;
    fallbackEmoji: string;
    color: string;
    logo?: string;
  };
  links: {
    website?: string;
    docs?: string;
    github?: string;
    npmPackage?: string;
    video?: string;
  };
  example?: {
    title?: string;
    description?: string;
    repo?: string;
    website?: string;
    logo?: string;
  };
}

export interface FrameworkData {
  frameworks: Framework[];
  meta: FrameworkMeta[];
}

export interface FrameworkScore extends Framework {
  score: number;
  meta: FrameworkMeta;
}

export interface FrameworkStats {
  id: string;
  name: string;
  repo: string;
  stars: number;
  downloads: number;
  size_mb: number;
  license: string;
  language: string;
  contributors: number;
  top_author_pct: number;
  top_author_name: string;
  first_commit: string;
  last_commit: string;
  forks: number;
  subscribers: number;
  open_issues: number;
  closed_issues: number;
  open_prs: number;
  closed_prs: number;
  release_count: number | null;
  npm_latest: string;
  npm_latest_date: string;
}

export interface FrameworkCommentary {
  id: string;
  name: string;
  about: string;
}
