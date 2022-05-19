import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function FontIcon(props: FontIconProps) {
  return (
    <FontAwesomeIcon
      {...props}
      style={{ marginRight: props.space ? '0.4em' : undefined }}
    />
  );
}

interface FontIconProps extends FontAwesomeIconProps {
  space?: boolean;
}
