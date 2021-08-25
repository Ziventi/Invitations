import Head from 'next/head';
import React, { useReducer } from 'react';

import Mapper from 'fragments/mapper';
import {
  DistributionInitialState,
  DistributionReducer
} from 'reducers/distribution';
import { GUEST_LIST, TABLE_NAMES } from 'utils/constants';

export default function Home() {
  const [distribution, setDistribution] = useReducer(
    DistributionReducer,
    DistributionInitialState
  );

  return (
    <div id={'root'}>
      <Head>
        <title>Seating Planner</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main>
        <section className={'preview'}>
          <ul className={'tables'}>
            {TABLE_NAMES.map((table) => {
              return (
                <li className={'table'} key={table.id}>
                  <ul className={'table-guests'}>
                    {distribution[table.id].map((guest, key) => {
                      return (
                        <li className={'table-guest'} key={key}>
                          {guest}
                        </li>
                      );
                    })}
                  </ul>
                  <label className={'table-label'}>{table.name}</label>
                </li>
              );
            })}
          </ul>
        </section>
        <Mapper
          guests={GUEST_LIST}
          useDistReducer={[distribution, setDistribution]}
        />
      </main>
    </div>
  );
}
