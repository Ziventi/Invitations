import { darken } from 'polished';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';

import { COLOR } from './Constants';

export const Button = styled.button<ButtonProps>`
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
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  height: 100%;
  justify-content: space-between;
  max-width: ${(props) => props.maxWidth || 1200}px;
  width: 100%;
`;

export const Navigation = styled.nav`
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
      user-select: none;
    }

    li:hover {
      text-decoration: underline;
    }

    a {
      color: ${COLOR.WHITE};
      cursor: pointer;
      text-decoration: none;
    }
  }
`;

export const Input = css`
  border-radius: 10px;
  border-style: none;
  max-width: 100%;
  outline-color: ${COLOR.PRIMARY_2_NEUTRAL};
`;

export const Logo = styled.svg`
  cursor: pointer;
`;

export const LogoPath = styled.path`
  ${({ fill, strokeWidth }) => css`
    fill: ${fill};
    stroke: ${fill};
    stroke-width: ${strokeWidth};
  `}
  fill-rule: 'evenodd';
  stroke-linejoin: 'round';
`;

interface ButtonProps {
  bgColor: string;
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}
