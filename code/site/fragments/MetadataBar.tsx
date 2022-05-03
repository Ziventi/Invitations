import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as File from 'constants/functions/file';
import { RootState } from 'reducers/store';

export default function MetadataBar() {
  const state = useSelector(({ state }: RootState) => state);

  const filename = useMemo(() => {
    return File.substituteName(state.fileNameTemplate, state.selectedName);
  }, [state.fileNameTemplate, state.selectedName]);
  return (
    <footer className={'metadata'}>
      <small>
        Dimensions: {state.imageDimensions.width} x{' '}
        {state.imageDimensions.height}
      </small>
      <small>{filename}.{state.fileFormat}</small>
    </footer>
  );
}
