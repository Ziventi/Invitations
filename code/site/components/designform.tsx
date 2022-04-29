import React, { ReactElement, useMemo } from 'react';

import { GoogleFont, PageState } from 'constants/types';

export default function DesignForm({
  fonts,
  usePageState,
}: DesignFormProps): ReactElement {
  const [pageState, setPageState] = usePageState;

  const maxTop = useMemo(() => {
    return pageState.canvasDimensions.height - pageState.textStyle.height;
  }, [pageState.canvasDimensions.height, pageState.textStyle.height]);
  const maxLeft = useMemo(() => {
    return pageState.canvasDimensions.width - pageState.textStyle.width;
  }, [pageState.canvasDimensions.width, pageState.textStyle.width]);

  /**
   * Triggers on a new font family selection.
   * @param e The change event.
   */
  function onFontFamilyChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const fontFamily = e.target.value!;
    setPageState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        fontFamily,
      },
    }));
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
    setPageState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        [e.target.name]: Math.max(min, Math.min(value, max)),
      },
    }));
  }

  return (
    <section className={'design-form'}>
      <FormField>
        <label>Font Family:</label>
        <select
          onChange={onFontFamilyChange}
          value={pageState.textStyle.fontFamily}>
          {fonts.map((font, key) => {
            return (
              <option value={font.family} key={key}>
                {font.family}
              </option>
            );
          })}
        </select>
      </FormField>
      <FormField>
        <label>Font Size:</label>
        <NumberInput
          name={'fontSize'}
          min={2}
          max={144}
          step={1}
          onChange={onNumberInputChange}
          value={pageState.textStyle.fontSize}
        />
      </FormField>
      <FormField>
        <label>Line Height:</label>
        <NumberInput
          name={'lineHeight'}
          min={2}
          max={150}
          step={2}
          onChange={onNumberInputChange}
          value={pageState.textStyle.lineHeight}
        />
      </FormField>
      <FormField>
        <label>Top:</label>
        <NumberInput
          name={'top'}
          min={0}
          max={maxTop}
          step={1}
          onChange={onNumberInputChange}
          value={pageState.textStyle.top}
        />
      </FormField>
      <FormField>
        <label>Left:</label>
        <NumberInput
          name={'left'}
          min={0}
          max={maxLeft}
          step={1}
          onChange={onNumberInputChange}
          value={pageState.textStyle.left}
        />
      </FormField>
    </section>
  );
}

function FormField({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={'form-field'}>{children}</div>;
}

function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type={'number'} autoComplete={'off'} {...props} />;
}

interface DesignFormProps {
  fonts: GoogleFont[];
  usePageState: [PageState, React.Dispatch<React.SetStateAction<PageState>>];
}
