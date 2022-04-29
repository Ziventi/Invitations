import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel={'preconnect'} href={'https://fonts.googleapis.com'} />
          <link
            rel={'preconnect'}
            href={'https://fonts.gstatic.com'}
            crossOrigin={'anonymous'}
          />
          <link
            href={
              'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,700;1,400;1,700&display=swap'
            }
            rel={'stylesheet'}></link>
          <script src={'https://js.stripe.com/v3/'}></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
