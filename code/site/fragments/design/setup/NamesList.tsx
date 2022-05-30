import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import * as Utils from 'constants/functions/utils';
import type { RootState } from 'constants/reducers';
import {
  NamesList as NL,
  Default as DS,
} from 'styles/pages/design/Setup.styles';

export default function NamesList() {
  const appState = useSelector((state: RootState) => state);

  const [state, setState] = useState<NamesListState>({
    names: Utils.textFromNameList(appState.namesList),
  });

  /**
   * Called on change to the name list.
   * @param e The change event.
   */
  function onNameListChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setState((current) => ({ ...current, names: e.target.value }));
  }

  return (
    <NL.Section>
      <DS.Container>
        <DS.Partition>
          <DS.Heading>Step 1: List The Names</DS.Heading>
          <DS.Text>
            Type out or paste the list of your guest names here. Separate each
            name with a new line.
          </DS.Text>
        </DS.Partition>
        <DS.Partition>
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
        </DS.Partition>
      </DS.Container>
    </NL.Section>
  );
}

interface NamesListState {
  names: string;
}
