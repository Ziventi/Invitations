import { transparentize } from 'polished';
import styled, { createGlobalStyle } from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';
import * as Mixin from 'styles/Mixins';

export const Default = {
  Body: createGlobalStyle`
    html, body {
      scroll-snap-type: x mandatory;
    }
  `,
  Main: styled.main`
    color: ${COLOR.WHITE};
    display: inline-flex;
    position: relative;
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
  Button: styled(Global.Button)<{ visible?: boolean }>`
    ${({ visible }) => Mixin.Visible(visible)}
    min-width: 150px;
    padding: 1.2em;
  `,
  Footer: styled.footer`
    align-items: center;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 1.5em;
    position: absolute;
    width: 100%;
  `,
  FooterLink: styled(Global.Link)`
    font-size: 1em;
  `,
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  position: relative;
  scroll-snap-align: center;
  transition: all 0.1s;
  width: 100vw;
`;

export const NamesList = {
  Section: styled(Section)`
    background-color: ${COLOR.WORKFLOW};
  `,
  Container: styled(Global.Container)`
    column-gap: 2em;
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 2em;
  `,
  Modal: styled.dialog<{ visible: boolean }>`
    ${({ visible }) => Mixin.Visible(visible)}
    background-color: rgba(0, 0, 0, 0.7);
    display: block;
    height: 100vh;
    position: fixed;
    transition: all 0.3s;
    width: 100vw;
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
  NameTextInput: styled.textarea`
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
  NameListContainer: styled.div<{ visible: boolean }>`
    ${({ visible }) => Mixin.Visible(visible)}
    background-color: ${transparentize(0.6, COLOR.PRIMARY_5_DARK)};
    border-radius: 3%;
    height: 70vh;
    overflow: auto;
    padding: 0 2em;
    transition: all 0.3s;
    width: 100%;
  `,
  NameList: styled.ol`
    font-size: 1.5em;
    line-height: 1.5;
    margin-inline-start: 20px;
    padding-left: 20px;
    text-align: left;

    li {
      padding-inline-start: 20px;
    }
  `,
};

export const ImageSelection = {
  Section: styled(Section)`
    background-color: ${transparentize(0.06, COLOR.PRIMARY_5_NEUTRAL)};
  `,
  Container: styled(Global.Container)`
    column-gap: 2em;
    display: grid;
    grid-template-columns: 7fr 3fr;
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
