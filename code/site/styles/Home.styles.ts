import styled from 'styled-components';

import { Button, COLOR, Container } from './Library';

export const HomeMain = styled.main`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  position: relative;
`;

export const Cover = styled.section`
  align-items: center;
  background-color: ${COLOR.PRIMARY_1_DARK};
  color: ${COLOR.WHITE};
  display: flex;
  height: 750px;
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

export const CoverCaption = styled.div`
  text-align: center;
  z-index: 1;
`;

export const CoverCaptionHeading = styled.h1`
  font-size: 40px;
  margin: 0;
  max-width: 600px;
  text-align: center;
`;

export const CoverButton = styled(Button)`
  box-shadow: 0 0 3px 0 ${COLOR.BLACK};
  font-size: 20px;
  margin: 1em 0;
  min-width: 200px;
`;

export const WorkflowSection = styled.section`
  background-color: ${COLOR.PRIMARY_1_DARK};
  display: flex;
  justify-content: center;
  padding: 2em;
`;

export const WorkflowContainer = styled(Container)`
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

export const HorizontalRule = styled.hr`
  border: 1.5px solid ${COLOR.PRIMARY_4_DARK};
  margin: 2em 0 0;
  width: 100%;
`;

// export const PricingSection = styled.section`
//   background-color: ${COLOR.PRIMARY_4_DARK};
//   height: 550px;
//   margin-top: -1px;
// `;

// export const Wave = styled.section`
//   background: $bg;
//   position: absolute;
//   width: 100%;

//   rect {
//     fill: $fill;
//   }
// `;
