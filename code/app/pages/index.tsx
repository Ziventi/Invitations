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
import {
  AssignmentAction,
  AssignmentActionFullPayload,
  AssignmentActionType,
  AssignmentInitialState,
  AssignmentReducer,
  AssignmentState
} from 'reducers/assignment';
import {
  DistributionInitialState,
  DistributionReducer
} from 'reducers/distribution';
import { GUEST_LIST } from 'utils/constants';

export default function Home() {
  const [assignment, updateAssignment] = useReducer(
    AssignmentReducer,
    AssignmentInitialState
  );
  const [distribution, setDistribution] = useReducer(
    DistributionReducer,
    DistributionInitialState
  );

  const [saves, setSaves] = useState<Save[]>([]);
  const [savedModalVisible, setSavesModalVisible] = useState(false);

  useEffect(() => {
    getAllSavedDistributions();
  }, []);

  const showSavedDistributions = () => {
    setSavesModalVisible(true);
  };

  const getAllSavedDistributions = async () => {
    const res = await fetch('/api/saves');
    const saves: Save[] = await res.json();
    setSaves(saves);
  };

  const loadSavedDistribution = (
    selectedAssignment: AssignmentActionFullPayload
  ) => {
    updateAssignment({
      payload: selectedAssignment,
      type: AssignmentActionType.FULL
    });
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
          useAssignmentReducer={[assignment, updateAssignment]}
          useDistReducer={[distribution, setDistribution]}
          loadSavedDistributions={getAllSavedDistributions}
          showSavedDistributions={showSavedDistributions}
        />
        <SavesModal
          saves={saves}
          loadSavedDistribution={loadSavedDistribution}
          useAssignmentReducer={[assignment, updateAssignment]}
          useVisibleState={[savedModalVisible, setSavesModalVisible]}
        />
      </main>
    </div>
  );
}

function SavesModal({
  saves,
  loadSavedDistribution,
  useVisibleState
}: SavesModalProps) {
  const [visible, setVisible] = useVisibleState;
  const classes = useMemo(() => {
    return classnames('saves-modal', {
      'saves-modal--visible': visible
    });
  }, [visible]);

  const closeModal = () => setVisible(false);

  return (
    <aside className={classes}>
      <div className={'saves-modal-dialog'}>
        <header>
          <h1>Saved Distributions</h1>
        </header>
        <main>
          <ol className={'saves-list'}>
            {saves.map(({ name, data, createTime }, key) => {
              return (
                <li
                  key={key}
                  onClick={() => {
                    loadSavedDistribution(data);
                    closeModal();
                  }}>
                  <span>{name}</span>
                  <time>
                    {format(new Date(createTime), 'HH:mm, E do MMM yyyy')}
                  </time>
                </li>
              );
            })}
          </ol>
        </main>
        <footer>
          <button onClick={closeModal}>Close</button>
        </footer>
      </div>
    </aside>
  );
}

type SavesModalProps = {
  saves: Save[];
  loadSavedDistribution: (
    selectedAssignment: AssignmentActionFullPayload
  ) => void;
  useAssignmentReducer: [AssignmentState, React.Dispatch<AssignmentAction>];
  useVisibleState: [boolean, Dispatch<SetStateAction<boolean>>];
};

type Save = {
  name: string;
  data: AssignmentActionFullPayload;
  createTime: Date;
};
