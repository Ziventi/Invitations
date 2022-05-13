import Link from 'next/link';
import React from 'react';

import ZiventiLogo from 'components/logo';
import App from 'styles/App.styles';
import { Global } from 'styles/Library';

export default function Header({ headerRef }: HeaderProps) {
  return (
    <App.Header ref={headerRef}>
      <Global.Container>
        <ZiventiLogo color={'white'} />
        <App.HeaderNavigation>
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
        </App.HeaderNavigation>
      </Global.Container>
    </App.Header>
  );
}

interface HeaderProps {
  headerRef?: React.RefObject<HTMLDivElement>;
}
