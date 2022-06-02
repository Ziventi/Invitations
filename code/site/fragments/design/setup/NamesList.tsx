import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FontIcon from 'components/icon';
import * as Utils from 'constants/functions/utils';
import type {
  AppDispatch,
  PageStatePayload,
  RootState,
} from 'constants/reducers';
import { updateState } from 'constants/reducers';
import type { DesignSetupStepProps } from 'constants/types';
import { COLOR } from 'styles/Constants.styles';
import {
  Default as DS,
  NamesList as NL,
} from 'styles/pages/design/DesignSetup.styles';

export default function NamesList({
  setCurrentStep,
  visible,
}: DesignSetupStepProps) {
  const appState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setAppState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  const [state, setState] = useState<NamesListState>({
    names: Utils.textFromNameList(appState.namesList),
    isModalVisible: false,
  });

  const hasNamesListed = useMemo(() => {
    return appState.namesList.length > 0;
  }, [appState.namesList]);

  /**
   * Called on change to the name list.
   * @param e The change event.
   */
  function onNameListChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setState((current) => ({ ...current, names: e.target.value }));
  }

  /**
   * Show or hide the modal.
   * @param show True if should show. False to hide.
   */
  function toggleModal(show: boolean) {
    setState((current) => ({
      ...current,
      isModalVisible: show,
    }));
  }

  /**
   * Save names list to state on confirmation.
   */
  function onConfirmClick() {
    setAppState({
      namesList: Utils.nameListFromText(state.names),
    });
    toggleModal(false);
  }

  /**
   * On cancellation from modal.
   * TODO: Only reset when modal isn't shown.
   */
  function onCancelClick() {
    setState((current) => ({
      ...current,
      names: Utils.textFromNameList(appState.namesList),
    }));
    toggleModal(false);
  }

  return (
    <DS.Step visible={visible}>
      <NL.Container id={'namelist'}>
        <DS.Partition>
          <DS.Heading>Step 1: List The Names</DS.Heading>
          <DS.Text>
            Provide the full list of your guest names to be printed on each
            template.
          </DS.Text>
          <DS.Button
            bgColor={COLOR.PRIMARY_4_NEUTRAL}
            onClick={() => toggleModal(true)}>
            Manually enter names
          </DS.Button>
        </DS.Partition>
        <DS.Partition>
          <NL.NameListContainer visible={hasNamesListed}>
            <NL.NameList>
              {appState.namesList.map((name, key) => {
                return <li key={key}>{name}</li>;
              })}
            </NL.NameList>
          </NL.NameListContainer>
        </DS.Partition>
      </NL.Container>
      <DS.Footer>
        <DS.FooterLink href={'/'}>
          <DS.Button bgColor={COLOR.PRIMARY_4_DARK}>
            <FontIcon icon={faHome} spaceRight={true} />
            Back to Home
          </DS.Button>
        </DS.FooterLink>
        <DS.Button
          bgColor={COLOR.PRIMARY_4_LIGHT}
          visible={hasNamesListed}
          onClick={() => setCurrentStep(1)}>
          Next Step
          <FontIcon icon={faChevronRight} spaceLeft={true} />
        </DS.Button>
      </DS.Footer>
      <NL.Modal visible={state.isModalVisible}>
        <NL.ModalDialog>
          <NL.ModalContent>
            <NL.Instructions>
              Separate each name with a new line.
            </NL.Instructions>
            <NL.NameTextInput
              id={'names-list'}
              onChange={onNameListChange}
              value={state.names}
              placeholder={'List each individual name...'}
              spellCheck={false}
              rows={10}
            />
            <NL.NameCount>
              {Utils.nameListFromText(state.names).length} name(s)
            </NL.NameCount>
            <NL.ModalFooter>
              <DS.Button
                bgColor={COLOR.PRIMARY_3_DARK}
                onClick={onConfirmClick}>
                Confirm
              </DS.Button>
              <DS.Button
                bgColor={COLOR.PRIMARY_3_LIGHT}
                onClick={onCancelClick}>
                Cancel
              </DS.Button>
            </NL.ModalFooter>
          </NL.ModalContent>
        </NL.ModalDialog>
      </NL.Modal>
    </DS.Step>
  );
}

interface NamesListState {
  names: string;
  isModalVisible: boolean;
}
