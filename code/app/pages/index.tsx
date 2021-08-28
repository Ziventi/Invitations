import Head from 'next/head';
import React, { useReducer } from 'react';

import Mapper from 'fragments/mapper';
import Preview from 'fragments/preview';
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

  return (
    <div id={'root'}>
      <Head>
        <title>Seating Planner</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main>
        <Preview distribution={distribution} />
        <Mapper
          guests={GUEST_LIST}
          useDistReducer={[distribution, setDistribution]}
        />
      </main>
    </div>
  );
}
