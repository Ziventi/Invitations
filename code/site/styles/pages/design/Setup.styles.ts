import { transparentize } from 'polished';
import styled, { createGlobalStyle, css } from 'styled-components';

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
    max-width: 550px;
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
  scroll-snap-align: start;
`;

export const NamesList = {
  Section: styled(Section)`
    background-color: ${COLOR.WORKFLOW};
  `,
  Modal: styled.dialog<{ visible: boolean }>`
    background-color: rgba(0, 0, 0, 0.7);
    display: block;
    height: 100vh;
    position: fixed;
    transition: all 0.3s;
    width: 100vw;

    ${({ visible }) =>
      visible
        ? css`
            opacity: 1;
            z-index: 1;
          `
        : css`
            opacity: 0;
            z-index: -1;
          `}
  `,
  ModalDialog: styled.div`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  `,
  ModalContent: styled.div`
    background-color: ${transparentize(0.1, COLOR.PRIMARY_4_DARK)};
    border-radius: 10px;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    min-height: 400px;
    padding: 2em;
  `,
  ModalFooter: styled.footer`
    display: flex;
    gap: 1em;
    justify-content: space-between;
  `,
  Instructions: styled.p`
    color: ${COLOR.WHITE};
    font-size: 1.2em;
  `,
  NameListInput: styled.textarea`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid ${COLOR.WHITE};
    border-top: 1px solid ${COLOR.WHITE};
    color: ${COLOR.WHITE};
    font-size: 20px;
    line-height: 1.5;
    max-width: 100%;
    min-width: 350px;
    padding: 0.5em;
  `,
  NameCount: styled.small`
    color: ${COLOR.WHITE};
    display: block;
    margin: 1em 0;
    text-align: right;
    width: 100%;
  `,
};

export const ImageSelection = {
  Section: styled(Section)`
    background-color: ${transparentize(0.06, COLOR.PRIMARY_5_NEUTRAL)};
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
