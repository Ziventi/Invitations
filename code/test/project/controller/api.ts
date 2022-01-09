import Ziventi from '@ziventi/utils';

import { Generator } from './settings';

export async function generate(
  options: Ziventi.GenerateOptions
): Promise<void> {
  await Generator.execute(options);
}
