import Link from 'next/link';
import React from 'react';

import * as Global from 'styles/Global';
import App from 'styles/pages/App.styles';

export default function Header({ headerRef }: HeaderProps) {
  return (
    <App.Header ref={headerRef}>
      <Global.Container>
        <App.HeaderSiteLogo color={'white'} />
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
