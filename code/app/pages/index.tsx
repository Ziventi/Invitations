import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useReducer } from 'react';

import Mapper from 'fragments/mapper';
import { NUMBER_OF_TABLES, TABLE_NAMES } from 'utils/constants';
import {
  DistributionInitialState,
  DistributionReducer
} from 'utils/reducers/distribution';

import GUEST_JSON from '../../.cache/data.json';
import { Guest } from '../../cli/controller/lib/classes';

export default function Home({ guests }: HomeProps) {
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
            {TABLE_NAMES.slice(0, NUMBER_OF_TABLES).map((tableName) => {
              return (
                <li className={'table'} key={tableName}>
                  <ul>
                    {distribution[tableName].map((guest, key) => {
                      return <li key={key}>{guest}</li>;
                    })}
                  </ul>
                  <label className={'table-label'}>{tableName}</label>
                </li>
              );
            })}
          </ul>
        </section>
        <Mapper
          guests={guests}
          useDistReducer={[distribution, setDistribution]}
        />
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

type HomeProps = {
  guests: Guest[];
};
