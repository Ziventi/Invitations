import path from 'path';

const ASSETS_DIR = path.resolve(__dirname, '../assets');
const CACHE_DIR = path.resolve(__dirname, '../.cache');

export const VIEWS_DIR = path.resolve(__dirname, '../views');

export const CACHED_DATA = `${CACHE_DIR}/data.json`;
export const STYLES_FILE = `${VIEWS_DIR}/styles.css`;
export const TEMPLATE_FILE = `${VIEWS_DIR}/template.ejs`;

export const SIGNATURE_IMG = `${ASSETS_DIR}/signature.svg`;
export const WAVES_SVG = `${ASSETS_DIR}/waves.svg`;

export const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Tangerine:wght@700&display=swap';