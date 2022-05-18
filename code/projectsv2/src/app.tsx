import { lighten, darken, transparentize } from 'polished';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import pattern from '../public/pattern.svg';

export default function Main() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  return (
    <Page>
      <Background>
        <Container>
          <Fragment>
            <G.SmallText>An invitation addressed to:</G.SmallText>
            <GuestName>{name}</GuestName>
          </Fragment>
          <G.SmallText>You are invited to celebrate at:</G.SmallText>
          <EventTitleContainer>
            <EventTitle>Ade&#39;s Private Dinner</EventTitle>
          </EventTitleContainer>
          <Location>
            <G.Text>7:00pm, 1st August 2022</G.Text>
            <a
              href={'https://goo.gl/maps/mD7Y3YDw1rSEUGk16'}
              target={'_blank'}
              rel={'noopener noreferrer'}>
              <G.Text>Quaglino&#39;s, 16 Bury Street</G.Text>
              <G.Text>London, SW1Y 6AJ</G.Text>
            </a>
          </Location>
          <DressCode>
            <G.Text>Dress Code: Smart Elegant</G.Text>
            <G.Text>(No Trainers!)</G.Text>
          </DressCode>
        </Container>
      </Background>
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
    font-size: 25px;
    line-height: 125%;
    margin: 0;
  `,
  SmallText: styled.small`
    font-size: 22px;
    line-height: 125%;
    margin: 0;
  `,
};

const COLOR = {
  PRIMARY_1: '#fdfcf0',
  PRIMARY_1_DARK: '#16074c',
  BORDER_1: '#fff6c6',
  BORDER_2: '#f4ee83',
};

const Page = styled.div`
  background-color: ${COLOR.PRIMARY_1_DARK};
  background-image: url(${pattern});
  background-size: cover;
  height: 297mm;
  overflow-x: hidden;
  position: relative;
  width: 210mm;
`;

const Background = styled.main`
  background-image: linear-gradient(
    to bottom,
    ${transparentize(0.1, lighten(0.25, COLOR.PRIMARY_1_DARK))},
    ${transparentize(0.12, darken(0.25, COLOR.PRIMARY_1_DARK))}
  );
  color: ${COLOR.PRIMARY_1};
  height: 100%;
  padding: 2.5em;
  width: 100%;
`;

const Container = styled.main`
  align-items: center;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    to right top,
    ${COLOR.BORDER_1} 0%,
    ${COLOR.BORDER_1} 47%,
    rgba(213, 58, 157, 0) 47%,
    rgba(213, 58, 157, 0) 52%,
    ${COLOR.BORDER_2} 52%,
    ${COLOR.BORDER_2} 100%
  );
  border-style: solid;
  border-width: 3px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 3em;
`;

const GuestName = styled(G.Heading)`
  font-size: 110px;
  margin: 0.4em 0;
  max-width: 80%;
`;

const Fragment = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 100%;
`;

const EventTitleContainer = styled.div`
  background-image: radial-gradient(
    #fff 50%,
    ${transparentize(0.8, COLOR.PRIMARY_1)}
  );
  border-radius: 50%;
  box-shadow: 0 1px 10px 0 #fff;
  display: flex;
  filter: opacity(1);
  height: fit-content;
  justify-content: center;
  width: 420px;
  margin: 2em 0;
  padding: 1em;
`;

const EventTitle = styled(G.Heading)`
  font-size: 100px;
  color: ${COLOR.PRIMARY_1_DARK};
`;

const Location = styled.section`
  padding: 1em 0;
  text-align: center;
`;

const DressCode = styled.section`
  padding: 1.5em 0;
  text-align: center;
`;
