import styled from 'styled-components';

import { COLOR } from 'styles/Constants.styles';
import * as Mixin from 'styles/Mixins.styles';

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
    cursor: move;
    text-align: center;
    user-select: none;
  `,
  Border: styled.rect<{ visible: boolean }>`
    ${({ visible }) => Mixin.Visible(visible)}
    transition: opacity 0.2s, z-index 0.2s;
  `,
  ResizeHandle: styled.circle<{
    visible: boolean;
  }>`
    ${({ visible }) => Mixin.Visible(visible)}
    cursor: ew-resize;
    fill: #00a6ff;
    transition: opacity 0.2s, z-index 0.2s;
  `,
};
