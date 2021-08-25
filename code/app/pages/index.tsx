import Head from 'next/head';
import React, { useReducer } from 'react';

import Mapper from 'fragments/mapper';
import { GUEST_LIST, TABLE_NAMES } from 'utils/constants';
import {
  DistributionInitialState,
  DistributionReducer
} from 'utils/reducers/distribution';

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
            {TABLE_NAMES.map((tableName) => {
              return (
                <li className={'table'} key={tableName}>
                  <ul className={'table-guests'}>
                    {distribution[tableName].map((guest, key) => {
                      return <li className={'table-guest'} key={key}>{guest}</li>;
                    })}
                  </ul>
                  <label className={'table-label'}>{tableName}</label>
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
