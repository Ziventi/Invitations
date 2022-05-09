import React from 'react';

import ZiventiLogo from 'components/logo';

export default function Header() {
  return (
    <header className={'app'}>
      <ZiventiLogo
        color={'white'}
        layout={'fill'}
        objectFit={'contain'}
        width={100}
      />
      <nav>
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
    </header>
  );
}
