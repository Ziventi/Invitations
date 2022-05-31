import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import type {
  AppDispatch,
  PageStatePayload,
  RootState,
} from 'constants/reducers';
import { updateState } from 'constants/reducers';
import { COLOR } from 'styles/Constants';
import * as G from 'styles/Global';
import {
  NamesList as NL,
  Default as DS,
} from 'styles/pages/design/Setup.styles';

export default function NamesList() {
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

  return (
    <NL.Section>
      <DS.Container>
        <DS.Partition>
          <DS.Heading>Step 1: List The Names</DS.Heading>
          <DS.Text>
            Provide the full list of your guest names to be printed on each
            template.
          </DS.Text>
          <G.Button
            bgColor={COLOR.PRIMARY_5_LIGHT}
            onClick={() => toggleModal(true)}>
            Manually enter names
          </G.Button>
        </DS.Partition>
        <DS.Partition>
          <table>
            <tbody>
              {appState.namesList.map((name, key) => {
                return (
                  <tr key={key}>
                    <td>{name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DS.Partition>
      </DS.Container>
      <NL.Modal visible={state.isModalVisible}>
        <NL.ModalDialog>
          <NL.ModalContent>
            <NL.Instructions>
              Separate each name with a new line.
            </NL.Instructions>
            <NL.NameListInput
              id={'names-list'}
              onChange={onNameListChange}
              value={state.names}
              placeholder={'List each individual name...'}
              spellCheck={false}
              rows={10}
            />
            <NL.NameCount>
              {Utils.nameListFromText(state.names).length} names
            </NL.NameCount>
            <NL.ModalFooter>
              <G.Button bgColor={COLOR.PRIMARY_3_DARK} onClick={onConfirmClick}>
                Confirm
              </G.Button>
              <G.Button
                bgColor={COLOR.PRIMARY_3_LIGHT}
                onClick={() => toggleModal(false)}>
                Cancel
              </G.Button>
            </NL.ModalFooter>
          </NL.ModalContent>
        </NL.ModalDialog>
      </NL.Modal>
    </NL.Section>
  );
}

interface NamesListState {
  names: string;
  isModalVisible: boolean;
}
