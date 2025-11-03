import type { PageLoad } from './$types';
import type { FrameworkMeta } from '$lib/types';
import rawData from '../../data.json';

export const load: PageLoad = async () => {
  const frameworks: FrameworkMeta[] = rawData.meta;
  const frameworkScores = rawData.frameworks;

  return {
    frameworks,
    frameworkScores
  };
};
