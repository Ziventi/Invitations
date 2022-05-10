import React, { SVGAttributes } from 'react';

export default function WaveSVG({
  className,
  children,
}: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      viewBox={'0 0 1440 656'}
      className={className}
      width={'100%'}
      preserveAspectRatio={'xMaxYMax slice'}>
      <path d={d} />
      <foreignObject>{children}</foreignObject>
    </svg>
  );
}

const d =
  'M0 656l80-37.3C160 581 320 507 480 512s320 91 480 117.3c160 26.7 320-5.3 400-21.3l80-16V0H0Z';
