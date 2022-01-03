import * as path from 'path';

export namespace Paths {
  export const PROJECT_ROOT = path.resolve(__dirname, '../../../..');
  export const KEY_JSON = `${PROJECT_ROOT}/utils/key.json`;
  export const LIB_DIR = `${PROJECT_ROOT}/lib`;
}
