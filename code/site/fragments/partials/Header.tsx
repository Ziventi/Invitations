import React from 'react';

import Hyperlink from 'components/hyperlink';
import App from 'styles/pages/App.styles';

export default function Header({ headerRef }: HeaderProps) {
  return (
    <App.Header ref={headerRef}>
      <App.HeaderContainer>
        <App.HeaderSiteLogo color={'white'} />
        <App.HeaderNavigation>
          <menu>
            <li>
              <Hyperlink href={'/design'}>Design</Hyperlink>
            </li>
            <li>
              <Hyperlink href={'#'}>Pricing</Hyperlink>
            </li>
            <li>
              <Hyperlink href={'#'}>Motivation</Hyperlink>
            </li>
            <li>
              <Hyperlink href={'#'}>Contact</Hyperlink>
            </li>
          </menu>
        </App.HeaderNavigation>
      </App.HeaderContainer>
    </App.Header>
  );
}

interface HeaderProps {
  headerRef?: React.RefObject<HTMLDivElement>;
}
