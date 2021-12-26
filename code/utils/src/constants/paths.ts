import path from 'path';

export namespace Paths {
  export const PROJECT_ROOT = path.resolve(__dirname, '../../../..');
  export const CACHE_DIR = `${PROJECT_ROOT}/.cache`;
  export const KEY_JSON = `${PROJECT_ROOT}/utils/key.json`;
}
