import React, { useReducer } from 'react';

import { GUESTS_PER_TABLE, TABLE_NAMES } from 'utils/constants';
import {
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

  const onPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    updateAssignment({
      guest: name,
      payload: {
        position: valueAsNumber
      }
    });
  };

  const onTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateAssignment({
      guest: name,
      payload: {
        table: value
      }
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
            {guests.map((guest, key) => {
              return (
                <MapperGuestRow
                  guest={guest}
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
      </footer>
    </aside>
  );
}

function MapperGuestRow({
  guest,
  onTableChange,
  onPositionChange
}: MapperGuestRowProps) {
  return (
    <tr>
      <td className={'mapper-list-guest'}>{guest.name}</td>
      <td>
        <select name={guest.name} onChange={onTableChange}>
          <option>None</option>
          {TABLE_NAMES.map((name, key) => {
            return <option key={key}>{name}</option>;
          })}
        </select>
        <input
          type={'number'}
          name={guest.name}
          min={1}
          max={GUESTS_PER_TABLE}
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
  guest: Guest;
  onTableChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPositionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
