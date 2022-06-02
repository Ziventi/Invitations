import { TinyColor } from '@ctrl/tinycolor';
import type { ReactElement } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import type { ColorResult } from 'react-color';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';

import type {
  AppDispatch,
  PageStatePayload,
  RootState,
} from 'constants/reducers';
import { updateState } from 'constants/reducers';
import type { FontVariantKey, GoogleFont } from 'constants/types';
import { DEFAULT_FILENAME_TEMPLATE, FONT_VARIANTS } from 'constants/variables';
import { LeftSidebar as L } from 'styles/pages/design/DesignEditor.styles';

export default function DesignForm({ fonts }: DesignFormProps): ReactElement {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  // Memoises the draggable top and left limits for the number inputs.
  const maxTop = useMemo(() => {
    return state.canvasDimensions.height - state.textStyle.height;
  }, [state.canvasDimensions.height, state.textStyle.height]);
  const maxLeft = useMemo(() => {
    return state.canvasDimensions.width - state.textStyle.width;
  }, [state.canvasDimensions.width, state.textStyle.width]);

  // Memoises the list of font variants for the selected font family.
  const fontVariants = useMemo(() => {
    const font = fonts.find(
      (font) => font.family === state.textStyle.fontFamily,
    )!;
    return font.variants.sort((a, b) => {
      if (FONT_VARIANTS[a] < FONT_VARIANTS[b]) return -1;
      if (FONT_VARIANTS[a] > FONT_VARIANTS[b]) return 1;
      return 0;
    });
  }, [fonts, state.textStyle.fontFamily]);

  // Memoises the font preview text and color.
  const { fontPreviewText, fontPreviewTextColor } = useMemo(() => {
    const color = new TinyColor(state.textStyle.color);
    return {
      fontPreviewText: color.toString('hex3').toUpperCase(),
      fontPreviewTextColor: color.isLight() ? '#000' : '#fff',
    };
  }, [state.textStyle.color]);

  /**
   * Triggers on a new font color selection.
   * @param color The result color.
   */
  function onFontColorChange(color: ColorResult): void {
    setState({
      textStyle: {
        color: color.hex,
      },
    });
  }

  /**
   * Triggers on a new font family selection. If the selected font family does
   * not have the current font style, the font style resets to regular.
   * @param e The change event.
   */
  function onFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const fontFamily = e.target.value;
    let { fontStyle } = state.textStyle;

    const font = fonts.find((font) => font.family === fontFamily);
    if (!font || !font.variants.includes(fontStyle)) {
      fontStyle = 'regular';
    }
    setState({
      textStyle: {
        fontFamily: e.target.value,
        fontStyle,
      },
    });
  }

  /**
   * Triggers on a new font style selection.
   * @param e The change event.
   */
  function onFontStyleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    setState({
      textStyle: {
        fontStyle: e.target.value as FontVariantKey,
      },
    });
  }

  /**
   * Triggers on any of the number input changes using the name as the property
   * to change and the minimum and maximum values as bounds.
   * @param e The change event.
   */
  function onNumberInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const min = parseInt(e.target.min);
    const max = parseInt(e.target.max);
    const value = e.target.valueAsNumber || min;
    setState({
      textStyle: {
        ...state.textStyle,
        [e.target.name]: Math.max(min, Math.min(value, max)),
      },
    });
  }

  function onFileNameTemplateChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void {
    setState({
      fileNameTemplate: e.target.value,
    });
  }

  /**
   * Shows the color picker.
   */
  function showColorPicker() {
    setState({
      isColorPickerVisible: true,
    });
  }

  return (
    <L.DesignForm>
      <L.FormField>
        <L.Label>Font Family:</L.Label>
        <L.FormSelect
          onChange={onFontFamilyChange}
          value={state.textStyle.fontFamily}>
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
          value={state.textStyle.fontStyle}>
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
          bgColor={state.textStyle.color}
          fontColor={fontPreviewTextColor}>
          {fontPreviewText}
        </L.ColorThumbnail>
        {/* TODO: Color picker not staying open on clicks */}
        <L.ColorPicker
          as={ChromePicker}
          visible={state.isColorPickerVisible}
          color={state.textStyle.color}
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
      </L.FormField>
      <L.FormFieldRow>
        <L.FormField>
          <L.Label>Font Size:</L.Label>
          <NumberInput
            name={'fontSize'}
            min={2}
            max={144}
            step={1}
            onChange={onNumberInputChange}
            value={state.textStyle.fontSize}
          />
        </L.FormField>
        <L.FormField>
          <L.Label>Line Height:</L.Label>
          <NumberInput
            name={'lineHeight'}
            min={2}
            max={150}
            step={2}
            onChange={onNumberInputChange}
            value={state.textStyle.lineHeight}
          />
        </L.FormField>
      </L.FormFieldRow>
      <L.FormFieldRow>
        <L.FormField>
          <L.Label>Top:</L.Label>
          <NumberInput
            name={'top'}
            min={0}
            max={maxTop}
            step={1}
            onChange={onNumberInputChange}
            value={state.textStyle.top}
          />
        </L.FormField>
        <L.FormField>
          <L.Label>Left:</L.Label>
          <NumberInput
            name={'left'}
            min={0}
            max={maxLeft}
            step={1}
            onChange={onNumberInputChange}
            value={state.textStyle.left}
          />
        </L.FormField>
      </L.FormFieldRow>
      <L.FormField>
        <L.Label>File Name Template:</L.Label>
        <L.FilenameInput
          onChange={onFileNameTemplateChange}
          value={state.fileNameTemplate}
          rows={2}
          placeholder={DEFAULT_FILENAME_TEMPLATE}
          maxLength={128}
        />
      </L.FormField>
    </L.DesignForm>
  );
}

function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div>
      <L.NumericInput
        type={'number'}
        autoComplete={'off'}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        {...props}
      />
      <L.NumberSuffix
        type={'text'}
        focused={isFocused}
        value={'px'}
        readOnly={true}
      />
    </div>
  );
}

interface DesignFormProps {
  fonts: GoogleFont[];
}
