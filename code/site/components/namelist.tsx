import React from 'react';

import { PageStateHook } from 'constants/types';

export default function NameList({ usePageState }: NameListProps) {
  const [pageState, setPageState] = usePageState;

  function onNameClick(name: string) {
    setPageState((current) => ({
      ...current,
      selectedName: name,
    }));
  }

  return (
    <aside className={'namelist'}>
      {pageState.namesList.map((name, key) => {
        return (
          <button
            onClick={() => onNameClick(name)}
            className={'name-button'}
            key={key}>
            {name}
          </button>
        );
      })}
    </aside>
  );
}

interface NameListProps {
  usePageState: PageStateHook;
}
