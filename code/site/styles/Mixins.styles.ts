import { darken } from 'polished';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

/**
 * Ensures that a component is scrollable.
 * @param baseColor The base color of the scrollbar.
 * @returns The CSS.
 */
export function Scrollable(
  baseColor: string,
  options?: ScrollableOptions,
): FlattenSimpleInterpolation {
  return css`
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 9px;
    }

    &::-webkit-scrollbar-track {
      background-color: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: none;
      cursor: pointer;
    }

    &:hover::-webkit-scrollbar-thumb {
      background-color: ${options?.exactColor
        ? baseColor
        : darken(0.08, baseColor)};
      border-radius: ${options?.borderRadius || '2px'};
      transition: background-color 0.3s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: ${darken(0.12, baseColor)};
    }
  `;
}

/**
 * Allows toggling of a component's visibility.
 * @param visible True if visible, false if not.
 * @returns The CSS.
 */
export function Visible(
  visible = true,
  options?: VisibleOptions,
): FlattenSimpleInterpolation {
  return visible
    ? css`
        opacity: 1;
        pointer-events: auto;
        z-index: ${options?.zIndex || 1};
      `
    : css`
        opacity: 0;
        pointer-events: none;
        z-index: -1;
      `;
}

interface ScrollableOptions {
  borderRadius?: string;
  exactColor?: boolean;
}

interface VisibleOptions {
  zIndex?: number;
}
