import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import { RootState } from 'constants/reducers';

export default function MetadataBar() {
  const state = useSelector((state: RootState) => state);

  const filename = useMemo(() => {
    return Utils.substituteName(state.fileNameTemplate, state.selectedName);
  }, [state.fileNameTemplate, state.selectedName]);
  return (
    <footer className={'metadata'}>
      <small>
        Dimensions: {state.imageDimensions.width} x{' '}
        {state.imageDimensions.height}
      </small>
      <small>
        {filename}.{state.fileFormat}
      </small>
    </footer>
  );
}
