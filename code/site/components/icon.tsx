import type { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export default function FontIcon({
  spaceLeft,
  spaceRight,
  ...props
}: FontIconProps) {
  return (
    <FontAwesomeIcon
      {...props}
      style={{
        marginLeft: spaceLeft ? '0.4em' : undefined,
        marginRight: spaceRight ? '0.4em' : undefined,
      }}
    />
  );
}

interface FontIconProps extends FontAwesomeIconProps {
  spaceLeft?: boolean;
  spaceRight?: boolean;
}
