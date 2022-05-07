import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateState, RootState, AppDispatch } from 'constants/reducers';

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
    <aside className={'namelist'}>
      <header>Guest Names</header>
      <div className={'button-list'}>
        {state.namesList.map((name, key) => {
          return (
            <button
              onClick={() => onNameClick(name)}
              className={'name-button'}
              key={key}>
              <span className={'index'}>#{key + 1}</span>
              <span className={'name'}>{name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
