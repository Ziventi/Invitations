import type { AppProps } from 'next/app';

import React, { ReactElement } from 'react';

import 'styles/App.scss';

export default function MyApp({
  Component,
  pageProps,
}: AppProps): ReactElement {
  return <Component {...pageProps} />;
}
