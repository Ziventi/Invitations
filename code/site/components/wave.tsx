import React, { SVGAttributes } from 'react';

export default function WaveSVG({ className }: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      viewBox={'0 0 1440 320'}
      className={className}
      width={'100%'}
      preserveAspectRatio={'none'}>
      <path d={d} />
    </svg>
  );
}

const d =
  'm0 256 80-37.3C160 181 320 107 480 112s320 91 480 117.3c160 26.7 320-5.3 400-21.3l80-16V0H0Z';
