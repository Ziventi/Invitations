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

  function onTopChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.valueAsNumber || 0;
    setPageState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        top: Math.max(0, Math.min(value, maxTop)),
      },
    }));
  }

  function onLeftChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.valueAsNumber || 0;
    setPageState((currentState) => ({
      ...currentState,
      textStyle: {
        ...currentState.textStyle,
        left: Math.max(0, Math.min(value, maxLeft)),
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
      <FormField>
        <label>Top:</label>
        <NumberInput
          min={0}
          max={maxTop}
          step={1}
          onChange={onTopChange}
          value={pageState.textStyle.top}
        />
      </FormField>
      <FormField>
        <label>Left:</label>
        <NumberInput
          min={0}
          max={maxLeft}
          step={1}
          onChange={onLeftChange}
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
  return <input type={'number'} {...props} />;
}

interface DesignFormProps {
  fonts: GoogleFont[];
  usePageState: [PageState, React.Dispatch<React.SetStateAction<PageState>>];
}
