import styled from 'styled-components';

import * as Global from 'styles/Components.styles';
import { COLOR } from 'styles/Constants.styles';

export const Page = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

export const Main = styled.main`
  position: relative;
`;

export const Hero = styled.section`
  align-items: center;
  background-color: ${COLOR.HERO};
  color: ${COLOR.WHITE};
  display: flex;
  height: 85vh;
  justify-content: center;
  position: relative;
`;

export const HeroCaption = styled.div`
  margin-top: 10vh;
  text-align: center;
  user-select: none;
`;

export const HeroCaptionHeading = styled.h1`
  font-size: 40px;
  margin: 0;
  max-width: 600px;
  text-align: center;
`;

export const HeroButton = styled(Global.Button)`
  box-shadow: 0 0 3px 0 ${COLOR.BLACK};
  font-size: 20px;
  margin: 1em 0;
  min-width: 200px;
`;

export const WorkflowSection = styled.section`
  background-color: ${COLOR.WORKFLOW};
  color: ${COLOR.WHITE};
  display: flex;
  justify-content: center;
  min-height: 80vh;
  opacity: 1;
`;
