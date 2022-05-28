import { transparentize } from 'polished';
import styled from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

export const Main = styled.main`
  color: ${COLOR.WHITE};
  position: relative;
`;

export const Background = styled.img`
  filter: blur(4px);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -1;
`;

export const Container = styled.div`
  flex: 1 1 auto;
`;

const Section = styled.section`
  display: flex;
  height: 100vh;
  justify-content: center;
  padding: 2em 3em;
`;

export const SectionNames = styled(Section)`
  background-color: ${COLOR.WORKFLOW};
`;

export const SectionImage = styled(Section)`
  background-color: ${transparentize(0.2, COLOR.BLACK)};
`;

export const SectionNamesContainer = styled(Global.Container)`
  display: flex;
  gap: 2em;
`;

export const NamesPartOne = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

export const NamesPartTwo = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

export const Heading = styled.h2`
  font-size: 3em;
  margin: 0.2em 0;
`;

export const Text = styled.p`
  font-size: 1.8em;
  line-height: 150%;
  max-width: 700px;
`;

export const NameListInput = styled.textarea`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${COLOR.WHITE};
  color: ${COLOR.WHITE};
  font-size: 20px;
  line-height: 1.5;
  max-width: 100%;
  min-width: 350px;
  padding: 0.5em;
`;

export const NameCount = styled.small`
  display: block;
`;

export const Footer = styled.footer`
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 1.5em;
  position: sticky;
`;

export const FooterLink = styled(Global.Link)`
  font-size: 1em;
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
