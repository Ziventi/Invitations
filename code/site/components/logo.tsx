import Image, { ImageProps } from 'next/image';
import React from 'react';

import ZiventiLogoPNG from 'public/ziventi-logo.png';

export default function ZiventiLogo(props: Omit<ImageProps, 'src'>) {
  return (
    <Image
      src={ZiventiLogoPNG}
      alt={'Ziventi Logo'}
      priority={true}
      {...props}
    />
  );
}
