import Link from 'next/link';
import React from 'react';

import Container from 'components/container';
import ZiventiLogo from 'components/logo';

export default function Header({ headerRef }: HeaderProps) {
  return (
    <header className={'app'} ref={headerRef}>
      <Container>
        <div className={'logo-wrapper'}>
          <ZiventiLogo color={'white'} layout={'fill'} objectFit={'contain'} />
        </div>
        <nav className={'header'}>
          <menu>
            <li>
              <Link href={'/design'}>Design</Link>
            </li>
            <li>
              <a>Pricing</a>
            </li>
            <li>
              <a>Motivation</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </menu>
        </nav>
      </Container>
    </header>
  );
}

interface HeaderProps {
  headerRef?: React.RefObject<HTMLDivElement>;
}
