import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom';

import * as Utils from 'constants/functions/utils';
import type { Dimensions, Draggable } from 'constants/types';

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
  selectedName: string[],
  draggable: Draggable,
  fontDataUri: string,
): string {
  const xmlns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

  // Add metadata.
  const title = document.createElementNS(xmlns, 'title');
  title.textContent = Utils.substituteName(
    fileNameTemplate,
    // TODO: Only join with space is delimited with space.
    selectedName.join(' '),
  );
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

  // Add name-specific text.
  const text = document.createElementNS(xmlns, 'text');
  text.setAttribute('dominant-baseline', 'text-before-edge');
  text.setAttribute('x', String(draggable.position.left));
  text.setAttribute('y', String(draggable.position.top));
  selectedName.forEach((fragment, index) => {
    const tspan = document.createElementNS(xmlns, 'tspan');
    tspan.setAttribute('dominant-baseline', 'text-before-edge');
    tspan.setAttribute('x', String(draggable.position.left));
    tspan.setAttribute(
      'dy',
      String(index > 0 ? draggable.style.lineHeight : 0),
    );

    tspan.setAttribute('filter', 'url(#crispify)');
    tspan.setAttribute('fill', draggable.style.color);
    tspan.setAttribute('font-size', `${draggable.style.fontSize}px`);
    tspan.setAttribute(
      'font-style',
      draggable.style.fontStyle.includes('italic') ? 'italic' : 'normal',
    );
    tspan.setAttribute(
      'font-weight',
      Utils.getFontWeight(draggable.style.fontStyle),
    );
    tspan.setAttribute('letter-spacing', `${draggable.style.letterSpacing}px`);
    tspan.setAttribute('style', `font-family:${draggable.style.fontFamily};`);
    tspan.textContent = fragment;
    text.appendChild(tspan);
  });

  svg.appendChild(text);

  const xml = xmlSerializer.serializeToString(svg);
  return xml;
}
