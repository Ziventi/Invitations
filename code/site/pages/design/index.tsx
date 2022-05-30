import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import React from 'react';

import FontIcon from 'components/icon';
import ImageSelect from 'fragments/design/setup/ImageSelect';
import NamesList from 'fragments/design/setup/NamesList';
import * as Global from 'styles/Global';
import { Default as DS } from 'styles/pages/design/Setup.styles';

const DesignSetupPage: NextPage = () => {
  return (
    <DS.Main>
      <DS.Body />
      <Global.BackgroundVideo
          src={`/setup.mp4`}
          poster={'/setup.jpg'}
          autoPlay={true}
          controls={false}
          loop={true}
          muted={true}
          onContextMenu={(e) => e.preventDefault()}
        />
      <NamesList />
      <ImageSelect />
      <DS.Footer>
        <DS.FooterLink href={'/'}>
          <span>
            <FontIcon icon={faChevronLeft} space={true} size={'1x'} />
            Back to Home
          </span>
        </DS.FooterLink>
      </DS.Footer>
    </DS.Main>
  );
};

export default DesignSetupPage;
