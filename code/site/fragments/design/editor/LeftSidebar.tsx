import { TinyColor } from '@ctrl/tinycolor';
import type { Dispatch, ReactElement, SetStateAction } from 'react';
import React, { useMemo, useState } from 'react';
import type { ColorResult } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from 'constants/reducers';
import { updateDraggable, updateState } from 'constants/reducers';
import type { FontVariantKey, GoogleFont } from 'constants/types';
import { DEFAULT_FILENAME_TEMPLATE, FONT_VARIANTS } from 'constants/variables';
import { LeftSidebar as L } from 'styles/pages/design/DesignEditor.styles';

export default function LeftSidebar({
  colorPickerRef,
  fonts,
  useColorPicker,
}: LeftSidebarProps): ReactElement {
  const [isColorPickerVisible, setColorPickerVisible] = useColorPicker;
  const appState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  // Memoises the draggable text style limits for the number inputs.
  const max = useMemo(() => {
    return {
      top: appState.imageDimensions.height - appState.draggable.position.height,
      left: appState.imageDimensions.width - appState.draggable.position.width,
      fontSize: (appState.imageDimensions.width / 4) * 3,
    };
  }, [
    appState.imageDimensions,
    appState.draggable.position.height,
    appState.draggable.position.width,
  ]);

  // Memoises the list of font variants for the selected font family.
  const fontVariants = useMemo(() => {
    const font = fonts.find(
      (font) => font.family === appState.draggable.style.fontFamily,
    )!;
    return font.variants.sort((a, b) => {
      if (FONT_VARIANTS[a] < FONT_VARIANTS[b]) return -1;
      if (FONT_VARIANTS[a] > FONT_VARIANTS[b]) return 1;
      return 0;
    });
  }, [fonts, appState.draggable.style.fontFamily]);

  // Memoises the font preview text and color.
  const { fontPreviewText, fontPreviewTextColor } = useMemo(() => {
    const color = new TinyColor(appState.draggable.style.color);
    return {
      fontPreviewText: color.toString('hex8').toUpperCase(),
      fontPreviewTextColor: color.isLight() ? '#000' : '#fff',
    };
  }, [appState.draggable.style.color]);

  // const filename = useMemo(() => {
  //   return Utils.substituteName(state.fileNameTemplate, state.selectedName);
  // }, [state.fileNameTemplate, state.selectedName]);

  // const dimensions = useMemo(() => {
  //   const { height, width } = state.imageDimensions;
  //   return `Dimensions: ${width} x ${height}`;
  // }, [state.imageDimensions]);

  /**
   * Triggers on a new font family selection. If the selected font family does
   * not have the current font style, the font style resets to regular.
   * @param e The change event.
   */
  function onFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const fontFamily = e.target.value;
    let { fontStyle } = appState.draggable.style;

    const font = fonts.find((font) => font.family === fontFamily);
    if (!font || !font.variants.includes(fontStyle)) {
      fontStyle = 'regular';
    }

    dispatch(
      updateDraggable({
        style: {
          fontFamily: e.target.value,
          fontStyle,
        },
      }),
    );
  }

  /**
   * Triggers on a new font style selection.
   * @param e The change event.
   */
  function onFontStyleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    dispatch(
      updateDraggable({
        style: {
          fontStyle: e.target.value as FontVariantKey,
        },
      }),
    );
  }

  /**
   * Triggers on any of the number input changes using the name as the property
   * to change and the minimum and maximum values as bounds.
   * @param e The change event.
   */
  function onNumberStyleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const min = parseInt(e.target.min);
    const max = parseInt(e.target.max);
    const value = e.target.valueAsNumber ?? min;
    dispatch(
      updateDraggable({
        style: {
          [e.target.name]: Math.max(min, Math.min(value, max)),
        },
      }),
    );
  }

  /**
   * Triggers on any of the number input changes using the name as the property
   * to change and the minimum and maximum values as bounds.
   * @param e The change event.
   */
  function onNumberPositionChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const min = parseInt(e.target.min);
    const max = parseInt(e.target.max);
    const value = e.target.valueAsNumber ?? min;
    dispatch(
      updateDraggable({
        position: {
          [e.target.name]: Math.max(min, Math.min(value, max)),
        },
      }),
    );
  }

  function onFileNameTemplateChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void {
    dispatch(
      updateState({
        fileNameTemplate: e.target.value,
      }),
    );
  }

  /**
   * Shows the color picker.
   */
  function showColorPicker() {
    setColorPickerVisible(true);
  }

  return (
    <L.Aside>
      <L.DesignForm>
        <L.FormField>
          <L.Label>Font Family:</L.Label>
          <L.FormSelect
            onChange={onFontFamilyChange}
            value={appState.draggable.style.fontFamily}>
            {fonts.map((font) => {
              return (
                <option value={font.family} key={font.id}>
                  {font.family}
                </option>
              );
            })}
          </L.FormSelect>
        </L.FormField>
        <L.FormField>
          <L.Label>Font Style:</L.Label>
          <L.FontStyleSelect
            onChange={onFontStyleChange}
            disabled={fontVariants.length < 2}
            value={appState.draggable.style.fontStyle}>
            {fontVariants.map((variantKey) => {
              return (
                <option value={variantKey} key={variantKey}>
                  {FONT_VARIANTS[variantKey]}
                </option>
              );
            })}
          </L.FontStyleSelect>
        </L.FormField>
        <L.FormField>
          <L.Label>Font Color:</L.Label>
          <L.ColorThumbnail
            onClick={showColorPicker}
            bgColor={appState.draggable.style.color}
            fontColor={fontPreviewTextColor}>
            {fontPreviewText}
          </L.ColorThumbnail>
          <ColorPicker
            colorPickerRef={colorPickerRef}
            visible={isColorPickerVisible}
          />
        </L.FormField>
        <L.FormFieldRow>
          <L.FormField>
            <L.Label>Font Size:</L.Label>
            <NumberInput
              name={'fontSize'}
              min={2}
              max={max.fontSize}
              step={1}
              onChange={onNumberStyleChange}
              value={appState.draggable.style.fontSize}
            />
          </L.FormField>
          <L.FormField>
            <L.Label>Line Height:</L.Label>
            <NumberInput
              name={'lineHeight'}
              min={2}
              max={appState.imageDimensions.height}
              step={2}
              onChange={onNumberStyleChange}
              value={appState.draggable.style.lineHeight}
            />
          </L.FormField>
        </L.FormFieldRow>
        <L.FormFieldRow>
          <L.FormField>
            <L.Label>Letter Spacing:</L.Label>
            <NumberInput
              name={'letterSpacing'}
              min={-40}
              max={40}
              step={1}
              onChange={onNumberStyleChange}
              value={appState.draggable.style.letterSpacing}
            />
          </L.FormField>
        </L.FormFieldRow>
        <L.FormFieldRow>
          <L.FormField>
            <L.Label>Top:</L.Label>
            <NumberInput
              name={'top'}
              min={0}
              max={max.top}
              step={1}
              onChange={onNumberPositionChange}
              value={appState.draggable.position.top}
            />
          </L.FormField>
          <L.FormField>
            <L.Label>Left:</L.Label>
            <NumberInput
              name={'left'}
              min={0}
              max={max.left}
              step={1}
              onChange={onNumberPositionChange}
              value={appState.draggable.position.left}
            />
          </L.FormField>
        </L.FormFieldRow>
        <L.FormField>
          <L.Label>File Name Template:</L.Label>
          <L.FilenameInput
            onChange={onFileNameTemplateChange}
            value={appState.fileNameTemplate}
            rows={2}
            placeholder={DEFAULT_FILENAME_TEMPLATE}
            maxLength={128}
          />
        </L.FormField>
      </L.DesignForm>
    </L.Aside>
  );
}

function ColorPicker({ colorPickerRef, visible }: ColorPickerProps) {
  const appState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Triggers on a new font color selection.
   * @param color The result color.
   */
  function onFontColorChange(color: ColorResult): void {
    dispatch(
      updateDraggable({
        style: {
          color: new TinyColor({ ...color.rgb }).toRgbString(),
        },
      }),
    );
  }

  return (
    <div ref={colorPickerRef}>
      <L.ColorPicker
        visible={visible}
        color={appState.draggable.style.color}
        onChange={onFontColorChange}
        styles={{
          default: {
            picker: {
              borderRadius: '20px',
              cursor: 'pointer',
            },
          },
        }}
      />
    </div>
  );
}

function NumberInput({ ...props }: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <L.NumericField focused={isFocused}>
      <L.NumericInput
        type={'number'}
        autoComplete={'off'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      <L.NumberSuffix type={'text'} value={'px'} readOnly={true} />
    </L.NumericField>
  );
}

interface LeftSidebarProps {
  colorPickerRef: React.RefObject<HTMLDivElement>;
  fonts: GoogleFont[];
  useColorPicker: [boolean, Dispatch<SetStateAction<boolean>>];
}

interface ColorPickerProps {
  colorPickerRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
}

type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement>;
