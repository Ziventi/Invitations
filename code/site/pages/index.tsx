import {
  faFileImage,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

import Container from 'components/container';
import WaveSVG from 'components/wave';
import { VIDEO_SOURCES } from 'constants/variables';
import Footer from 'fragments/partials/Footer';
import Header from 'fragments/partials/Header';

const Home: NextPage = () => {
  const [state, setState] = useState<HomeState>({
    videoClipIndex: 0,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  /**
   * Navigate to design page.
   */
  function onStartClick(): void {
    void router.push('/design');
  }

  function onVideoEnd(): void {
    const endOfPlaylist = state.videoClipIndex + 1 === VIDEO_SOURCES.length;
    const index = endOfPlaylist ? 0 : state.videoClipIndex + 1;
    setState((current) => {
      return {
        ...current,
        videoClipIndex: index,
      };
    });

    const video = videoRef.current!;
    video.src = `/videos/${VIDEO_SOURCES[index]}.mp4`;
    video.onload = async () => {
      await video.play();
    };
  }

  return (
    <div className={'app'}>
      <Header />
      <main className={'home'}>
        <section className={'cover'}>
          <WaveSVG className={'wave'}>
            <video
              src={`/videos/${VIDEO_SOURCES[state.videoClipIndex]}.mp4`}
              autoPlay={true}
              controls={false}
              muted={true}
              onContextMenu={(e) => e.preventDefault()}
              onEnded={onVideoEnd}
              ref={videoRef}
            />
          </WaveSVG>
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

interface HomeState {
  videoClipIndex: number;
}
