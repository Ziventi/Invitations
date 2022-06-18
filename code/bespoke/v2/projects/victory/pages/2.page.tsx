import React from 'react';

import * as App from '../styles/_App.styles';
import * as Pages from '../styles/Pages.styles';

export default function SecondPage() {
  return (
    <App.Content rowGap={2.5}>
      <Pages.Heading>
        Day 1:
        <br />
        Private Dinner
      </Pages.Heading>
      <App.Block>
        <Pages.Subheading>Date & Time:</Pages.Subheading>
        <Pages.Text>7:30pm Arrival Time</Pages.Text>
        <Pages.Text>Monday 1st August 2022</Pages.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Location:</Pages.Subheading>
        <App.Hyperlink
          href={'https://g.page/34Mayfair?share'}
          target={'_blank'}
          rel={'noopener noreferrer'}>
          <Pages.Text>34 Mayfair</Pages.Text>
          <Pages.Text>34 Grosvenor Square</Pages.Text>
          <Pages.Text>London, W1K 2HD</Pages.Text>
        </App.Hyperlink>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Dress Code:</Pages.Subheading>
        <Pages.Text>Formal wear (no trainers, no jeans!)</Pages.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Price & Menu:</Pages.Subheading>
        <Pages.Text>
          £68 per person. Please find the menu at the bottom of this invitation.
        </Pages.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Payment Details:</Pages.Subheading>
        <Pages.Text>Miss Jane E Ekwunife</Pages.Text>
        <Pages.Text>Sort Code: 11-08-24</Pages.Text>
        <Pages.Text>Account No.: 11881767</Pages.Text>
        <Pages.SmallText>
          (Use your full name as the payment reference.)
        </Pages.SmallText>
      </App.Block>
    </App.Content>
  );
}
