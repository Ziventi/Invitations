import {
  faFileImage,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fs from 'fs';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import path from 'path';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Container from 'components/container';
import { Wave } from 'components/wave';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';

const Home: NextPage<HomeProps> = ({ clips }) => {
  const [state, setState] = useState<HomeState>({
    videoClipIndex: 0,
  });
  const headerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  /**
   * Play next clip once a video has ended.
   */
  function onVideoEnd(): void {
    const endOfPlaylist = state.videoClipIndex + 1 === clips.length;
    const index = endOfPlaylist ? 0 : state.videoClipIndex + 1;
    setState((current) => {
      return {
        ...current,
        videoClipIndex: index,
      };
    });

    const video = videoRef.current!;
    video.src = `/videos/${clips[index]}.mp4`;
    video.onload = async () => {
      await video.play();
    };
  }

  return (
    <div className={'app'}>
      <Header headerRef={headerRef} />
      <main className={'home'}>
        <section className={'cover'}>
          <Wave className={'wave'}>
            <video
              src={`/videos/${clips[state.videoClipIndex]}.mp4`}
              autoPlay={true}
              controls={false}
              muted={true}
              onContextMenu={(e) => e.preventDefault()}
              onEnded={onVideoEnd}
              ref={videoRef}
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

export const getStaticProps: GetStaticProps<HomeProps> = () => {
  const videosDir = path.resolve(process.cwd(), './public/videos');
  const clips = fs.readdirSync(videosDir).map((filename) => {
    return path.basename(filename, '.mp4');
  });
  return {
    props: {
      clips,
    },
  };
};

interface HomeState {
  videoClipIndex: number;
}

interface HomeProps {
  clips: string[];
}
