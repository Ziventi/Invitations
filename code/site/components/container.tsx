import React from 'react';

export default function Container({ children, maxWidth }: ContainerProps) {
  return (
    <div className={'container'} style={{ maxWidth }}>
      {children}
    </div>
  );
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: number;
}
