import { transparentize } from 'polished';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export default function Main() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  return (
    <Page>
      <Container>
        <G.Text>This invitation is addressed to:</G.Text>
        <GuestName id={'name'}>{name}</GuestName>
        <G.Text>You are invited to:</G.Text>
        <EventTitleContainer>
          <EventTitle>Ade&#39;s Private Dining</EventTitle>
        </EventTitleContainer>
        <Location>
          <G.Text>From 7:00pm</G.Text>
          <G.Text>40 Impala Drive</G.Text>
          <G.Text>Cambridge</G.Text>
          <G.Text>Cambridgeshire</G.Text>
          <G.Text>CB1 9XL</G.Text>
        </Location>
      </Container>
    </Page>
  );
}

const G = {
  Heading: styled.h1`
    font-family: 'Beau Rivage', cursive;
    letter-spacing: 3px;
    line-height: 100%;
    margin: 0.5em 0;
    text-align: center;
  `,
  Text: styled.p`
    color: #fff;
    font-size: 25px;
    line-height: 125%;
    margin: 0;
  `,
};

const COLOR = {
  // PRIMARY_1: '#414344',
  // PRIMARY_1_DARK: '#111010',
  // PRIMARY_1: '#84cae7',
  // PRIMARY_1_DARK: '#4862ff',
  PRIMARY_1: '#024567',
  PRIMARY_1_DARK: '#0c193c',
};

const Page = styled.div`
  background-image: repeating-linear-gradient(
    ${COLOR.PRIMARY_1},
    ${COLOR.PRIMARY_1_DARK}
  );
  color: #fff;
  height: 297mm;
  overflow-x: hidden;
  padding: 3.5em;
  position: relative;
  width: 210mm;
`;

const Container = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`;

const GuestName = styled(G.Heading)`
  font-size: 85px;
  max-width: 80%;
`;

const EventTitleContainer = styled.div`
  align-items: center;
  background-image: radial-gradient(
    ${transparentize(0, COLOR.PRIMARY_1)},
    ${transparentize(0.8, COLOR.PRIMARY_1)}
  );
  border-radius: 50%;
  /* box-shadow: 0 1px 5px 0 #fff; */
  display: flex;
  height: 400px;
  justify-content: center;
  position: relative;
  width: 400px;
`;

const EventTitle = styled(G.Heading)`
  font-size: 95px;
  position: absolute;
`;

const Location = styled.section`
  font-size: 35px;
  padding: 1em 0;
  text-align: center;
  text-transform: uppercase;
`;
