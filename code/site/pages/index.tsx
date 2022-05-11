import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faFileImage,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

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
            <p>Let each and every one of your guests know they matter.</p>
            <button onClick={onStartClick}>Start</button>
          </div>
        </section>
        <section className={'overview'}>
          <Container maxWidth={800}>
            <Article heading={'Step 1'} icon={faUsersRectangle}>
              Supply a full list of your guests names to generate individual
              media for.
            </Article>
            <Article heading={'Step 2'} icon={faFileImage}>
              Select the background image you want to use for the files.
            </Article>
            <Article heading={'Step 3'} icon={faFileImage}>
              Position your names
            </Article>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

function Article({ heading, icon, children }: ArticleProps) {
  return (
    <article>
      <FontAwesomeIcon icon={icon} size={'10x'} className={'font-icon'} />
      <div>
        <h3>{heading}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

export default Home;

interface ArticleProps {
  icon: IconProp;
  heading: string;
  children?: ReactNode;
}
