import React from 'react';

import * as Global from 'styles/Global';
import App from 'styles/pages/App.styles';

export default function Footer() {
  return (
    <App.Footer>
      <Global.Container>
        <Global.Navigation>
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
        </Global.Navigation>
      </Global.Container>
    </App.Footer>
  );
}
