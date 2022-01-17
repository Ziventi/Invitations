import { CLI } from '@ziventi/utils';

import { Generator } from './settings';

(async () => {
  await CLI({
    generate: Generator.execute,
  });
})();
