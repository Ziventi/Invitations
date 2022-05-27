import styled, { css } from 'styled-components';

import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';

const StepCaptionWrapper = styled.div`
  display: flex;
`;

export default {
  Main: styled.main`
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    position: relative;
  `,
  Hero: styled.section`
    align-items: center;
    background-color: ${COLOR.PRIMARY_1_NEUTRAL};
    color: ${COLOR.WHITE};
    display: flex;
    height: 100vh;
    justify-content: center;
    position: relative;
  `,
  VideoWrapper: styled.figure`
    background-color: #433a37;
    clip-path: url(#wave);
    height: 100%;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  Video: styled.video`
    filter: blur(4px);
    height: 100%;
    min-width: 100%;
    object-fit: cover;
    opacity: 0.25;
    z-index: 0;
  `,
  HeroCaption: styled.div`
    text-align: center;
    z-index: 1;
  `,
  HeroCaptionHeading: styled.h1`
    font-size: 40px;
    margin: 0;
    max-width: 600px;
    text-align: center;
  `,
  HeroButton: styled(Global.Button)`
    box-shadow: 0 0 3px 0 ${COLOR.BLACK};
    font-size: 20px;
    margin: 1em 0;
    min-width: 200px;
  `,
  WorkflowSection: styled.section`
    background-color: ${COLOR.PRIMARY_1_NEUTRAL};
    display: flex;
    justify-content: center;
    padding: 2em;
  `,

  WorkflowContainer: styled(Global.Container)`
    flex-direction: column;
  `,
  WorkflowStep: styled.article`
    align-items: center;
    padding: 2em 0 1em;
    width: 100%;

    &:nth-child(2) ${StepCaptionWrapper} {
      flex-direction: row-reverse;
      text-align: right;
    }
  `,
  StepCaptionWrapper,
  StepCaption: styled.div`
    margin: 1em 2.5em;
  `,
  StepCaptionHeading: styled.h3`
    font-size: 2em;
    margin: 0;
    max-width: 500px;
    width: 100%;
  `,
  StepCaptionText: styled.h3`
    font-size: 1.5em;
    line-height: 150%;
    margin: 0.5em 0;
    max-width: 400px;
    width: 100%;
  `,
  HorizontalRule: styled.hr<HorizontalRuleProps>`
    ${({ visible }) =>
      visible &&
      css`
        display: none;
      `}
    border: 1.5px solid ${COLOR.PRIMARY_4_DARK};
    margin: 2em 0 0;
    width: 100%;
  `,
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
};

interface HorizontalRuleProps {
  visible: boolean;
}
