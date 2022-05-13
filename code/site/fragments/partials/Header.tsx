import Link from 'next/link';
import React from 'react';

import ZiventiLogo from 'components/logo';
import { Container } from 'styles/Library';

export default function Header({ headerRef }: HeaderProps) {
  return (
    <header className={'app'} ref={headerRef}>
      <Container>
        <ZiventiLogo color={'white'} />
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
