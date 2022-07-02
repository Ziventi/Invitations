import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FontIcon from 'components/icon';
import * as Utils from 'constants/functions/utils';
import type {
  AppDispatch,
  RootState,
  UpdateStatePayload,
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
    (payload: UpdateStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  const [state, setState] = useState<NamesListState>({
    names: Utils.textFromNameList(appState.namesList),
    isModalVisible: false,
  });

  // Memoises if the names list exists.
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

  /**
   * Triggered on clicking next step button.
   */
  function onNextStepClick() {
    setCurrentStep(1);
  }

  return (
    <DS.Component visible={visible}>
      <DS.Container id={'namelist'}>
        <DS.Partition>
          <DS.Heading>Step 1: List The Names</DS.Heading>
          <DS.Text>
            Provide the full list of your guest names to be printed on each
            template.
          </DS.Text>
          <DS.Button
            id={'enter-names'}
            bgColor={COLOR.PRIMARY_4_NEUTRAL}
            onClick={() => toggleModal(true)}>
            Manually enter names
          </DS.Button>
        </DS.Partition>
        <DS.Partition>
          <NL.NameListContainer visible={hasNamesListed}>
            <NL.NameList id={'nameslist'}>
              {appState.namesList.map((name, key) => {
                return <li key={key}>{name}</li>;
              })}
            </NL.NameList>
          </NL.NameListContainer>
        </DS.Partition>
      </DS.Container>
      <DS.Footer>
        <Link href={'/'}>
          <DS.Button id={'back-home'} bgColor={COLOR.PRIMARY_4_DARK}>
            <FontIcon icon={faHome} spaceRight={true} />
            Back to Home
          </DS.Button>
        </Link>
        <Link href={'/design/#2'}>
          <DS.Button
            id={'next-step'}
            bgColor={COLOR.PRIMARY_4_LIGHT}
            disabled={!hasNamesListed}
            onClick={onNextStepClick}>
            Next Step
            <FontIcon icon={faChevronRight} spaceLeft={true} />
          </DS.Button>
        </Link>
      </DS.Footer>
      <NL.Modal visible={state.isModalVisible}>
        <NL.ModalDialog>
          <NL.ModalContent>
            <NL.Instructions>
              Separate each name with a new line.
            </NL.Instructions>
            <NL.NameTextInput
              id={'nameslist-input'}
              disabled={!state.isModalVisible}
              onChange={onNameListChange}
              value={state.names}
              placeholder={'List each individual name...'}
              spellCheck={false}
              rows={10}
            />
            <NL.NameCount id={'name-count'}>
              {Utils.nameListFromText(state.names).length} name(s)
            </NL.NameCount>
            <NL.ModalFooter>
              <DS.Button
                id={'names-modal-confirm'}
                bgColor={COLOR.PRIMARY_3_DARK}
                onClick={onConfirmClick}>
                Confirm
              </DS.Button>
              <DS.Button
                id={'names-modal-cancel'}
                bgColor={COLOR.PRIMARY_3_LIGHT}
                onClick={onCancelClick}>
                Cancel
              </DS.Button>
            </NL.ModalFooter>
          </NL.ModalContent>
        </NL.ModalDialog>
      </NL.Modal>
    </DS.Component>
  );
}

interface NamesListState {
  names: string;
  isModalVisible: boolean;
}
