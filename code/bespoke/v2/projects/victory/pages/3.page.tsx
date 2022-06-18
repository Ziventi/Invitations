import React from 'react';

import * as App from '../styles/_App.styles';
import * as Pages from '../styles/Pages.styles';

export default function ThirdPage() {
  return (
    <App.Content rowGap={2.8}>
      <Pages.Heading>
        Day 2:
        <br />
        Laser Tag
      </Pages.Heading>
      <App.Block>
        <Pages.Subheading>Date & Time:</Pages.Subheading>
        <Pages.Text>3:00pm Arrival Time</Pages.Text>
        <Pages.Text>Tuesday 2nd August 2022</Pages.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Location:</Pages.Subheading>
        <App.Hyperlink
          href={'https://goo.gl/maps/jnxQKjehCPp3VoSeA'}
          target={'_blank'}
          rel={'noopener noreferrer'}>
          <Pages.Text>Bunker 51</Pages.Text>
          <Pages.Text>3 Herringham Road</Pages.Text>
          <Pages.Text>London, SE7 8NJ</Pages.Text>
        </App.Hyperlink>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Dress Code:</Pages.Subheading>
        <Pages.Text>Casual, but no opened-toe shoes</Pages.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Price:</Pages.Subheading>
        <Pages.Text>£35 per person (for a 2-hour game)</Pages.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Payment Details:</Pages.Subheading>
        <Pages.Text>Miss Victory Azekumen</Pages.Text>
        <Pages.Text>Sort Code: 40-15-05</Pages.Text>
        <Pages.Text>Account No.: 32486946</Pages.Text>
        <Pages.SmallText>
          (Use your full name as the payment reference.)
        </Pages.SmallText>
      </App.Block>
    </App.Content>
  );
}
