import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from 'constants/reducers';
import { updateState } from 'constants/reducers';
import { RightSidebar as R } from 'styles/pages/design/DesignEditor.styles';

export default function RightSidebar() {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  function onNameClick(name: string) {
    dispatch(
      updateState({
        selectedName: name,
      }),
    );
  }

  return (
    <R.Aside>
      <R.Header>Guest Names</R.Header>
      <R.ButtonList>
        {state.namesList.map((name, key) => {
          return (
            <R.Button
              onClick={() => {
                onNameClick(name);
              }}
              key={key}>
              <R.Index>#{key + 1}</R.Index>
              <R.Name>{name}</R.Name>
            </R.Button>
          );
        })}
      </R.ButtonList>
    </R.Aside>
  );
}
