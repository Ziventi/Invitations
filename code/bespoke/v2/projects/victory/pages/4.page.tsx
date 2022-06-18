import React from 'react';

import * as App from '../styles/_App.styles';
import * as Pages from '../styles/Pages.styles';

export default function FourthPage() {
  return (
    <App.Content rowGap={4.5}>
      <Pages.Heading>Infomation</Pages.Heading>
      <App.Block>
        <Pages.Subheading>Disclaimer:</Pages.Subheading>
        <App.Text>
          Ade doesn&#39;t know the details of her birthday plans so DO NOT share
          ANYTHING with her.
        </App.Text>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Contact Details:</Pages.Subheading>
        <App.Text>
          If you have any questions, tap on any of the following numbers to
          call:
        </App.Text>
        <Pages.Table>
          {[
            ['Janelle', '07482315441'],
            ['Victory', '07710017877'],
            ['Marian', '07455133466'],
          ].map(([name, number]) => {
            return (
              <React.Fragment key={name}>
                <Pages.ContactEmoji>&#128242;</Pages.ContactEmoji>
                <span>{name}: </span>
                <App.Hyperlink href={`tel:${number}`}>{number}</App.Hyperlink>
              </React.Fragment>
            );
          })}
        </Pages.Table>
      </App.Block>
      <App.Block>
        <Pages.Subheading>Finally...</Pages.Subheading>
        <App.Text>
          Please ensure you make your payments as early as possible and before
          <b> Monday 4th July</b>.
        </App.Text>
        <App.Text>
          Ensure you arrive to both events on time.
          <br />
          No African timing.
        </App.Text>
      </App.Block>
    </App.Content>
  );
}
