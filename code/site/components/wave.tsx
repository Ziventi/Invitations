import React from 'react';

export default function Wave(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={'wave'}>
      <svg
        xmlns={'http://www.w3.org/2000/svg'}
        viewBox={'0 0 1440 120'}
        preserveAspectRatio={'xMaxYMin meet'}
        className={props.className}>
        <path d={'M0 0 0 100C279 4 443 26 667 55S1179 150 1440 50V0H0'} />
      </svg>
    </div>
  );
}
