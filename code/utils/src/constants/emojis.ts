import { ConfirmStatus } from '../../types';

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
