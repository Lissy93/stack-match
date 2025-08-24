// Framework evaluation attributes
export const ATTRIBUTES = [
  "performance",
  "maintainability",
  "bundleSize",
  "buildTimes",
  "ecosystem",
  "scalability",
  "learningCurve",
  "tooling",
  "stability",
  "viability",
] as const;

export type Attribute = (typeof ATTRIBUTES)[number];

// Attribute descriptions for tooltips
export const ATTR_DESCRIPTIONS: Record<Attribute, string> = {
  performance: "How efficiently the framework runs applications",
  maintainability: "Ease of maintaining and updating code over time",
  bundleSize: "Size of the compiled bundle",
  buildTimes: "Time taken to build the application",
  ecosystem: "Availability of libraries, tools, and community support",
  scalability: "Ability to handle growing complexity and team sizes",
  learningCurve: "Ease of learning the framework",
  tooling: "Quality and availability of development tools",
  stability: "Reliability and backward compatibility",
  viability: "Long-term support and future prospects",
};

// Preset weight configurations
export const PRESETS = {
  balanced: {
    performance: 5,
    maintainability: 5,
    bundleSize: 5,
    buildTimes: 5,
    ecosystem: 5,
    scalability: 5,
    learningCurve: 5,
    tooling: 5,
    stability: 5,
    viability: 5,
  },
  performance: {
    performance: 10,
    bundleSize: 8,
    buildTimes: 8,
    scalability: 10,
    maintainability: 5,
    ecosystem: 5,
    learningCurve: 5,
    tooling: 5,
    stability: 5,
    viability: 5,
  },
  enterprise: {
    ecosystem: 10,
    scalability: 10,
    stability: 10,
    viability: 10,
    tooling: 10,
    maintainability: 8,
    performance: 5,
    bundleSize: 5,
    buildTimes: 5,
    learningCurve: 5,
  },
  "tiny-bundle": {
    bundleSize: 10,
    buildTimes: 10,
    performance: 10,
    learningCurve: 8,
    maintainability: 5,
    ecosystem: 5,
    scalability: 5,
    tooling: 5,
    stability: 5,
    viability: 5,
  },
  ecosystem: {
    ecosystem: 10,
    tooling: 10,
    viability: 10,
    stability: 10,
    scalability: 8,
    maintainability: 5,
    performance: 5,
    bundleSize: 5,
    buildTimes: 5,
    learningCurve: 5,
  },
  "easy-learning": {
    learningCurve: 10,
    maintainability: 10,
    performance: 5,
    bundleSize: 5,
    buildTimes: 5,
    ecosystem: 5,
    scalability: 5,
    tooling: 5,
    stability: 5,
    viability: 5,
  },
  startup: {
    performance: 10,
    learningCurve: 10,
    bundleSize: 8,
    buildTimes: 8,
    viability: 8,
    maintainability: 6,
    ecosystem: 6,
    scalability: 6,
    tooling: 6,
    stability: 6,
  },
} as const;

export type PresetName = keyof typeof PRESETS;

// Color themes for score visualization
export const SCORE_COLORS = {
  high: "hsl(142, 76%, 36%)", // Green
  medium: "hsl(38, 92%, 50%)", // Orange
  low: "hsl(0, 84%, 60%)", // Red
} as const;

// API endpoints
export const API_ENDPOINTS = {
  frameworkStats:
    "https://raw.githubusercontent.com/Lissy93/framework-benchmarks/refs/heads/main/results/framework-stats.json",
  frameworkCommentary:
    "https://raw.githubusercontent.com/Lissy93/framework-benchmarks/refs/heads/main/website/static/framework-commentary.json",
  simpleIconsBase: "https://cdn.simpleicons.org",
} as const;
