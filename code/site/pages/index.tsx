import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faCrosshairs,
  faFileImage,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useRef } from 'react';

import Wave from 'components/wave';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';
import { COLOR } from 'styles/Constants';
import H from 'styles/Home.styles';

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
        <H.Cover>
          <H.VideoWrapper>
            <H.Video
              src={`/cover.mp4`}
              autoPlay={true}
              controls={false}
              loop={true}
              muted={true}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
            />
          </H.VideoWrapper>
          <H.CoverCaption>
            <H.CoverCaptionHeading>
              Personalise your invitations
            </H.CoverCaptionHeading>
            <p>Let each and every one of your guests know they matter.</p>
            <H.CoverButton
              bgColor={COLOR.PRIMARY_4_DARK}
              onClick={onStartClick}>
              Start
            </H.CoverButton>
          </H.CoverCaption>
        </H.Cover>
        <H.WorkflowSection>
          <H.WorkflowContainer maxWidth={700}>
            <Step heading={'Step 1'} icon={faUsersRectangle}>
              Supply a full list of your guests names to generate invitations
              for.
            </Step>
            <Step heading={'Step 2'} icon={faFileImage}>
              Select your base invitation image as the template.
            </Step>
            <Step heading={'Step 3'} icon={faCrosshairs} noTrailingRule={true}>
              Use the editor to position and apply styling to each name.
            </Step>
          </H.WorkflowContainer>
        </H.WorkflowSection>
        <Wave className={'two'} />
        <section className={'pricing'}></section>
        <Wave className={'three'} />
        <section className={'motivation'}></section>
      </div>
      <Footer />
    </H.Main>
  );
};

function Step({ heading, noTrailingRule, icon, children }: StepProps) {
  return (
    <H.WorkflowStep>
      <H.StepCaptionWrapper>
        <FontAwesomeIcon
          icon={icon}
          size={'10x'}
          color={COLOR.PRIMARY_4_DARK}
        />
        <H.StepCaption>
          <H.StepCaptionHeading>{heading}</H.StepCaptionHeading>
          <H.StepCaptionText>{children}</H.StepCaptionText>
        </H.StepCaption>
      </H.StepCaptionWrapper>
      <H.HorizontalRule visible={!noTrailingRule} />
    </H.WorkflowStep>
  );
}

export default Home;

interface StepProps {
  icon: IconProp;
  heading: string;
  noTrailingRule?: boolean;
  children?: ReactNode;
}
