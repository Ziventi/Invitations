import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Hyperlink from 'components/hyperlink';
import type { RootState } from 'constants/reducers';
import ImageSelect from 'fragments/design/setup/ImageSelect';
import NamesList from 'fragments/design/setup/NamesList';
import * as Global from 'styles/Components.styles';
import { Default as DS } from 'styles/pages/design/DesignSetup.styles';

const DesignSetupPage: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const appState = useSelector((state: RootState) => state);

  // Fast-forward to step two if url hash indicates and names list is already in memory.
  useEffect(() => {
    if (location.hash === '#2' && appState.namesList.length) {
      setCurrentStep(1);
    }
  }, [appState.namesList]);

  return (
    <DS.Page>
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
      <Hyperlink href={'/'}>
        <DS.SiteLogo />
      </Hyperlink>
      <DS.Carousel currentStep={currentStep}>
        <NamesList
          visible={currentStep === 0}
          setCurrentStep={setCurrentStep}
        />
        <ImageSelect
          visible={currentStep === 1}
          setCurrentStep={setCurrentStep}
        />
      </DS.Carousel>
    </DS.Page>
  );
};

export default DesignSetupPage;
