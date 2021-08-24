import path from 'path';

export const ROOT = path.resolve(__dirname, '../..');

const ASSETS_DIR = `${ROOT}/assets`;
const CACHE_DIR = `${ROOT}/.cache`;
const VIEWS_DIR = `${ROOT}/views`;

export const OUTPUT_DIR = `${ROOT}/out`;
export const TEMPLATES_DIR = `${VIEWS_DIR}/templates`;

export const CACHED_DATA = `${CACHE_DIR}/data.json`;
export const STYLES_FILE = `${VIEWS_DIR}/styles/css/main.css`;
export const TEMPLATE_FILE = `${TEMPLATES_DIR}/index.ejs`;
export const RULES_JSON = `${VIEWS_DIR}/data/rules.json`;

export const SIGNATURE_IMG = `${ASSETS_DIR}/signature.svg`;
export const WAVES_SVG = `${ASSETS_DIR}/waves.svg`;

export const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Tangerine:wght@700&display=swap';
