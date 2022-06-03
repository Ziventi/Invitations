import type { ReactElement } from 'react';
import React from 'react';

import type { AppState } from 'constants/types';
import { Default as DE} from 'styles/pages/design/DesignEditor.styles';

export default function ProgressOverlay({
  state,
}: ProgressOverlayProps): ReactElement | null {
  if (!state.downloadInProgress) return null;
  return (
    <DE.ProgressOverlay>Loading...</DE.ProgressOverlay>
  );
}

interface ProgressOverlayProps {
  state: AppState;
}
