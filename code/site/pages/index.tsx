import {
  faFileImage,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef } from 'react';

import Container from 'components/container';
import { Wave } from 'components/wave';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';

const Home: NextPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /**
   * Fill the header when window is scrolled to a certain height.
   */
  const fillHeaderOnScroll = useCallback(() => {
    const header = headerRef.current;
    if (!header) return;

    if (window.scrollY >= 120) {
      header.style.backgroundColor = '#620417';
    } else {
      header.style.backgroundColor = 'initial';
    }
  }, []);

  // Attach window event listeners.
  useEffect(() => {
    window.addEventListener('scroll', fillHeaderOnScroll);
    return () => {
      window.removeEventListener('scroll', fillHeaderOnScroll);
    };
  }, [fillHeaderOnScroll]);

  /**
   * Navigate to design page.
   */
  function onStartClick(): void {
    void router.push('/design');
  }

  return (
    <div className={'app'}>
      <Header headerRef={headerRef} />
      <main className={'home'}>
        <section className={'cover'}>
          <Wave className={'wave'}>
            <video
              src={`/cover.mp4`}
              autoPlay={true}
              controls={false}
              loop={true}
              muted={true}
              onContextMenu={(e) => e.preventDefault()}
            />
          </Wave>
          <div>
            <h1>Personalise your invitations</h1>
            <p>Let your guests know they matter.</p>
            <button onClick={onStartClick}>Start</button>
          </div>
        </section>
        <section className={'overview'}>
          <Container>
            <article>
              <FontAwesomeIcon
                icon={faUsersRectangle}
                size={'8x'}
                className={'font-icon'}
              />
              <p>
                Supply a full list of your guests names to position on your
                select image.
              </p>
            </article>
            <article>
              <FontAwesomeIcon
                icon={faFileImage}
                size={'8x'}
                className={'font-icon'}
              />
              <p>Select an image</p>
            </article>
            <article>
              <FontAwesomeIcon
                icon={faFileImage}
                size={'8x'}
                className={'font-icon'}
              />
              <p>Position your names</p>
            </article>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
