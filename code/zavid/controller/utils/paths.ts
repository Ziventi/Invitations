import path from 'path';

export const ROOT = path.resolve(__dirname, '../..');
const CACHE_DIR = `${ROOT}/.cache`;

export const VIEWS_DIR = `${ROOT}/views`;

export const OUTPUT_DIR = `${ROOT}/.out`;
export const IMAGES_DIR = `${VIEWS_DIR}/images`;
export const RESOURCES_DIR = `${VIEWS_DIR}/resources`;
export const STYLES_DIR = `${VIEWS_DIR}/styles`;
export const TEMPLATES_DIR = `${VIEWS_DIR}/templates`;

export const CACHED_DATA = `${CACHE_DIR}/data.json`;
export const KEY_JSON = `${ROOT}/key.json`;
export const STYLES_INPUT_FILE = `${STYLES_DIR}/App.scss`;
export const STYLES_OUTPUT_FILE = `${OUTPUT_DIR}/css/main.css`;
export const TEMPLATE_FILE = `${TEMPLATES_DIR}/index.ejs`;

export const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Courgette&family=Great+Vibes&family=Style+Script&family=Tangerine:wght@400;700&family=Poppins:wght@400;700&display=swap';
