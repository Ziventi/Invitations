import React from 'react';

import { Container } from 'styles/Library';

export default function Footer() {
  return (
    <footer className={'app'}>
      <Container>
        <nav className={'footer'}>
          <menu>
            <li>
              <a>Privacy Policy</a>
            </li>
            <li>
              <a>Cookie Policy</a>
            </li>
            <li>
              <a>Terms of Service</a>
            </li>
          </menu>
        </nav>
      </Container>
    </footer>
  );
}
