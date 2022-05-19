import type { ReactElement } from 'react';
import React from 'react';

import type { PageState } from 'constants/types';
import DesignEditor from 'styles/Design/Editor.styles';

export default function ProgressOverlay({
  state,
}: ProgressOverlayProps): ReactElement | null {
  if (!state.downloadInProgress) return null;
  return (
    <DesignEditor.ProgressOverlay>Loading...</DesignEditor.ProgressOverlay>
  );
}

interface ProgressOverlayProps {
  state: PageState;
}
