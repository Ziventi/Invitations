import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef } from 'react';

import Wave, { HeroClipPathReference } from 'components/vectors';
import SectionWorkflow from 'fragments/home/Workflow';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';
import { COLOR } from 'styles/Constants';
import H from 'styles/pages/Home.styles';

const Home: NextPage = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  /**
   * Navigate to design page.
   */
  function onStartClick(): void {
    void router.push('/design');
  }

  return (
    <H.Main>
      <div>
        <Header headerRef={headerRef} />
        <H.Hero>
          <HeroClipPathReference />
          <H.VideoWrapper>
            <H.Video
              src={`/cover.mp4`}
              poster={'/cover.jpg'}
              autoPlay={true}
              controls={false}
              loop={true}
              muted={true}
              onContextMenu={(e) => e.preventDefault()}
            />
          </H.VideoWrapper>
          <H.HeroCaption>
            <H.HeroCaptionHeading>
              Personalise your invitations
            </H.HeroCaptionHeading>
            <p>Let each and every one of your guests know they matter.</p>
            <H.HeroButton bgColor={COLOR.PRIMARY_4_DARK} onClick={onStartClick}>
              Start
            </H.HeroButton>
          </H.HeroCaption>
        </H.Hero>
        <SectionWorkflow />
        <Wave
          colorTop={COLOR.PRIMARY_1_NEUTRAL}
          colorBottom={COLOR.PRIMARY_4_DARK}
        />
        <section className={'pricing'}></section>
        <Wave
          colorTop={COLOR.PRIMARY_4_DARK}
          colorBottom={COLOR.PRIMARY_1_NEUTRAL}
        />
        <section className={'motivation'}></section>
      </div>
      <Footer />
    </H.Main>
  );
};

export default Home;
