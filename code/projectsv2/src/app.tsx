import { darken, lighten, transparentize } from 'polished';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { css, DefaultTheme, ThemeProvider } from 'styled-components';

import flowers from '../public/flowers.png';
import pattern from '../public/pattern2.jpeg';

const theme1: DefaultTheme = {
  primary: '#16074c',
  primaryLight: transparentize(0.1, lighten(0.25, '#16074c')),
  primaryDark: transparentize(0.12, darken(0.25, '#16074c')),
  secondary: '#fdfcf0',
  border1: '#fff6c6',
  border2: '#f4ee83',
  borderWidth: '3px',
  textColor: '#fff',
  eventTitleTextColor: '#16074c',
  eventTitleFontSize: '100px',
  addressFontWeight: 'normal',
};
const theme2: DefaultTheme = {
  primary: '#fffce1',
  primaryLight: '#fefdf4',
  primaryDark: '#fffcdd',
  secondary: '#16074c',
  border1: '#8c3fab',
  border2: '#5c0f7a',
  borderWidth: '5px',
  textColor: '#16074c',
  eventTitleTextColor: '#16074c',
  eventTitleFontSize: '120px',
  addressFontWeight: 'bold',
};

export default function Main() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  return (
    <ThemeProvider theme={theme2}>
      <Page>
        <Background />
        <Container>
          <Flower position={'top'} />
          <Fragment>
            <G.SmallText>An invitation addressed to:</G.SmallText>
            <GuestName>{name}</GuestName>
          </Fragment>
          <G.SmallText>You are invited to celebrate at:</G.SmallText>
          {/* <EventTitleContainer> */}
          <EventTitle>Adebusola&#39;s Private Dinner</EventTitle>
          {/* </EventTitleContainer> */}
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
          <Flower position={'bottom'} />
        </Container>
      </Page>
    </ThemeProvider>
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
    line-height: 145%;
    margin: 0;
  `,
  SmallText: styled.small`
    font-size: 22px;
    line-height: 125%;
    margin: 0;
  `,
};

const Page = styled.div`
  background-image: ${({ theme }) => css`linear-gradient(
    to bottom,
    ${transparentize(0.1, theme.primaryLight)},
    ${transparentize(0.12, theme.primaryDark)}
  );`};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 297mm;
  overflow-x: hidden;
  padding: 3em;
  position: relative;
  width: 210mm;
`;

const Background = styled.main`
  background-image: url(${pattern});
  background-size: 800px;
  background-repeat: repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  opacity: 0.1;
  filter: saturate(1) hue-rotate(240deg);
`;

const Container = styled.main`
  align-items: center;
  border-image-slice: 1;
  border-image-source: ${({ theme }) => css`linear-gradient(
    to right top,
    ${theme.border1} 0%,
    ${theme.border1} 45%,
    transparent 45%,
    transparent 55%,
    ${theme.border2} 55%,
    ${theme.border2} 100%
  );`};
  border-style: solid;
  border-width: ${({ theme }) => theme.borderWidth};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  padding: 3em;
  position: relative;
`;

const GuestName = styled(G.Heading)`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-size: 110px;
  margin: 0.3em 0;
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
  align-items: center;
  background-image: ${({ theme }) => css`radial-gradient(
    #fff 50%,
    ${transparentize(0.8, theme.secondary)}
  );`};
  border-radius: 50%;
  box-shadow: 0 1px 10px 0 ${({ theme }) => theme.textColor};
  display: flex;
  filter: opacity(1);
  height: 400px;
  justify-content: center;
  width: fit-content;
  margin: 2em 0;
  padding: 1em;
`;

const EventTitle = styled(G.Heading)`
  color: ${({ theme }) => theme.eventTitleTextColor};
  font-size: ${({ theme }) => theme.eventTitleFontSize};
  line-height: 95%;
  margin: 0.4em 0;
`;

const Location = styled.section`
  font-weight: ${({ theme }) => theme.addressFontWeight};
  padding: 0.5em 0 2em;
  text-align: center;

  a {
    color: ${({ theme }) => theme.textColor};
  }

  * {
    font-size: 25px;
  }
`;

const DressCode = styled.section`
  text-align: center;
`;

const Flower = styled.img.attrs({
  src: flowers,
})<{ position: 'top' | 'bottom' }>`
  position: absolute;
  width: 240px;
  filter: saturate(1.4);
  ${(props) =>
    props.position === 'top'
      ? css`
          transform: rotate(110deg);
          top: 0;
          left: 0;
          margin-top: -1em;
          margin-left: -3.5em;
        `
      : css`
          transform: rotate(-70deg);
          bottom: 0;
          right: 0;
          margin-bottom: -1em;
          margin-right: -3.5em;
        `}
`;
