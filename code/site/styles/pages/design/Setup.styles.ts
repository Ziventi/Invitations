import { transparentize } from 'polished';
import styled from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

const Section = styled.section`
  padding: 2em 3em;
`;

export default {
  Main: styled.main`
    color: ${COLOR.WHITE};
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    width: 100%;
  `,
  Background: styled.img`
    filter: blur(4px);
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: -1;
  `,
  Container: styled.div`
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(2, 50%);
  `,
  SectionNames: styled(Section)`
    background-color: ${transparentize(0.1, COLOR.PRIMARY_3_DARK)};
  `,
  SectionImage: styled(Section)`
    background-color: ${transparentize(0.2, COLOR.BLACK)};
  `,
  NameListInput: styled.textarea`
    border-radius: 10px;
    border-style: none;
    box-shadow: 0 0 2px 0 ${COLOR.BLACK};
    font-size: 20px;
    line-height: 1.5;
    padding: 0.5em;
    width: 100%;
  `,
  Text: styled.p`
    line-height: 150%;
  `,
  Footer: styled.footer`
    bottom: 0;
    display: flex;
    flex: 0 0 70px;
    justify-content: space-between;
    padding: 0 1.5em 1em;
  `,
  FooterButton: styled(Global.Button).attrs({ bgColor: COLOR.PRIMARY_4 })`
    box-shadow: 0 0 3px 0 ${COLOR.BLACK};
    font-size: 20px;
    min-width: 200px;
    padding: 0.5em;
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
