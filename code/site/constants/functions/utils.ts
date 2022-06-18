import type { FontVariantKey } from 'constants/types';
import { DEFAULT_FILENAME_TEMPLATE } from 'constants/variables';

/**
 * Substitutes a specified name in the filename template.
 * @param fileNameTemplate A specified template. Could be an empty string.
 * @param selectedName The specified name.
 * @returns The filename.
 */
export function substituteName(
  fileNameTemplate: string,
  selectedName: string,
): string {
  const template = fileNameTemplate || DEFAULT_FILENAME_TEMPLATE;
  return template.replace('[name]', selectedName);
}

/**
 * Returns a value, the lower bound if beneath minimum or upper bound if beyond
 * maximum.
 * @param value The value.
 * @param min The lower bound.
 * @param max The upper bound.
 * @returns The resulting value.
 */
export function minmax(value: number, min: number, max: number): number {
  return Math.min(Math.max(min, value), max);
}

/**
 * Extracts the font weight from a font variant key.
 * @param fontVariantKey The font variant key,
 * @returns The font weight.
 */
export function getFontWeight(fontVariantKey: FontVariantKey): string {
  return fontVariantKey.match(/\d{3}/)?.shift() || '400';
}

export function nameListFromText(names: string): string[] {
  return names.split('\n').filter((name) => name.trim());
}

export function textFromNameList(nameList: string[]): string {
  return nameList.join('\n');
}

/**
 * Splits a string into fragments based on wrapping.
 * @param dummyTextElement The dummy text element.
 * @param text The text to transform.
 * @param maxWidth The maximum width of a line before wrapping text.
 * @returns The text fragments.
 */
export function splitTextIntoWrapFragments(
  dummyTextElement: SVGTextElement,
  text: string,
  maxWidth: number,
): string[] {
  const fragments: string[] = [];
  let line = '';
  text
    .split(/(\w+\-?)/)
    .filter((e) => e.trim())
    .forEach((word, k) => {
      if (line.endsWith('- ')) {
        line = line.slice(0, -1);
      }
      const currentLine = line + word + ' ';
      dummyTextElement.textContent = currentLine;
      const currentTextWidth = dummyTextElement.getBBox().width;

      if (currentTextWidth > maxWidth && k > 0) {
        fragments.push(line.trim());
        line = word + ' ';
      } else {
        line = currentLine;
      }
    });

  fragments.push(line.trim());
  return fragments;
}
