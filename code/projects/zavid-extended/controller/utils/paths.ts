import path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '../..');

export const VIEWS_DIR = `${PROJECT_ROOT}/views`;
export const OUTPUT_DIR = `${PROJECT_ROOT}/.out`;

export const IMAGES_DIR = `${VIEWS_DIR}/images`;
export const RESOURCES_DIR = `${VIEWS_DIR}/resources`;
export const STYLES_DIR = `${VIEWS_DIR}/styles`;
export const TEMPLATES_DIR = `${VIEWS_DIR}/templates`;

export const STYLES_INPUT_FILE = `${STYLES_DIR}/App.scss`;
export const STYLES_OUTPUT_FILE = `${OUTPUT_DIR}/css/main.css`;

const url = new URL('https://fonts.googleapis.com/css2');
url.searchParams.append('family', 'Tangerine:wght@400;700');
url.searchParams.append('display', 'swap');
export const FONTS_URL = url.href;
