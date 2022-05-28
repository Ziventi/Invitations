import styled, { createGlobalStyle } from 'styled-components';

import ZiventiLogo from 'components/logo';
import { COLOR, FONT } from 'styles/Constants';
import * as Global from 'styles/Global';

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

export default {
  Header: styled.header`
    background-color: transparent;
    display: flex;
    height: 70px;
    justify-content: center;
    margin-top: -70px;
    padding: 0.5em 1.5em;
    position: sticky;
    top: 0;
    transition: all 0.2s;
    width: 100%;
    z-index: 2;
  `,
  HeaderContainer: styled(Global.Container)`
    display: flex;
  `,
  HeaderNavigation: styled(Global.Navigation)`
    justify-content: flex-end;
  `,
  HeaderSiteLogo: styled(ZiventiLogo)`
    cursor: pointer;
    height: 250%;
    transition: all 0.2s;
  `,
  Footer: styled.footer`
    background-color: ${COLOR.PRIMARY_4_DARK};
    display: flex;
    justify-content: center;
    padding: 1em;
    width: 100%;
    z-index: 1;
  `,
};
