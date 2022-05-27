import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUsersRectangle, faFileImage, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import React from 'react';

import { COLOR } from 'styles/Constants';
import * as H from 'styles/pages/Home.styles';

export default function SectionWorkflow() {
  return (
    <H.WorkflowSection>
      <H.WorkflowContainer maxWidth={700}>
        <Step heading={'Step 1'} icon={faUsersRectangle}>
          Supply a full list of your guests names to generate invitations for.
        </Step>
        <Step heading={'Step 2'} icon={faFileImage}>
          Select your base invitation image as the template.
        </Step>
        <Step heading={'Step 3'} icon={faCrosshairs} noTrailingRule={true}>
          Use the editor to position and apply styling to each name.
        </Step>
      </H.WorkflowContainer>
    </H.WorkflowSection>
  );
}

function Step({ heading, noTrailingRule, icon, children }: StepProps) {
  return (
    <H.WorkflowStep>
      <H.StepCaptionWrapper>
        <FontAwesomeIcon
          icon={icon}
          size={'10x'}
          color={COLOR.PRIMARY_4_DARK}
        />
        <H.StepCaption>
          <H.StepCaptionHeading>{heading}</H.StepCaptionHeading>
          <H.StepCaptionText>{children}</H.StepCaptionText>
        </H.StepCaption>
      </H.StepCaptionWrapper>
      <H.HorizontalRule visible={!noTrailingRule} />
    </H.WorkflowStep>
  );
}

interface StepProps {
  icon: IconProp;
  heading: string;
  noTrailingRule?: boolean;
  children?: ReactNode;
}
