import React, { ReactElement } from 'react';

import { PageState } from 'constants/types';

export default function ProgressOverlay({
  state,
}: ProgressOverlayProps): ReactElement | null {
  if (!state.downloadInProgress) return null;
  return <dialog className={'loading'}>Loading...</dialog>;
}

interface ProgressOverlayProps {
  state: PageState;
}
