import * as path from 'path';

import { ConfirmStatus } from '../types';

export namespace Paths {
  export const PROJECT_ROOT = path.resolve(__dirname, '../../../..');
  export const KEY_JSON = `${PROJECT_ROOT}/utils/key.json`;
  export const LIB_DIR = `${PROJECT_ROOT}/lib`;
}

export namespace Emojis {
  export const CONFIRMED = '\u2714';
  export const TENTATIVE = '\uD83D\uDD38';
  export const AWAITING = '\uD83D\uDD57';
  export const UNAVAILABLE = '\u274C';

  export function getStatusText(status: ConfirmStatus): string {
    let text;
    switch (status) {
      case 'Confirmed':
        text = `${CONFIRMED}  Confirmed`;
        break;
      case 'Tentative':
        text = `${TENTATIVE} Tentative`;
        break;
      case 'Unavailable':
        text = `${UNAVAILABLE} Unavailable`;
        break;
      case 'Awaiting':
      default:
        text = `${AWAITING} Awaiting response`;
        break;
    }

    return text;
  }
}
