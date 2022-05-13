import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faCrosshairs,
  faFileImage,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';

import Wave from 'components/wave';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';
import {
  Cover,
  CoverButton,
  CoverCaption,
  CoverCaptionHeading,
  HomeMain,
  HorizontalRule,
  StepCaption,
  StepCaptionHeading,
  StepCaptionText,
  StepCaptionWrapper,
  Video,
  VideoWrapper,
  WorkflowContainer,
  WorkflowSection,
  WorkflowStep,
} from 'styles/Home.styles';
import { COLOR } from 'styles/Library';

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
    <HomeMain>
      <div>
        <Header headerRef={headerRef} />
        <Cover>
          <VideoWrapper>
            <Video
              src={`/cover.mp4`}
              autoPlay={true}
              controls={false}
              loop={true}
              muted={true}
              onContextMenu={(e) => e.preventDefault()}
            />
          </VideoWrapper>
          <CoverCaption>
            <CoverCaptionHeading>
              Personalise your invitations
            </CoverCaptionHeading>
            <p>Let each and every one of your guests know they matter.</p>
            <CoverButton bgColor={COLOR.PRIMARY_4_DARK} onClick={onStartClick}>
              Start
            </CoverButton>
          </CoverCaption>
        </Cover>
        <WorkflowSection>
          <WorkflowContainer maxWidth={700}>
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
          </WorkflowContainer>
        </WorkflowSection>
        <Wave className={'two'} />
        <section className={'pricing'}></section>
        <Wave className={'three'} />
        <section className={'motivation'}></section>
      </div>
      <Footer />
    </HomeMain>
  );
};

function Step({ heading, noTrailingRule, icon, children }: StepProps) {
  return (
    <WorkflowStep>
      <StepCaptionWrapper>
        <FontAwesomeIcon
          icon={icon}
          size={'10x'}
          color={COLOR.PRIMARY_4_DARK}
        />
        <StepCaption>
          <StepCaptionHeading>{heading}</StepCaptionHeading>
          <StepCaptionText>{children}</StepCaptionText>
        </StepCaption>
      </StepCaptionWrapper>
      {!noTrailingRule && <HorizontalRule />}
    </WorkflowStep>
  );
}

export default Home;

interface StepProps {
  icon: IconProp;
  heading: string;
  noTrailingRule?: boolean;
  children?: ReactNode;
}
