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
export const KEY_JSON = `${ROOT}/../../key.json`;
export const STYLES_INPUT_FILE = `${STYLES_DIR}/App.scss`;
export const STYLES_OUTPUT_FILE = `${OUTPUT_DIR}/css/main.css`;
export const IMAGES_OUTPUT_DIR = `${OUTPUT_DIR}/images`;
export const TEMPLATE_FILE = `${TEMPLATES_DIR}/index.ejs`;

const url = new URL('https://fonts.googleapis.com/css2');
url.searchParams.append('family', 'Tangerine:wght@400;700');
url.searchParams.append('family', 'Courgette:wght@400;700');
url.searchParams.append('family', 'Montserrat:wght@400;700');
url.searchParams.append('family', 'Playball');
url.searchParams.append('display', 'swap');
export const FONTS_URL = url.href;
