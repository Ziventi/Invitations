import { transparentize } from 'polished';
import styled from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

export const Main = styled.main`
  color: ${COLOR.WHITE};
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  width: 100%;
`;

export const Background = styled.img`
  filter: blur(4px);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -1;
`;

export const Container = styled.div`
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: repeat(2, 50%);
`;

const Section = styled.section`
  padding: 2em 3em;
`;

export const SectionNames = styled(Section)`
  background-color: ${transparentize(0.1, COLOR.PRIMARY_3_DARK)};
`;

export const SectionImage = styled(Section)`
  background-color: ${transparentize(0.2, COLOR.BLACK)};
`;

export const NameListInput = styled.textarea`
  border-radius: 10px;
  border-style: none;
  box-shadow: 0 0 2px 0 ${COLOR.BLACK};
  font-size: 20px;
  line-height: 1.5;
  padding: 0.5em;
  width: 100%;
`;

export const Text = styled.p`
  line-height: 150%;
`;

export const Footer = styled.footer`
  bottom: 0;
  display: flex;
  flex: 0 0 70px;
  justify-content: space-between;
  padding: 0 1.5em 1em;
`;

export const FooterButton = styled(Global.Button).attrs({
  bgColor: COLOR.PRIMARY_4_NEUTRAL,
})`
  box-shadow: 0 0 3px 0 ${COLOR.BLACK};
  font-size: 20px;
  min-width: 200px;
  padding: 0.5em;
`;

export const FileSelector = styled.div`
  margin: 1.5em 0;
`;

export const ImagePreview = styled.figure`
  height: 100%;
  max-height: 450px;
  padding: 2em;
  position: relative;
  width: 100%;
`;
