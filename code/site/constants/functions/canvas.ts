import type { Canvas, Image } from 'canvas';

import { TextStyle } from '../types';
import { DRAGGABLE_PADDING } from '../variables';

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
    lineHeight,
    left,
    top,
    height,
    width,
    scale,
    scaleX,
    scaleY,
  } = style;
  const padding = DRAGGABLE_PADDING / 3;
  const maxWidth = (width - padding * 2) * scale;
  const numOfLines = height / lineHeight;
  const x = (left + (width + padding) / 2) * scaleX;
  const y = (top + height / numOfLines + 1) * scaleY;

  const ctx = canvas.getContext('2d') as Context2D;
  if (image) {
    ctx.drawImage(image, 0, 0);
  }
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  insertText(ctx, text, x, y, lineHeight * scale, maxWidth);
}

export function clearCanvas(canvas: HTMLCanvasElement | Canvas): void {
  const ctx = canvas.getContext('2d') as Context2D;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function insertText(
  ctx: Context2D,
  text: string,
  x: number,
  y: number,
  lineHeight: number,
  maxWidth: number,
): void {
  let line = '';

  const words = text.split(' ');
  words.forEach((word, k) => {
    const currentLine = line + word + ' ';
    const currentTextWidth = ctx.measureText(currentLine).width;

    if (currentTextWidth > maxWidth && k > 0) {
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = currentLine;
    }
  });

  ctx.fillText(line, x, y);
}

type Context2D = ReturnType<Canvas['getContext']>;
