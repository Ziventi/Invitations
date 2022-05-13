import React from 'react';

import { Footer as IFooter } from 'styles/App.styles';
import { Container, Navigation } from 'styles/Library';

export default function Footer() {
  return (
    <IFooter>
      <Container>
        <Navigation>
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
        </Navigation>
      </Container>
    </IFooter>
  );
}
