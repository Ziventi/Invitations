import React from 'react';

import Hyperlink from 'components/hyperlink';
import * as Global from 'styles/Components.styles';
import App from 'styles/pages/App.styles';

export default function Footer() {
  return (
    <App.Footer>
      <Global.Container>
        <Global.Navigation>
          <menu>
            <li>
              <Hyperlink href={'#'}>Privacy Policy</Hyperlink>
            </li>
            <li>
              <Hyperlink href={'#'}>Cookie Policy</Hyperlink>
            </li>
            <li>
              <Hyperlink href={'#'}>Terms of Service</Hyperlink>
            </li>
          </menu>
        </Global.Navigation>
      </Global.Container>
    </App.Footer>
  );
}
