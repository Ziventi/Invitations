import { darken } from 'polished';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { css } from 'styled-components';

export const Scrollable = (color: string): FlattenSimpleInterpolation => {
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
      background-color: ${darken(0.08, color)};
      border-radius: 2px;
      transition: background-color 0.3s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: ${darken(0.12, color)};
    }
  `;
};
