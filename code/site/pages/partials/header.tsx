import Image from 'next/image';
import React, { ReactElement } from 'react';

import ZiventiLogo from 'public/ziventi-logo.png';

export default function Header(): ReactElement {
  return (
    <header>
      <Image
        src={ZiventiLogo}
        alt={'Ziventi Logo'}
        priority={true}
        layout={'fill'}
        objectFit={'contain'}
        objectPosition={'left'}
        width={1001}
        height={643}
        className={'site-logo'}
      />
    </header>
  );
}
