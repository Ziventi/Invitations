import type { LinkProps } from 'next/link';
import Link from 'next/link';
import React from 'react';

import * as Global from 'styles/Global';

export default function Hyperlink({
  href,
  children,
}: React.PropsWithChildren<LinkProps>) {
  return (
    <Link href={href}>
      <Global.Link>{children}</Global.Link>
    </Link>
  );
}
