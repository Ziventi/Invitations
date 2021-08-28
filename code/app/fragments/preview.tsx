import classnames from 'classnames';
import React from 'react';

import { DistributionState } from 'reducers/distribution';
import { TABLE_NAMES } from 'utils/constants';

export default function Preview({ distribution }: PreviewProps) {
  return (
    <section className={'preview'}>
      <ul className={'preview-tables'}>
        {TABLE_NAMES.map((table) => {
          return (
            <li className={'preview-tables-item'} key={table.id}>
              <ul className={'preview-table-guests'}>
                {distribution[table.id].map((guest, key) => {
                  const classes = classnames('preview-table-guest-name', {
                    'preview-table-guest-name--visible': guest
                  });
                  return (
                    <li className={'preview-table-guests-item'} key={key}>
                      <span>{key + 1}:</span>
                      <span className={classes}>{guest}</span>
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
