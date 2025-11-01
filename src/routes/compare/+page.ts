import type { PageLoad } from './$types';
import type { FrameworkMeta } from '$lib/types';
import data from '../../data.json';

export const load: PageLoad = async () => {
  const frameworks: FrameworkMeta[] = data.meta;

  return {
    frameworks
  };
};
