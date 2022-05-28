import React from 'react';

export default function Wave({ className, colorTop, colorBottom }: WaveProps) {
  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      viewBox={'0 0 1440 105'}
      className={className}
      display={'block'}>
      <path
        d={
          'M691.5 52C419.08 -27.9099 210.5 52 0 105.5V0H1440V41.5C1291.5 84 954 129 691.5 52Z'
        }
        fill={colorTop}
      />
      <path
        fillRule={'evenodd'}
        clipRule={'evenodd'}
        d={
          'M1440 105.8V41.3001C1291.5 83.8001 954 128.8 691.5 51.8001C455.033 -17.5635 266.667 33.4914 83.3941 83.166C55.5287 90.7186 27.7811 98.2394 0 105.3V105.8H1440Z'
        }
        fill={colorBottom}
      />
    </svg>
  );
}

interface WaveProps extends React.HTMLAttributes<SVGSVGElement> {
  colorTop: string;
  colorBottom: string;
}
