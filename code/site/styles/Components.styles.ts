import { darken } from 'polished';
import type React from 'react';
import styled, { css } from 'styled-components';

import { COLOR } from './Constants.styles';

export const BackgroundVideo = styled.video`
  filter: blur(4px);
  height: 100%;
  min-width: 100%;
  object-fit: cover;
  position: fixed;
  z-index: -1;
`;

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
  max-width: ${(props) => props.maxWidth || 1200}px;
  width: 100%;
`;

export const Navigation = styled.nav`
  align-items: center;
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
  }
`;

export const Link = styled.a`
  color: ${COLOR.WHITE};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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
