import React from 'react';
import { useSearchParams } from 'react-router-dom';

import * as App from '../styles/_App.styles';
import * as Pages from '../styles/Pages.styles';

export default function FirstPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  return (
    <App.Content rowGap={5}>
      <Pages.Block rowGap={2}>
        <App.SmallText>An invitation addressed to:</App.SmallText>
        <Pages.GuestName>{name}</Pages.GuestName>
      </Pages.Block>
      <Pages.Block rowGap={2}>
        <App.SmallText>You are invited to celebrate at:</App.SmallText>
        <Pages.EventTitle>
          Adebusola&#39;s <span>24</span>
          <sup>th</sup> Birthday
        </Pages.EventTitle>
      </Pages.Block>
      <div>
        <Pages.DateText>Monday 1st & Tuesday 2nd</Pages.DateText>
        <Pages.DateText>August 2022</Pages.DateText>
      </div>
    </App.Content>
  );
}
