import Head from 'next/head';
import React from 'react';

import {
  GUESTS_PER_TABLE,
  NUMBER_OF_TABLES,
  TABLE_NAMES
} from 'utils/constants';

import guests from '../../.cache/data.json';

function Home() {
  return (
    <div id={'root'}>
      <Head>
        <title>Seating Planner</title>
        <link rel={'icon'} href={'/favicon.ico'} />
      </Head>

      <main>
        <section className={'interface'}>
          <ul className={'tables'}>
            {TABLE_NAMES.slice(0, NUMBER_OF_TABLES).map((name) => {
              return (
                <li className={'table'} key={name}>
                  <label className={'table-label'}>{name}</label>
                </li>
              );
            })}
          </ul>
        </section>
        <aside className={'mapper'}>
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
                    <td>{guest.name}</td>
                    <td>
                      <input type={'text'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </aside>
      </main>
    </div>
  );
}

export default Home;
