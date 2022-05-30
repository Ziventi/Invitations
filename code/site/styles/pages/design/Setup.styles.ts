import { transparentize } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

export const Default = {
  Body: createGlobalStyle`
    html, body {
      scroll-snap-type: y mandatory;
    }
  `,
  Main: styled.main`
    color: ${COLOR.WHITE};
    position: relative;
  `,
  Container: styled(Global.Container)`
    column-gap: 2em;
    display: grid;
    grid-template-columns: 7fr 3fr;
  `,
  Partition: styled.section`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  `,
  Heading: styled.h2`
    font-size: 3em;
    margin: 0.2em 0;
  `,
  Text: styled.p`
    font-size: 1.8em;
    line-height: 150%;
    max-width: 700px;
  `,
  Footer: styled.footer`
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 1.5em;
    position: fixed;
  `,
  FooterLink: styled(Global.Link)`
    font-size: 1em;
  `,
};

const Section = styled.section`
  display: flex;
  height: 100vh;
  justify-content: center;
  padding: 2em;
  scroll-snap-align: start;
`;

export const NamesList = {
  Section: styled(Section)`
    background-color: ${COLOR.WORKFLOW};
  `,
  NameListInput: styled.textarea`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid ${COLOR.WHITE};
    color: ${COLOR.WHITE};
    font-size: 20px;
    line-height: 1.5;
    max-width: 100%;
    min-width: 350px;
    padding: 0.5em;
  `,
  NameCount: styled.small`
    display: block;
  `,
};

export const ImageSelection = {
  Section: styled(Section)`
    background-color: ${transparentize(0.09, COLOR.PRIMARY_5_NEUTRAL)};
  `,
  FileSelector: styled.div`
    margin: 2em 0;
  `,
  ImagePreview: styled.figure`
    height: 100%;
    margin: 0;
    position: relative;
    width: 100%;
  `,
};
