import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from 'constants/reducers';
import ImageSelect from 'fragments/design/setup/ImageSelect';
import NamesList from 'fragments/design/setup/NamesList';
import * as Global from 'styles/Components.styles';
import { Default as DS } from 'styles/pages/design/DesignSetup.styles';

const STEPS = [NamesList, ImageSelect];

const DesignSetupPage: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const appState = useSelector((state: RootState) => state);
  const router = useRouter();

  // Fast-forward to step two if url hash indicates and names list is already in memory.
  useEffect(() => {
    if (location.hash === '#2' && appState.namesList.length) {
      setCurrentStep(1);
    }
  }, [appState.namesList]);

  // Push hash when the current step changes.
  useEffect(() => {
    if (currentStep === 0 && location.hash !== '#1') {
      void router.replace('#1');
    } else if (currentStep === 1 && location.hash !== '#2') {
      void router.replace('#2');
    }
  }, [router, currentStep]);

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
