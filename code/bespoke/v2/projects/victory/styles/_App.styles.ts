import { transparentize } from 'polished';
import type { DefaultTheme } from 'styled-components';
import styled, { createGlobalStyle, css } from 'styled-components';

import flowers from '../assets/flower.svg';
import pattern from '../assets/pattern.jpg';

export const theme: DefaultTheme = {
  primary: '#fffce1',
  primaryLight: '#fefdf4',
  primaryDark: '#fffcdd',
  secondary: '#16074c',
  border1: '#8c3fab',
  border2: '#5c0f7a',
  borderWidth: '5px',
  textColor: '#16074c',
  linkColor: '#260f8f',
  eventTitleTextColor: '#16074c',
  addressFontWeight: 'bold',
};

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: 'Exo 2', sans-serif;
  }

  html, body {
    background-color: beige;
    margin: 0 !important;
    padding: 0;
  }

  a {
    color: #fff;
  }

  div#root {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
`;

export const Page = styled.section<{ inverse: boolean }>`
  align-items: center;
  background-image: ${({ theme, inverse }) => css`linear-gradient(
    to ${inverse ? 'top' : 'bottom'},
    ${transparentize(0.1, theme.primaryLight)},
    ${transparentize(0.12, theme.primaryDark)}
  );`};
  display: flex;
  height: 297mm;
  justify-content: center;
  overflow: hidden;
  padding: 3em;
  position: relative;
  width: 210mm;
`;

export const Background = styled.main`
  background-image: url(${pattern});
  background-repeat: repeat;
  background-size: 800px;
  height: 100%;
  opacity: 0.065;
  position: absolute;
  width: 100%;
`;

export const Container = styled.div<{ inverse: boolean }>`
  border-image-slice: 1;
  border-image-source: ${({ theme, inverse }) => css`linear-gradient(
    to ${inverse ? 'left bottom' : 'right top'},
    ${theme.border1} 0%,
    ${theme.border1} 45%,
    transparent 45%,
    transparent 55%,
    ${theme.border2} 55%,
    ${theme.border2} 100%
  );`};
  border-style: solid;
  border-width: ${({ theme }) => theme.borderWidth};
  display: flex;
  height: 100%;
  justify-content: center;
  min-width: 100%;
  padding: 3em;
  position: relative;
`;

export const Content = styled.main<{ rowGap?: number }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  max-width: 500px;
  row-gap: 5em;
  text-align: left;
  width: 100%;

  ${({ rowGap }) =>
    rowGap &&
    css`
      row-gap: ${rowGap}em;
    `}
`;

export const Flower = styled.img.attrs({
  src: flowers,
})<{ position: 'top' | 'bottom'; small: boolean }>`
  position: absolute;
  width: ${({ small }) => (small ? '180px' : '240px')};
  filter: saturate(1.2) brightness(72%) contrast(2);
  ${(props) =>
    props.position === 'top'
      ? css`
          left: 0;
          margin-left: -3.5em;
          margin-top: -1em;
          top: 0;
          transform: rotate(110deg);
        `
      : css`
          bottom: 0;
          margin-bottom: -1em;
          margin-right: -3.5em;
          right: 0;
          transform: rotate(-70deg);
        `}
`;

export const Heading = styled.h1`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-family: 'Beau Rivage', cursive;
  letter-spacing: 3px;
  line-height: 100%;
  margin: 0;
  text-align: center;
`;

export const Text = styled.p`
  font-size: 25px;
  letter-spacing: -1px;
  line-height: 145%;
  margin: 0;
`;

export const SmallText = styled.small`
  font-size: 22px;
  letter-spacing: -1px;
  line-height: 125%;
  margin: 0;
`;

export const Block = styled.div<{ rowGap?: number }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 100%;

  ${({ rowGap }) =>
    rowGap &&
    css`
      row-gap: ${rowGap}em;
    `}
`;

export const Hyperlink = styled.a`
  color: ${({ theme }) => theme.linkColor};
  font-weight: 600;
  width: 100%;
`;
