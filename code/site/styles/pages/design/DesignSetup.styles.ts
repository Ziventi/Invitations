import { lighten, transparentize } from 'polished';
import styled, { css, keyframes } from 'styled-components';

import ZiventiLogo from 'components/logo';
import * as Animation from 'styles/Animations.styles';
import * as Global from 'styles/Components.styles';
import { COLOR, THEME } from 'styles/Constants.styles';
import * as Mixin from 'styles/Mixins.styles';

export const Default = {
  Page: styled.div`
    color: ${COLOR.WHITE};
    height: 100%;
    position: relative;
  `,
  SiteLogo: styled(ZiventiLogo)`
    height: 80px;
    left: 2%;
    position: absolute;
    top: 2%;
    z-index: 1;
  `,
  BackgroundMask: styled.div`
    animation: ${keyframes`
      from {
        background-color: rgba(0, 0, 0, 0.8);
      }

      to {
        background-color: rgba(0, 0, 0, 0.2);
      }
    `} 1s forwards;
    height: 100vh;
    position: absolute;
    width: 100vw;
  `,
  Carousel: styled.div<{ currentStep: number }>`
    align-items: center;
    animation: ${Animation.FadeIn} 0.5s;
    background-color: ${({ currentStep }) =>
      currentStep === 0
        ? THEME.setupSectionNamesList
        : THEME.setupSectionImageSelect};
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 2em;
    position: relative;
    transition: all 0.5s;
    transition-delay: 0.1s;
    width: 100%;
  `,
  Component: styled.main<{ visible: boolean }>`
    ${({ visible }) =>
      visible
        ? css`
            opacity: 1;
            pointer-events: auto;
          `
        : css`
            opacity: 0;
            pointer-events: none;
          `};
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    transition: all 0.5s;
    width: 100%;
  `,
  Container: styled(Global.Container)`
    column-gap: 2em;
    display: grid;
    grid-template-columns: 7fr 3fr;
    padding: 2em;
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
};

export const NamesList = {
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
    background-color: ${transparentize(0.03, COLOR.PRIMARY_4_DARK)};
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
    ${Mixin.Scrollable(lighten(0.1, COLOR.PRIMARY_5_DARK), {
      borderRadius: '20px',
    })}
    background-color: ${transparentize(0.6, COLOR.PRIMARY_5_DARK)};
    border-radius: 3%;
    height: 60vh;
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
  FileSelector: styled.div`
    margin: 1em 0;
  `,
  ImagePreview: styled.figure`
    height: 100%;
    margin: 0;
    position: relative;
    width: 100%;
  `,
  SmallPrint: styled.small`
    line-height: 1.3;
    margin: 1.5em 0;
    max-width: 300px;
  `,
};
