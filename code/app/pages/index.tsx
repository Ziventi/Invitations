import classnames from 'classnames';
import { format } from 'date-fns';
import Head from 'next/head';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';

import Mapper from 'fragments/mapper';
import Preview from 'fragments/preview';
import { AssignmentState } from 'reducers/assignment';
import {
  DistributionInitialState,
  DistributionReducer
} from 'reducers/distribution';
import { GUEST_LIST } from 'utils/constants';

export default function Home() {
  const [distribution, setDistribution] = useReducer(
    DistributionReducer,
    DistributionInitialState
  );

  const [saves, setSaves] = useState<Save[]>([]);
  const [savedModalVisible, setSavesModalVisible] = useState(false);

  useEffect(() => {
    loadSavedDistributions();
  }, []);

  const showSavedDistributions = () => {
    setSavesModalVisible(true);
  };

  const loadSavedDistributions = async () => {
    const res = await fetch('/api/saves');
    const saves: Save[] = await res.json();
    setSaves(saves);
  };

  return (
    <div id={'root'}>
      <Head>
        <title>Seating Planner</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main className={'app'}>
        <Preview distribution={distribution} />
        <Mapper
          guests={GUEST_LIST}
          useDistReducer={[distribution, setDistribution]}
          loadSavedDistributions={loadSavedDistributions}
          showSavedDistributions={showSavedDistributions}
        />
        <SavesModal
          saves={saves}
          useVisibleState={[savedModalVisible, setSavesModalVisible]}
        />
      </main>
    </div>
  );
}

function SavesModal({ saves, useVisibleState }: SavesModalProps) {
  const [visible, setVisible] = useVisibleState;
  const classes = useMemo(() => {
    return classnames('saves-modal', {
      'saves-modal--visible': visible
    });
  }, [visible]);

  return (
    <aside className={classes}>
      <div className={'saves-modal-dialog'}>
        <header>
          <h1>Saved Distributions</h1>
        </header>
        <main>
          <ol>
            {saves.map(({ name, createTime }, key) => {
              return (
                <li key={key}>
                  <span>{name}</span>
                  <time>{format(new Date(createTime), 'HH:mm, E do MMMM yyyy')}</time>
                </li>
              );
            })}
          </ol>
        </main>
        <footer>
          <button onClick={() => setVisible(false)}>Close</button>
        </footer>
      </div>
    </aside>
  );
}

type SavesModalProps = {
  saves: Save[];
  useVisibleState: [boolean, Dispatch<SetStateAction<boolean>>];
};

type Save = {
  name: string;
  data: AssignmentState;
  createTime: Date;
};
