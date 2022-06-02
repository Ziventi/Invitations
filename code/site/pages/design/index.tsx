import type { NextPage } from 'next';
import React, { useState } from 'react';

import ImageSelect from 'fragments/design/setup/ImageSelect';
import NamesList from 'fragments/design/setup/NamesList';
import * as Global from 'styles/Global';
import { Default as DS } from 'styles/pages/design/DesignSetup.styles';

const STEPS = [NamesList, ImageSelect];

const DesignSetupPage: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <DS.Main>
      <Global.BackgroundVideo
        src={`/setup.mp4`}
        poster={'/setup.jpg'}
        autoPlay={true}
        controls={false}
        loop={true}
        muted={true}
        onContextMenu={(e) => e.preventDefault()}
      />
      <DS.BackgroundMask />
      <DS.SiteLogo />
      <DS.Section currentStep={currentStep}>
        {STEPS.map((Step, key) => {
          return (
            <Step
              key={key}
              visible={key === currentStep}
              setCurrentStep={setCurrentStep}
            />
          );
        })}
      </DS.Section>
    </DS.Main>
  );
};

export default DesignSetupPage;
