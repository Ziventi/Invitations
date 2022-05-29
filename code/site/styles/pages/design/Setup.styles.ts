import { transparentize } from 'polished';
import styled from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

export const Default = {
  Main: styled.main`
    color: ${COLOR.WHITE};
    position: relative;
  `,
  Background: styled.img`
    filter: blur(4px);
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: -1;
  `,
  Container: styled.div`
    flex: 1 1 auto;
  `,
  Footer: styled.footer`
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 1.5em;
    position: sticky;
  `,
  FooterLink: styled(Global.Link)`
    font-size: 1em;
  `,
};

const Section = styled.section`
  display: flex;
  height: 100vh;
  justify-content: center;
  padding: 2em 3em;
`;

export const NamesList = {
  Section: styled(Section)`
    background-color: ${COLOR.WORKFLOW};
  `,
  SectionNamesContainer: styled(Global.Container)`
    display: flex;
    gap: 2em;
  `,
  NamesPartOne: styled.section`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  `,
  NamesPartTwo: styled.section`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  `,
  Heading: styled.h2`
    font-size: 3em;
    margin: 0.2em 0;
  `,
  Text: styled.p`
    font-size: 1.8em;
    line-height: 150%;
    max-width: 700px;
  `,
  NameListInput: styled.textarea`
    background-color: transparent;
    border: none;
    border-bottom: 1px solid ${COLOR.WHITE};
    color: ${COLOR.WHITE};
    font-size: 20px;
    line-height: 1.5;
    max-width: 100%;
    min-width: 350px;
    padding: 0.5em;
  `,
  NameCount: styled.small`
    display: block;
  `,
};

export const ImageSelection = {
  Section: styled(Section)`
    background-color: ${transparentize(0.2, COLOR.BLACK)};
  `,
  FileSelector: styled.div`
    margin: 1.5em 0;
  `,
  ImagePreview: styled.figure`
    height: 100%;
    max-height: 450px;
    padding: 2em;
    position: relative;
    width: 100%;
  `,
};
