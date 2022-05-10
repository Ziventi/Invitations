import React from 'react';

export default function Container({
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={'container'}>{children}</div>;
}
