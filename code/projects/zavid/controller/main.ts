import { CLI } from '@ziventi/utils';

import generate from './commands/generate';
import publish from './commands/publish';

(async () => {
  CLI({ generate, publish });
})();
