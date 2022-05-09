import Image, { ImageProps } from 'next/image';
import React from 'react';

import ZiventiBlack from 'public/ziventi-logo-black.png';
import ZiventiWhite from 'public/ziventi-logo-white.png';

export default function ZiventiLogo({ color, ...props }: ZiventiLogoProps) {
  const src = color === 'white' ? ZiventiWhite : ZiventiBlack;
  return (
    <div className={'site-logo-wrapper'} style={{ width: `${props.width}px` }}>
      <Image
        src={src}
        alt={'Ziventi Logo'}
        priority={true}
        quality={100}
        {...props}
      />
    </div>
  );
}

interface ZiventiLogoProps extends Omit<ImageProps, 'src'> {
  color?: 'black' | 'white';
}
