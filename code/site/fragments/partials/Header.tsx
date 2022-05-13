import Link from 'next/link';
import React from 'react';

import ZiventiLogo from 'components/logo';
import { Header as HeaderMain, HeaderNavigation } from 'styles/App.styles';
import { Container } from 'styles/Library';

export default function Header({ headerRef }: HeaderProps) {
  return (
    <HeaderMain ref={headerRef}>
      <Container>
        <ZiventiLogo color={'white'} />
        <HeaderNavigation>
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
        </HeaderNavigation>
      </Container>
    </HeaderMain>
  );
}

interface HeaderProps {
  headerRef?: React.RefObject<HTMLDivElement>;
}
