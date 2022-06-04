import { ChromePicker } from 'react-color';
import styled, { css } from 'styled-components';

import ZiventiLogo from 'components/logo';
import * as Global from 'styles/Components.styles';
import { COLOR } from 'styles/Constants.styles';
import * as Mixin from 'styles/Mixins.styles';

export const Default = {
  Page: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  Main: styled.main`
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    min-height: 0;
    position: relative;
  `,
  ProgressOverlay: styled.dialog`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    opacity: 0.8;
    width: 100%;
  `,
};

const FormInput = css`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${COLOR.WHITE};
  color: ${COLOR.WHITE};
  font-size: 16px;
  max-width: 100%;
  outline-color: ${COLOR.PRIMARY_2_NEUTRAL};
  padding: 0.5em;
`;

export const EditorHeader = {
  Header: styled.header`
    align-items: center;
    background-color: ${COLOR.PRIMARY_4_DARK};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: flex;
    flex: 0 0 55px;
    justify-content: space-between;
    min-height: 0;
    padding: 0.5em 1em;
    z-index: 2;
  `,
  HeaderButton: styled(Global.Button)`
    display: block;
    font-size: 0.8em;
    height: 100%;
    min-width: 100px;
    padding: 0;
    width: 20%;
  `,
  BackLink: styled.a`
    color: ${COLOR.WHITE};
  `,
  SiteLogo: styled(ZiventiLogo)`
    height: 100%;
  `,
  ActionSection: styled.section`
    display: flex;
    gap: 0.5em;
    height: 100%;
  `,
  MenuTrigger: styled.div`
    height: 100%;
    position: relative;
  `,
  Menu: styled.menu<{ visible: boolean }>`
    ${({ visible }) => Mixin.Visible(visible, { zIndex: 2 })}
    background-color: ${COLOR.PRIMARY_5_NEUTRAL};
    border-radius: 10px;
    cursor: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    max-height: 400px;
    padding: 1em;
    position: absolute;
    right: 0;
    top: 80%;
    transition: all 0.1s;
    width: 400px;
  `,
  MenuButton: styled(Global.Button)`
    display: block;
    flex: 1 1 150px;
    padding: 1.5em;
  `,
};

export const LeftSidebar = {
  Aside: styled.aside`
    ${Mixin.Scrollable(COLOR.PRIMARY_5_NEUTRAL)}
    background-color: ${COLOR.PRIMARY_5_NEUTRAL};
    box-shadow: 0 0 3px 0 ${COLOR.BLACK};
    color: ${COLOR.WHITE};
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    max-width: 290px;
    padding: 1em 1.5em;
    user-select: none;
    z-index: 1;
  `,
  DesignForm: styled.section`
    margin-bottom: 1em;
  `,
  FormFieldRow: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  FormField: styled.div`
    flex: 1;
    padding: 0.5em 0;
    position: relative;
  `,
  Label: styled.label`
    display: block;
    padding: 5px 0;
  `,
  FormSelect: styled.select`
    ${FormInput}
  `,
  FontStyleSelect: styled.select`
    ${FormInput}
    width: 170px;
  `,
  FilenameInput: styled.textarea`
    ${FormInput}
  `,
  NumericField: styled.div<{ focused: boolean }>`
    width: fit-content;

    &:focus {
      outline-width: 0;
    }

    ${({ focused }) => {
      if (focused) {
        return css`
          outline: 0.5px auto ${COLOR.PRIMARY_2_NEUTRAL};
        `;
      }
    }}
  `,
  NumericInput: styled.input`
    ${FormInput}
    outline: none;
  `,
  NumberSuffix: styled.input`
    ${FormInput}
    color: ${COLOR.DEFAULT};
    cursor: default;
    font-size: 16px;
    padding: 0.5em 0.2em;
    user-select: none;
    width: 30px;
  `,
  ColorThumbnail: styled.button<ColorThumbnailProps>`
    ${({ bgColor, fontColor }) => css`
      background-color: ${bgColor};
      color: ${fontColor};
    `}
    border-radius: 3px;
    border-style: none;
    box-shadow: 0 0 1px 0 ${COLOR.BLACK};
    cursor: pointer;
    height: 35px;
    width: 100%;
  `,
  ColorPicker: styled(ChromePicker)<{ visible: boolean }>`
    ${({ visible }) => Mixin.Visible(visible)}
    margin-top: 0.5em;
    position: absolute;
    transition: all 0.2s;
    width: 100%;
  `,
};

export const RightSidebar = {
  Aside: styled.aside`
    background-color: ${COLOR.PRIMARY_5_NEUTRAL};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: flex;
    flex: 0 0 200px;
    flex-direction: column;
    overflow-y: clip;
    z-index: 1;
  `,
  Header: styled.header`
    align-items: center;
    background-color: ${COLOR.PRIMARY_5_DARK};
    color: ${COLOR.WHITE};
    display: flex;
    font-size: 0.9em;
    justify-content: center;
    padding: 1em;
  `,
  ButtonList: styled.div`
    ${Mixin.Scrollable(COLOR.PRIMARY_5_DARK, { exactColor: true })}
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  Button: styled(Global.Button).attrs({ bgColor: COLOR.PRIMARY_5_NEUTRAL })`
    align-items: center;
    border-radius: 0;
    border-style: none;
    column-gap: 20px;
    cursor: pointer;
    display: grid;
    flex: 1 1 auto;
    font-size: 14px;
    grid-template-columns: 20px 1fr;
    min-height: 70px;
    outline: none;
    padding: 0.5em;
    transition: all 0.3s ease;
    width: 100%;
  `,
  Index: styled.span`
    text-align: right;
  `,
  Name: styled.span`
    text-align: left;
  `,
};

interface ColorThumbnailProps {
  bgColor: string;
  fontColor: string;
}
