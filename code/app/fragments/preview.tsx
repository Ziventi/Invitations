import React from 'react';

import { DistributionState } from 'reducers/distribution';
import { TABLE_NAMES } from 'utils/constants';

export default function Preview({ distribution }: PreviewProps) {
  return (
    <section className={'preview'}>
      <ul className={'tables'}>
        {TABLE_NAMES.map((table) => {
          return (
            <li className={'table'} key={table.id}>
              <ul className={'table-guests'}>
                {distribution[table.id].map((guest, key) => {
                  return (
                    <li className={'table-guest'} key={key}>
                      {key + 1}: {guest}
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
  );
}

type PreviewProps = {
  distribution: DistributionState;
};
