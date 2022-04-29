import React, { ReactElement } from 'react';

import { GoogleFont, PageState } from 'constants/types';

export default function DesignForm({
  fonts,
  usePageState,
}: DesignFormProps): ReactElement {
  const [pageState, setPageState] = usePageState;

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

  function onFontSizeChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.valueAsNumber || 2;
    setPageState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        fontSize: Math.max(2, Math.min(value, 144)),
      },
    }));
  }

  function onLineHeightChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.valueAsNumber || 1;
    setPageState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        lineHeight: Math.max(1, Math.min(value, 150)),
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
          min={2}
          max={144}
          step={1}
          onChange={onFontSizeChange}
          value={pageState.textStyle.fontSize}
        />
      </FormField>
      <FormField>
        <label>Line Height:</label>
        <NumberInput
          min={2}
          max={150}
          step={2}
          onChange={onLineHeightChange}
          value={pageState.textStyle.lineHeight}
        />
      </FormField>
    </section>
  );
}

function FormField({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={'form-field'}>{children}</div>;
}

function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type={'number'} {...props} />;
}

interface DesignFormProps {
  fonts: GoogleFont[];
  usePageState: [PageState, React.Dispatch<React.SetStateAction<PageState>>];
}
