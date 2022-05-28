import styled, { css } from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

export const Page = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

export const Main = styled.main`
  position: relative;
`;

export const Video = styled.video`
  filter: blur(4px);
  height: 100%;
  min-width: 100%;
  object-fit: cover;
  position: fixed;
  z-index: -1;
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
