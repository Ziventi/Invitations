import { darken } from 'polished';
import styled, { css } from 'styled-components';

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
};

export const Button = styled.button<ButtonProps>`
  border-radius: 10px;
  border-style: none;
  color: ${COLOR.WHITE};
  cursor: pointer;
  font-size: 16px;
  min-width: 100px;
  outline: none;
  padding: 1em;
  transition: all 0.3s;

  ${(props) => css`
    background-color: ${props.bgColor};

    &:hover {
      background-color: ${darken(0.05, props.bgColor)};
    }

    &:active {
      background-color: ${darken(0.1, props.bgColor)};
    }
  `}
`;

export const Container = styled.div<ContainerProps>`
  display: flex;
  height: 100%;
  justify-content: space-between;
  max-width: ${props => props.maxWidth || 1200}px;
  width: 100%;
`;

interface ButtonProps {
  bgColor: string;
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}