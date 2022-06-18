import styled from 'styled-components';

import * as App from './_App.styles';

export const Heading = styled(App.Heading)`
  font-size: 90px;
  line-height: 90%;
  margin: 0;
`;

export const Subheading = styled.h2`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-size: 24px;
  letter-spacing: -1px;
  line-height: 100%;
  margin: 0 0 5px;
  text-align: left;
`;

export const Text = styled(App.Text)`
  font-size: 23px;
`;

export const SmallText = styled(App.SmallText)`
  font-size: 20px;
  font-weight: 600;
  margin-top: 0.5em;
`;

export const Block = styled(App.Block)`
  align-items: center;
`;

export const Table = styled.div`
  column-gap: 0.3em;
  display: grid;
  font-size: 25px;
  grid-template-columns: auto auto auto;
  letter-spacing: -0.5px;
  margin-top: 0.5em;
`;

export const GuestName = styled(App.Heading)`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-size: 110px;
  max-width: 80%;
  text-align: center;
`;

export const EventTitle = styled(App.Heading)`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-size: 120px;
  line-height: 95%;
  width: 100%;

  * {
    font-family: 'Beau Rivage', cursive;
  }

  span {
    letter-spacing: -9px;
  }

  sup {
    display: inline-block;
    font-size: 70px;
    margin-top: -1em;
  }
`;

export const EventSmallText = styled(App.Heading)`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-size: 55px;
  letter-spacing: 0;
  line-height: 95%;
  margin: -0.4em 0 0;
`;

export const DateText = styled(App.Text)`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-weight: bold;
  text-align: center;
`;

export const DressCode = styled.section`
  text-align: center;
`;

export const ContactEmoji = styled.span`
  margin-right: 0.4em;
`;

export const Menu = styled.img`
  border-radius: 10px;
  outline: 1px solid #ccc;
  width: 80%;
`;
