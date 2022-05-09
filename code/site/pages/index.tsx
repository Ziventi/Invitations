import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import WaveSVG from 'components/wave';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';

const Home: NextPage = () => {
  const router = useRouter();

  /**
   * Navigate to design page.
   */
  function onStartClick() {
    void router.push('/design');
  }

  return (
    <div className={'app'}>
      <Header />
      <main className={'home'}>
        <section className={'cover'}>
          <div>
            <h1>Personalise your invitations</h1>
            <p>Let your guests know they matter.</p>
            <button onClick={onStartClick}>Start</button>
          </div>
        </section>
        <WaveSVG className={'wave'} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
