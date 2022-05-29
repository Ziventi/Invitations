import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';

import FontIcon from 'components/icon';
import type {
  RootState
} from 'constants/reducers';
import ImageSelect from 'fragments/design/setup/ImageSelect';
import NamesList from 'fragments/design/setup/NamesList';
import { Default as DS } from 'styles/pages/design/Setup.styles';

const DesignSetupPage: NextPage = () => {
  const appState = useSelector((state: RootState) => state);
  return (
    <DS.Main>
      <DS.Background src={'/cover.jpg'} />
      <DS.Container>
        <NamesList />
        <ImageSelect />
      </DS.Container>
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
