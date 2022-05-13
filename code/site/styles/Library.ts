import { darken } from 'polished';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

export const COLOR = {
  PRIMARY_1: '#ebd4cb',
  PRIMARY_1_LIGHT: '#f9f3f0',
  PRIMARY_1_DARK: '#e2c2b6',
  PRIMARY_2: '#da9f93',
  PRIMARY_2_LIGHT: '#e5bbb3',
  PRIMARY_2_DARK: '#d08576',
  PRIMARY_3: '#b6465f',
  PRIMARY_3_LIGHT: '#c66c80',
  PRIMARY_3_DARK: '#a23f54',
  PRIMARY_4: '#890620',
  PRIMARY_4_LIGHT: '#b00729',
  PRIMARY_4_DARK: '#620417',
  PRIMARY_5: '#2c0703',
  PRIMARY_5_LIGHT: '#5f1007',
  PRIMARY_5_DARK: '#130301',
  BLACK: '#000000',
  WHITE: '#ffffff',
  TRANSPARENT: 'rgba(0,0,0,0)',
  DEFAULT: '#cccccc',
};

export const FONT = {
  PRIMARY: "'Rubik', sans-serif",
};

export const Button = styled.button<ButtonProps>`
  border-radius: 10px;
  border-style: none;
  color: ${COLOR.WHITE};
  outline: none;
  cursor: pointer;
  font-size: 16px;
  min-width: 100px;
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
  outline-color: ${COLOR.PRIMARY_2};
`;

export function Scrollable(color: string): FlattenSimpleInterpolation {
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
}

interface ButtonProps {
  bgColor: string;
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}
