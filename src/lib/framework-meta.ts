// Framework metadata loaded from data.json
// This file transforms the static data into the structure needed by the API

import rawData from '../data.json';

export interface FrameworkMetadata {
  id: string;
  name: string;
  github: {
    owner: string;
    repo: string;
    fullName: string;
  };
  npm: {
    packageName: string;
    alternativePackages?: string[];
  };
  bundle: {
    bundlephobiaName?: string;
    alternatives?: string[];
  };
  website?: string;
  docs?: string;
  category: "framework" | "library" | "meta-framework" | "build-tool";
  type: "spa" | "ssr" | "ssg" | "hybrid" | "build-tool";
  ecosystem?: {
    corePackages?: string[];
    devTools?: string[];
    plugins?: string[];
  };
  openCollective?: string;
}

// Transform data.json meta array into FRAMEWORK_METADATA record
export const FRAMEWORK_METADATA: Record<string, FrameworkMetadata> = Object.fromEntries(
  rawData.meta.map((meta: any) => {
    // Extract GitHub owner and repo from GitHub URL
    const githubMatch = meta.links?.github?.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    const owner = githubMatch?.[1] || '';
    const repo = githubMatch?.[2] || '';

    const frameworkMeta: FrameworkMetadata = {
      id: meta.id,
      name: meta.name,
      github: {
        owner,
        repo,
        fullName: `${owner}/${repo}`,
      },
      npm: {
        packageName: meta.links?.npmPackage || '',
      },
      bundle: {
        bundlephobiaName: meta.links?.npmPackage || '',
      },
      website: meta.links?.website,
      docs: meta.links?.docs,
      category: meta.category || "library",
      type: meta.type || "spa",
      openCollective: meta.openCollective,
    };

    return [meta.id, frameworkMeta];
  })
);

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
