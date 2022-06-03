import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom';

import * as Utils from 'constants/functions/utils';
import type { RequestBody } from 'constants/types';

const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument(
  'http://www.w3.org/1999/xhtml',
  'html',
  null,
);

export function create(
  { backgroundImageSrc, dimensions, selectedName, textStyle }: RequestBody,
  fontDataUri: string,
): string {
  const xmlns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

  const defs = document.createElementNS(xmlns, 'defs');
  const style = document.createElementNS(xmlns, 'style');
  style.textContent = `@import url(${fontDataUri});`;
  defs.appendChild(style);

  const image = document.createElementNS(xmlns, 'image');
  image.setAttribute('href', backgroundImageSrc);
  image.setAttribute('x', '0');
  image.setAttribute('y', '0');
  image.setAttribute('width', '100%');
  image.setAttribute('height', '100%');

  const text = document.createElementNS(xmlns, 'text');
  text.setAttribute('x', String(textStyle.left));
  text.setAttribute('y', String(textStyle.top));
  text.setAttribute('dominant-baseline', 'text-before-edge');
  text.setAttribute('fill', textStyle.color);
  text.setAttribute('font-size', `${textStyle.fontSize}px`);
  text.setAttribute(
    'font-style',
    textStyle.fontStyle.includes('italic') ? 'italic' : 'normal',
  );
  text.setAttribute('font-weight', Utils.getFontWeight(textStyle.fontStyle));
  text.setAttribute('letter-spacing', `${textStyle.letterSpacing}px`);
  text.setAttribute('style', `font-family:${textStyle.fontFamily};`);
  text.textContent = selectedName;

  svg.appendChild(defs);
  svg.appendChild(image);
  svg.appendChild(text);

  const xml = xmlSerializer.serializeToString(svg);
  return xml;
}
