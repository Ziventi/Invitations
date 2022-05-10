import React from 'react';

import Container from 'components/container';
import ZiventiLogo from 'components/logo';

export default function Header() {
  return (
    <header className={'app'}>
      <Container>
        <div className={'logo-wrapper'}>
          <ZiventiLogo
            color={'white'}
            layout={'fill'}
            objectFit={'contain'}
          />
        </div>
        <nav className={'header'}>
          <menu>
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
