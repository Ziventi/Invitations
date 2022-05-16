import React from 'react';
import styled from 'styled-components';

export default function Main() {
  return (
    <Page>
      <Container>
        <G.Text>This invitation is addressed to:</G.Text>
        <GuestName>Adebusola Emiola</GuestName>
        <EventTitleContainer>
          <EventTitle>Ade&#39;s Private Dining</EventTitle>
        </EventTitleContainer>
        <Location>
          <G.Text>40 Impala Drive</G.Text>
          <G.Text>The greatest</G.Text>
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

const Page = styled.div`
  /* background-image: repeating-linear-gradient(#84cae7, #4862ff); */
  background-image: repeating-linear-gradient(#414344, #111010);
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
  height: 100%;
`;

const GuestName = styled(G.Heading)`
  font-size: 85px;
  max-width: 80%;
`;

const EventTitleContainer = styled.div`
  align-items: center;
  /* background-color: rgb(128, 128, 128, 0.6); */
  background-image: radial-gradient(
    rgb(128, 128, 128, 0.6),
    rgb(128, 128, 128, 0)
  );
  border-radius: 50%;
  box-shadow: 0 0 5px 0 #fff;
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
  padding: 1em 0;
  text-transform: uppercase;
  font-size: 30px;
`;
