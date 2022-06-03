import styled, { css } from 'styled-components';

import type { ResizeHandlePosition } from 'constants/types';
import { COLOR } from 'styles/Constants.styles';

export default {
  Container: styled.section`
    align-items: center;
    background-color: ${COLOR.PRIMARY_5_DARKER};
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: relative;
    width: 100%;
  `,
  SVGCanvas: styled.svg`
    max-height: 100%;
    max-width: 100%;
  `,
  Text: styled.text<{ selected: boolean }>`
    border: 2px dashed
      ${({ selected }) => (selected ? COLOR.DEFAULT : 'transparent')};
    cursor: move;
    text-align: center;
    user-select: none;
  `,
  ResizeHandle: styled.circle<{
    position: ResizeHandlePosition;
    selected: boolean;
  }>`
    cursor: ew-resize;
    fill: #00a6ff;
    transition: opacity 0.2s ease, visibility 0.2s ease;

    ${({ position, selected }) => {
      const opacity = selected ? 1 : 0;
      const visibility = selected ? 'visible' : 'hidden';
      // const alignSelf = position === 'east' ? 'flex-end' : 'flex-start';
      return css`
        opacity: ${opacity};
        visibility: ${visibility};
      `;
    }}
  `,
};
