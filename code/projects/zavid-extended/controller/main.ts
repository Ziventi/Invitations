import { CLI } from '@ziventi/utils';

import generate from './commands/generate';

(async () => {
  CLI({ generate });
})();
