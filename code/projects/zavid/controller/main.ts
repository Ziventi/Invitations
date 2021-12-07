import { CLI } from '@ziventi/utils';

import generate from './commands/generate';
import update from './commands/update';

(async () => {
  CLI({ generate, publish: update });
})();
