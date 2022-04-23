import type { Canvas, Image } from 'canvas';

import { TextStyle } from './types';
import { DRAGGABLE_PADDING } from './variables';

export function drawOnCanvas(
  canvas: HTMLCanvasElement | Canvas,
  text: string,
  style: TextStyle,
  image?: Image,
): void {
  const {
    color,
    fontFamily,
    fontSize,
    left,
    lineHeight,
    top,
    height,
    width,
    scale,
    scaleX,
    scaleY,
  } = style;
  const padding = DRAGGABLE_PADDING / 3;
  const x = (left + (width + padding) / 2) * scaleX;
  const y = (top + height / 2) * scaleY;

  const ctx = canvas.getContext('2d') as Context2D;
  if (image) {
    ctx.drawImage(image, 0, 0);
  }
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  insertText(
    ctx,
    text,
    x,
    y,
    (width - DRAGGABLE_PADDING * 2) * scale,
    lineHeight * scale,
  );
}

function insertText(
  ctx: Context2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  let line = '';
  let textHeight = 0;

  const words = text.split(' ');
  words.forEach((word, k) => {
    const textLine = line + word + ' ';
    const textWidth = ctx.measureText(textLine).width;

    if (textWidth > maxWidth && k > 0) {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
      textHeight += lineHeight;
    } else {
      line = textLine;
    }
  });

  ctx.fillText(line, x, y);
  textHeight += lineHeight;
  return textHeight;
}

type Context2D = ReturnType<Canvas['getContext']>;
