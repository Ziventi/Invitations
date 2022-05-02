import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'reducers/store';

export default function MetadataBar(){
  const state = useSelector(({ state }: RootState) => state);
  return (
    <footer className={'metadata'}>
      <small>Dimensions: {state.imageDimensions.width} x {state.imageDimensions.height}</small>
    </footer>
  );
}
