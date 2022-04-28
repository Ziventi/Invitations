import Image from 'next/image';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import ZiventiLogo from 'public/ziventi-logo.png';

export default function Header(): ReactElement {
  return (
    <header>
      <Link href={'/'}>
        <Image
          src={ZiventiLogo}
          alt={'Ziventi Logo'}
          priority={true}
          layout={'fill'}
          objectFit={'contain'}
          objectPosition={'left'}
          className={'site-logo'}
        />
      </Link>
    </header>
  );
}
