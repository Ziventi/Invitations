import styled, { css } from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

export const Page = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

export const Main = styled.main``;

export const Hero = styled.section`
  align-items: center;
  background-color: ${COLOR.PRIMARY_1_NEUTRAL};
  color: ${COLOR.WHITE};
  display: flex;
  height: 100vh;
  justify-content: center;
  position: relative;
`;

export const VideoWrapper = styled.figure`
  background-color: #433a37;
  clip-path: url(#wave);
  height: 100%;
  overflow: hidden;
  position: absolute;
  width: 100%;
`;

export const Video = styled.video`
  filter: blur(4px);
  height: 100%;
  min-width: 100%;
  object-fit: cover;
  opacity: 0.25;
  z-index: 0;
`;

export const HeroCaption = styled.div`
  text-align: center;
  z-index: 1;
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
  background-color: ${COLOR.PRIMARY_1_NEUTRAL};
  display: flex;
  justify-content: center;
  padding: 2em;
`;

export const WorkflowContainer = styled(Global.Container)`
  flex-direction: column;
`;

export const StepCaptionWrapper = styled.div`
  display: flex;
`;

export const WorkflowStep = styled.article`
  align-items: center;
  padding: 2em 0 1em;
  width: 100%;

  &:nth-child(2) ${StepCaptionWrapper} {
    flex-direction: row-reverse;
    text-align: right;
  }
`;

export const StepCaption = styled.div`
  margin: 1em 2.5em;
`;

export const StepCaptionHeading = styled.h3`
  font-size: 2em;
  margin: 0;
  max-width: 500px;
  width: 100%;
`;

export const StepCaptionText = styled.h3`
  font-size: 1.5em;
  line-height: 150%;
  margin: 0.5em 0;
  max-width: 400px;
  width: 100%;
`;

export const HorizontalRule = styled.hr<HorizontalRuleProps>`
  ${({ visible }) =>
    visible &&
    css`
      display: none;
    `}
  border: 1.5px solid ${COLOR.PRIMARY_4_DARK};
  margin: 2em 0 0;
  width: 100%;
`;

interface HorizontalRuleProps {
  visible: boolean;
}
