import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useReducer, useState } from 'react';

import {
  GUESTS_PER_TABLE,
  NUMBER_OF_TABLES,
  TABLE_NAMES
} from 'utils/constants';
import {
  GuestAssignmentInitialState,
  GuestAssignmentReducer
} from 'utils/reducers';

import GUEST_JSON from '../../.cache/data.json';
import { Guest } from '../../cli/controller/lib/classes';

export default function Home({ guests }: HomeProps) {
  const [distribution, setDistribution] = useState(DistributionInitialState);
  const [guestAssignment, dispatch] = useReducer(
    GuestAssignmentReducer,
    GuestAssignmentInitialState
  );

  // useEffect(() => {
  //   console.log(guestAssignment);
  // }, [guestAssignment]);

  const onPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    dispatch({
      guest: name,
      payload: {
        position: valueAsNumber
      }
    });
  };

  const onTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({
      guest: name,
      payload: {
        table: value
      }
    });
  };

  const updatePreview = () => {
    const dist = Object.entries(guestAssignment).reduce(
      (acc, [guest, payload]) => {
        const { table, position } = payload;
        if (table && position) {
          if (acc[table]) {
            acc[table][position] = guest;
          }
          acc[table];
        }
        return acc;
      },
      distribution
    );
    setDistribution(dist);
  };

  return (
    <div id={'root'}>
      <Head>
        <title>Seating Planner</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main>
        <section className={'preview'}>
          <ul className={'tables'}>
            {TABLE_NAMES.slice(0, NUMBER_OF_TABLES).map((name) => {
              return (
                <li className={'table'} key={name}>
                  <ul>
                    {distribution[name].map((guest, key) => {
                      return <li key={key}>{guest}</li>;
                    })}
                  </ul>
                  <label className={'table-label'}>{name}</label>
                </li>
              );
            })}
          </ul>
        </section>
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
                    <tr key={key}>
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
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const guests = GUEST_JSON.filter((g) => g.rank <= 4);

  return {
    props: {
      guests
    }
  };
};

const DistributionInitialState = TABLE_NAMES.reduce(
  (acc: Record<string, Array<string>>, tableName: string) => {
    acc[tableName] = new Array(GUESTS_PER_TABLE);
    return acc;
  },
  {}
);

type HomeProps = {
  guests: Guest[];
};
