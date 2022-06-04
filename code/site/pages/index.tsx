import '@fortawesome/fontawesome-svg-core/styles.css';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef } from 'react';

import Wave from 'components/vectors';
import SectionWorkflow from 'fragments/home/Workflow';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';
import * as Global from 'styles/Components.styles';
import { COLOR } from 'styles/Constants.styles';
import * as H from 'styles/pages/Home.styles';

const Home: NextPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  /**
   * Fill the header when window is scrolled to a certain height.
   */
  const fillHeaderOnScroll = useCallback(() => {
    const header = headerRef.current;
    if (!header) return;

    const svg = header.getElementsByTagName('svg')[0];

    if (window.scrollY >= 120) {
      header.style.backgroundColor = COLOR.PRIMARY_4_DARK;
      header.style.boxShadow = `0 0 3px 0 ${COLOR.BLACK}`;
      svg.style.height = '100%';
    } else {
      header.style.backgroundColor = 'initial';
      header.style.boxShadow = 'initial';
      svg.style.height = '250%';
    }
  }, []);

  // Attach window event listeners.
  useEffect(() => {
    window.addEventListener('scroll', fillHeaderOnScroll);
    return () => {
      window.removeEventListener('scroll', fillHeaderOnScroll);
    };
  }, [fillHeaderOnScroll]);

  return (
    <H.Page>
      <Header headerRef={headerRef} />
      <H.Main>
        <Global.BackgroundVideo
          src={`/cover.mp4`}
          poster={'/cover.jpg'}
          autoPlay={true}
          controls={false}
          loop={true}
          muted={true}
          onContextMenu={(e) => e.preventDefault()}
        />
        <H.Hero>
          <H.HeroCaption>
            <H.HeroCaptionHeading>
              Personalise your invitations
            </H.HeroCaptionHeading>
            <p>Let each and every one of your guests know they matter.</p>
            <Link href={'/design/#1'}>
              <H.HeroButton bgColor={COLOR.PRIMARY_4_DARK}>Start</H.HeroButton>
            </Link>
          </H.HeroCaption>
        </H.Hero>
        <Wave colorTop={COLOR.HERO} colorBottom={COLOR.WORKFLOW} />
        <SectionWorkflow />
        <Wave colorTop={COLOR.WORKFLOW} colorBottom={COLOR.PRIMARY_4_DARK} />
        <section className={'pricing'}></section>
        <Wave
          colorTop={COLOR.PRIMARY_4_DARK}
          colorBottom={COLOR.PRIMARY_1_NEUTRAL}
        />
        <section className={'motivation'}></section>
      </H.Main>
      <Footer />
    </H.Page>
  );
};

export default Home;
