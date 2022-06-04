import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom';

import * as Utils from 'constants/functions/utils';
import type { Dimensions, TextStyle } from 'constants/types';

const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument(
  'http://www.w3.org/1999/xhtml',
  'html',
  null,
);

export function create(
  backgroundImageSrc: string,
  dimensions: Dimensions,
  fileNameTemplate: string,
  selectedName: string,
  textStyle: TextStyle,
  fontDataUri: string,
): string {
  const xmlns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

  // Add metadata.
  const title = document.createElementNS(xmlns, 'title');
  title.textContent = Utils.substituteName(fileNameTemplate, selectedName);
  svg.appendChild(title);
  const desc = document.createElementNS(xmlns, 'desc');
  desc.textContent = 'Created by Ziventi';
  svg.appendChild(desc);

  const defs = document.createElementNS(xmlns, 'defs');

  // Add Google Web Font url and ensure no margins.
  const style = document.createElementNS(xmlns, 'style');
  style.textContent = `@import url(${fontDataUri}); html, body { margin: 0 !important; }`;
  defs.appendChild(style);

  // Use filter to ensure crispiness.
  const filter = document.createElementNS(xmlns, 'filter');
  filter.setAttribute('id', 'crispify');
  const feComponentTransfer = document.createElementNS(
    xmlns,
    'feComponentTransfer',
  );
  const feFuncA = document.createElementNS('xmlns', 'feFuncA');
  feFuncA.setAttribute('type', 'discrete');
  feFuncA.setAttribute('tableValues', '0 1');
  feComponentTransfer.appendChild(feFuncA);
  filter.appendChild(feComponentTransfer);
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Add background image.
  const image = document.createElementNS(xmlns, 'image');
  image.setAttribute('href', backgroundImageSrc);
  image.setAttribute('x', '0');
  image.setAttribute('y', '0');
  image.setAttribute('width', '100%');
  image.setAttribute('height', '100%');
  svg.appendChild(image);

  // Add custom text.
  const text = document.createElementNS(xmlns, 'text');
  text.setAttribute('x', String(textStyle.left));
  text.setAttribute('y', String(textStyle.top));
  text.setAttribute('dominant-baseline', 'text-before-edge');
  text.setAttribute('filter', 'url(#crispify)');
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
  svg.appendChild(text);

  const xml = xmlSerializer.serializeToString(svg);
  return xml;
}
