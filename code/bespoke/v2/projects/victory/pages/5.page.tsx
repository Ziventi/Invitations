import React from 'react';

import menu1 from '../assets/menu1.png';
import menu2 from '../assets/menu2.png';
import * as App from '../styles/_App.styles';
import * as Pages from '../styles/Pages.styles';

export default function FifthPage() {
  return (
    <App.Content rowGap={1}>
      <Pages.Heading style={{ marginBottom: '16px' }}>Menu</Pages.Heading>
      <Pages.Menu src={menu1} />
      <Pages.Menu src={menu2} />
    </App.Content>
  );
}
