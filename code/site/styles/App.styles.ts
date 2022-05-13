import styled, { createGlobalStyle, css } from 'styled-components';

import { COLOR, FONT, Navigation } from './Library';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    font-family: ${FONT.PRIMARY};
  }

  html,
  body {
    height: 100%;
    margin: 0;
    overscroll-behavior: none;
    padding: 0;
  }

  div#__next {
    height: 100%;
    position: relative;
  }
`;

export const Header = styled.header`
  background-color: ${COLOR.TRANSPARENT};
  display: flex;
  height: 70px;
  justify-content: center;
  margin-top: -70px;
  padding: 0.5em;
  position: sticky;
  top: 0;
  transition: all 0.2s;
  width: 100%;
  z-index: 2;
`;

export const HeaderNavigation = styled(Navigation)`
  justify-content: flex-end;
`;

export const Footer = styled.footer`
  background-color: ${COLOR.PRIMARY_4_DARK};
  display: flex;
  justify-content: center;
  padding: 1em;
  width: 100%;
  z-index: 1;
`;

export const SiteLogo = styled.svg`
  cursor: pointer;
  height: 250%;
  transition: all 0.3s;
`;

export const SiteLogoPath = styled.path`
  ${({ fill, strokeWidth }) => css`
    fill: ${fill};
    stroke: ${fill};
    stroke-width: ${strokeWidth};
  `}
  fill-rule: 'evenodd';
  stroke-linejoin: 'round';
`;
