import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faFileImage,
  faUsersRectangle,
  faCrosshairs,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

import Container from 'components/container';
import Wave from 'components/wave';
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
      header.style.boxShadow = '0 0 3px 0 #000';
    } else {
      header.style.backgroundColor = 'initial';
      header.style.boxShadow = 'initial';
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
      <main>
        <Header headerRef={headerRef} />
        <section className={'cover'}>
          <figure className={'video'}>
            <video
              src={`/cover.mp4`}
              autoPlay={true}
              controls={false}
              loop={true}
              muted={true}
              onContextMenu={(e) => e.preventDefault()}
            />
          </figure>
          <div>
            <h1>Personalise your invitations</h1>
            <p>Let each and every one of your guests know they matter.</p>
            <button onClick={onStartClick}>Start</button>
          </div>
        </section>
        <section className={'overview'}>
          <Container maxWidth={700}>
            <Article heading={'Step 1'} icon={faUsersRectangle}>
              Supply a full list of your guests names to generate invitations
              for.
            </Article>
            <Article heading={'Step 2'} icon={faFileImage}>
              Select your base invitation image as the template.
            </Article>
            <Article
              heading={'Step 3'}
              icon={faCrosshairs}
              noTrailingRule={true}>
              Use the editor to position and apply styling to each name.
            </Article>
          </Container>
        </section>
        <Wave className={'two'} />
        <section className={'pricing'}></section>
        <Wave className={'three'} />
        <section className={'motivation'}></section>
      </main>
      <Footer />
    </div>
  );
};

function Article({ heading, noTrailingRule, icon, children }: ArticleProps) {
  return (
    <article>
      <div className={'article'}>
        <FontAwesomeIcon icon={icon} size={'10x'} className={'font-icon'} />
        <div className={'article-caption'}>
          <h3>{heading}</h3>
          <p>{children}</p>
        </div>
      </div>
      {!noTrailingRule && <hr />}
    </article>
  );
}

export default Home;

interface ArticleProps {
  icon: IconProp;
  heading: string;
  noTrailingRule?: boolean;
  children?: ReactNode;
}
