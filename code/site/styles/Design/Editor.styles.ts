import { ResizeHandlePosition } from 'constants/types';
import styled, { css } from 'styled-components';

import { Button, COLOR, Input, Scrollable } from 'styles/Library';

export default {
  Main: styled.main`
    display: flex;
    flex: 1 1 auto;
    height: 100%;
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
  ${Input}
  font-size: 16px;
  padding: 0.5em;
`;

export const LeftSidebar = {
  Aside: styled.aside`
    ${Scrollable(COLOR.PRIMARY_1_DARK)}
    background-color: ${COLOR.PRIMARY_1_DARK};
    box-shadow: 0 0 3px 0 ${COLOR.BLACK};
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    max-width: 290px;
    padding: 1em 1.5em;
    user-select: none;
    z-index: 2;
  `,
  Button: styled(Button)`
    margin: 0.3em 0;
    width: 100%;
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
  NumericInput: styled.input`
    ${FormInput}
    border-radius: 10px 0 0 10px;
  `,
  NumberSuffix: styled.input<NumberSuffixProps>`
    ${FormInput}
    border-left: 2px solid ${COLOR.PRIMARY_1};
    border-radius: 0 10px 10px 0;
    color: #3b3b3b;
    cursor: default;
    font-size: 16px;
    margin: -0.1em;
    padding: 0.5em 0.2em;
    user-select: none;
    width: 30px;

    &:focus {
      outline-width: 0;
    }

    ${({ focused }) => {
      if (!focused) return null;
      return css`
        outline-offset: 0;
        outline-style: auto;
        outline-width: 1px;
      `;
    }}
  `,
  ColorThumbnail: styled.button<ColorThumbnailProps>`
    ${({ bgColor, fontColor }) => css`
      background-color: ${bgColor};
      color: ${fontColor};
    `}
    border-radius: 3px;
    border-style: none;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    cursor: pointer;
    height: 35px;
    width: 100%;
  `,
  ColorPicker: styled.div<ColorPickerProps>`
    position: absolute;
    transition: all 0.2s;
    ${({ visible }) =>
      visible
        ? css`
            opacity: 1;
            z-index: 2;
          `
        : css`
            opacity: 0;
            z-index: -1;
          `};
  `,
};

export const Preview = {
  Container: styled.section`
    align-items: center;
    background-color: ${COLOR.PRIMARY_1};
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: relative;
    width: 100%;
  `,
  Main: styled.div`
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    height: 0;
    justify-content: center;
    position: relative;
  `,
  Footer: styled.footer`
    align-items: center;
    background-color: ${COLOR.PRIMARY_5_LIGHT};
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: flex;
    flex: 0 0 30px;
    justify-content: space-evenly;
    min-height: 0;
    width: 100%;
    z-index: 2;
  `,
  FooterText: styled.small`
    color: ${COLOR.WHITE};
    font-size: 0.9vw;
  `,
  Canvas: styled.canvas`
    max-height: 100%;
    max-width: 100%;
  `,
  DragZone: styled.div`
    align-items: center;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    display: flex;
    height: 100%;
    justify-content: center;
    position: absolute;
    width: 100%;
  `,
  Draggable: styled.div<DraggableProps>`
    border: 2px dashed
      ${({ selected }) => (selected ? COLOR.DEFAULT : COLOR.TRANSPARENT)};
    border-radius: 2px;
    cursor: move;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: fit-content;
    padding: 10px;
    position: absolute;
    text-align: center;
    transition: border 0.2s;
    user-select: none;
    width: 100%;
  `,
  ResizeHandle: styled.svg<ResizeHandleProps>`
    cursor: ew-resize;
    margin: -1em;
    position: absolute;
    transition: opacity 0.2s ease, visibility 0.2s ease;

    ${({ position, selected }) => {
      const opacity = selected ? 1 : 0;
      const visibility = selected ? 'visible' : 'hidden';
      const alignSelf = position === 'east' ? 'flex-end' : 'flex-start';
      return css`
        align-self: ${alignSelf};
        opacity: ${opacity};
        visibility: ${visibility};
      `;
    }}
  `,
  ResizeHandleCircle: styled.circle`
    fill: #00a6ff;
  `,
};

interface ColorThumbnailProps {
  bgColor: string;
  fontColor: string;
}

interface ColorPickerProps {
  visible: boolean;
}

interface DraggableProps {
  selected: boolean;
}

interface ResizeHandleProps {
  position: ResizeHandlePosition;
  selected: boolean;
}

interface NumberSuffixProps {
  focused: boolean;
}
