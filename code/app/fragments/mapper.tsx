import React, { useEffect, useReducer } from 'react';

import { GUESTS_PER_TABLE, TABLE_NAMES } from 'utils/constants';
import {
  AssignmentActionPayload,
  AssignmentInitialState,
  AssignmentReducer
} from 'utils/reducers/assignment';
import {
  DistributionAction,
  DistributionState
} from 'utils/reducers/distribution';

import { Guest } from '../../cli/controller/lib/classes';

export default function Mapper({ guests, useDistReducer }: MapperProps) {
  const [assignment, updateAssignment] = useReducer(
    AssignmentReducer,
    AssignmentInitialState
  );
  const [distribution, setDistribution] = useDistReducer;

  useEffect(() => {
    updatePreview();
  }, [assignment]);

  const onPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    updateAssignment({
      guest: name,
      payload: {
        position: valueAsNumber
      },
      type: 'partial'
    });
  };

  const onTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateAssignment({
      guest: name,
      payload: {
        table: parseInt(value)
      },
      type: 'partial'
    });
  };

  const updatePreview = () => {
    const newDistribution = Object.entries(assignment).reduce(
      (acc, [guest, payload]) => {
        const { table, position } = payload;
        if (table && position) {
          acc[table][position] = guest;
        }
        return acc;
      },
      distribution
    );
    setDistribution({ payload: newDistribution });
  };

  const randomiseDistribution = () => {
    const randomAssignment = guests
      .sort(() => (Math.random() > 0.5 ? 1 : -1))
      .reduce((acc, guest, i) => {
        const tableIndex = i % TABLE_NAMES.length;
        const position = Math.ceil(i / GUESTS_PER_TABLE);
        acc[guest.name] = {
          table: TABLE_NAMES[tableIndex].id,
          position
        };
        return acc;
      }, assignment);

    updateAssignment({
      payload: randomAssignment,
      type: 'full'
    });
  };

  return (
    <aside className={'mapper'}>
      <section className={'mapper-list'}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Table</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(assignment)
              .sort(([a], [b]) => (a > b ? 1 : -1))
              .map((entry, key) => {
                return (
                  <MapperGuestRow
                    guestEntry={entry}
                    onTableChange={onTableChange}
                    onPositionChange={onPositionChange}
                    key={key}
                  />
                );
              })}
          </tbody>
        </table>
      </section>
      <footer className={'mapper-footer'}>
        <button className={'mapper-button'} onClick={updatePreview}>
          Update
        </button>
        <button className={'mapper-button'} onClick={randomiseDistribution}>
          Random
        </button>
      </footer>
    </aside>
  );
}

function MapperGuestRow({
  guestEntry,
  onTableChange,
  onPositionChange
}: MapperGuestRowProps) {
  const [guestName, { table, position }] = guestEntry;
  return (
    <tr>
      <td className={'mapper-list-guest'}>{guestName}</td>
      <td>
        <select name={guestName} onChange={onTableChange}>
          <option>None</option>
          {TABLE_NAMES.map(({ id, name }, key) => {
            const isSelected = id === table;
            return (
              <option selected={isSelected} key={key}>
                {name}
              </option>
            );
          })}
        </select>
        <input
          type={'number'}
          name={guestName}
          min={1}
          max={GUESTS_PER_TABLE}
          value={position}
          onChange={onPositionChange}
        />
      </td>
    </tr>
  );
}

type MapperProps = {
  guests: Guest[];
  useDistReducer: [DistributionState, React.Dispatch<DistributionAction>];
};

type MapperGuestRowProps = {
  guestEntry: [string, AssignmentActionPayload];
  onTableChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPositionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
