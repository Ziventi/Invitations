import { darken } from 'polished';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';

import { COLOR } from './Constants';

export const Global = {
  Button: styled.button<ButtonProps>`
    border-radius: 10px;
    border-style: none;
    color: ${COLOR.WHITE};
    cursor: pointer;
    font-size: 16px;
    min-width: 100px;
    outline: none;
    padding: 1em;
    transition: all 0.3s ease;
    user-select: none;

    ${({ bgColor }) => css`
      background-color: ${bgColor};

      &:hover {
        background-color: ${darken(0.05, bgColor)};
      }

      &:active {
        background-color: ${darken(0.1, bgColor)};
      }
    `}
  `,
  Container: styled.div<ContainerProps>`
    display: flex;
    height: 100%;
    justify-content: space-between;
    max-width: ${(props) => props.maxWidth || 1200}px;
    width: 100%;
  `,
  Navigation: styled.nav`
    align-items: center;
    color: ${COLOR.WHITE};
    display: flex;
    flex: 1 1 auto;
    width: 100%;

    menu {
      display: flex;
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        padding: 0 2em;
      }

      a {
        color: ${COLOR.WHITE};
        cursor: pointer;
        text-decoration: none;
      }
    }
  `,
  Input: css`
    border-radius: 10px;
    border-style: none;
    max-width: 100%;
    outline-color: ${COLOR.PRIMARY_2};
  `,
  Logo: styled.svg`
    cursor: pointer;
  `,
  LogoPath: styled.path`
    ${({ fill, strokeWidth }) => css`
      fill: ${fill};
      stroke: ${fill};
      stroke-width: ${strokeWidth};
    `}
    fill-rule: 'evenodd';
    stroke-linejoin: 'round';
  `,
};

export const Mixin = {
  Scrollable: (color: string): FlattenSimpleInterpolation => {
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
  },
};

interface ButtonProps {
  bgColor: string;
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}
