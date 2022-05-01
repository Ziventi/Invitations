import type { GetStaticProps, NextPage } from 'next';
import NextImage from 'next/image';
import Link from 'next/link';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DesignForm from 'components/designform';
import DragZone from 'components/dragzone';
import NameList from 'components/namelist';
import { drawOnCanvas } from 'constants/functions/canvas';
import * as Download from 'constants/functions/download';
import TestData from 'constants/test.json';
import { GoogleFont, PageState, RequestBody } from 'constants/types';
import { GOOGLE_FONT_HOST } from 'constants/variables';
import ZiventiLogo from 'public/ziventi-logo.png';
import { PageStatePayload, updateState } from 'reducers/slice';
import { RootState } from 'reducers/store';

const Home: NextPage<HomeProps> = ({ fonts }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const useDraggableRef = useState(draggableRef);

  const state = useSelector(({ state }: RootState) => state);
  const dispatch = useDispatch();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  const names = useMemo(() => {
    return state.namesList.join('\n');
  }, [state.namesList]);

  // TODO: Remove (dev purposes only)
  useEffect(() => {
    setState({
      namesList: TestData.names,
      imageSrc: TestData.imageSource,
    });
  }, [setState]);

  // Load a new font on a new font family selection.
  useEffect(() => {
    import('webfontloader')
      .then((WebFont) => {
        WebFont.load({
          google: {
            families: [state.textStyle.fontFamily],
            text: state.selectedName,
          },
        });
      })
      .catch(console.error);
  }, [state.selectedName, state.textStyle.fontFamily]);

  // Change selected name if the names list changes.
  useEffect(() => {
    setState({
      selectedName: state.namesList[0] || '',
    });
  }, [setState, state.namesList]);

  // Called each time the image source changes.
  useEffect(() => {
    if (!state.imageSrc) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.src = state.imageSrc;
    img.onload = () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const scaleX = canvas.width / canvas.clientWidth;
      const scaleY = canvas.height / canvas.clientHeight;
      const scale = (scaleX + scaleY) / 2;

      setState({
        canvasDimensions: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        },
        imageDimensions: {
          width: img.width,
          height: img.height,
        },
        textStyle: {
          scale,
          scaleX,
          scaleY,
        },
      });

      // TODO: Dev Only
      const draggable = draggableRef.current!;
      if (draggable) {
        draggable.style.top = '0px';
        draggable.style.left = '0px';
      }
    };
  }, [setState, state.imageSrc]);

  // Adjust draggable position when top or left values are changed.
  useEffect(() => {
    const draggable = draggableRef.current;
    if (draggable) {
      draggable.style.top = `${state.textStyle.top}px`;
      draggable.style.left = `${state.textStyle.left}px`;
    }
  }, [state.textStyle.left, state.textStyle.top]);

  /**
   * Called on selection of a file to edit.
   * @param e The change event.
   * // TODO: Ask before replacing existing image.
   */
  function onImageSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (!files || !files.length) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      setState({
        imageSrc: fileReader.result as string,
      });
    };
  }

  function preview(): void {
    const canvas = canvasRef.current!;
    drawOnCanvas(canvas, state.selectedName, state.textStyle);
  }

  /**
   * Performs a download.
   */
  async function download(type: 'pdf' | 'png' | 'png-zip') {
    if (!state.imageSrc) return alert('No image');

    setState({
      downloadInProgress: true,
    });

    const selectedFont = fonts.find((font) => {
      return font.family === state.textStyle.fontFamily;
    })!;

    const payload: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        backgroundImageSrc: state.imageSrc,
        fontId: selectedFont.id,
        dimensions: state.imageDimensions,
        namesList: state.namesList,
        textStyle: state.textStyle,
      } as RequestBody),
    };

    try {
      if (type === 'pdf') {
        await Download.pdfFileTest(payload);
      } else if (type === 'png') {
        await Download.pngFileTest(payload, state.canvasDimensions);
      } else if (type === 'png-zip') {
        await Download.pngArchive(payload);
      }
    } catch (e) {
      alert(e);
    } finally {
      setState({
        downloadInProgress: false,
      });
    }
  }

  function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const names = e.target.value;
    const namesList = names.split('\n').filter((name) => name.trim());
    setState({ namesList });
  }

  // function onTextColorChange(color: ColorResult): void {
  //   setState((currentState) => ({
  //     ...currentState,
  //     draggable: {
  //       ...currentState.draggable,
  //       color: color.hex,
  //     },
  //   }));
  // }

  return (
    <main>
      <aside className={'controls'}>
        <header>
          {/* <Link href={'/'}> */}
          <NextImage
            src={ZiventiLogo}
            alt={'Ziventi Logo'}
            priority={true}
            layout={'fill'}
            objectFit={'contain'}
            objectPosition={'left'}
            className={'site-logo'}
          />
          {/* </Link> */}
        </header>
        <textarea
          id={'names-list'}
          onChange={onTextChange}
          value={names}
          placeholder={'List your guest names'}
        />
        <input
          type={'file'}
          accept={'image/jpeg,image/png'}
          onChange={onImageSelect}
        />
        <DesignForm fonts={fonts} />
        <button id={'draw'} onClick={preview}>
          Draw
        </button>
        <button onClick={() => download('pdf')}>Download PDF</button>
        <button onClick={() => download('png')}>Download PNG</button>
        <button onClick={() => download('png-zip')}>
          Download PNG archive
        </button>
        <Link href={'/payment'}>
          <button id={'pay'}>Pay</button>
        </Link>
        {/* <PhotoshopPicker
          color={state.draggable.textColor}
          onChange={onTextColorChange}
        /> */}
      </aside>
      <section className={'preview'}>
        <canvas ref={canvasRef} />
        <DragZone useDraggableRef={useDraggableRef} ref={draggableRef} />
      </section>
      <NameList />
      <ProgressOverlay state={state} />
    </main>
  );
};

function ProgressOverlay({ state }: ProgressOverlayProps): ReactElement | null {
  if (!state.downloadInProgress) return null;
  return <dialog>Loading...</dialog>;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const res = await fetch(GOOGLE_FONT_HOST);
  const fonts: GoogleFont[] = await res.json();
  return {
    props: {
      fonts: fonts
        .sort((a, b) => a.family.localeCompare(b.family))
        .map((font) => ({ id: font.id, family: font.family })),
    },
  };
};

export default Home;

interface HomeProps {
  fonts: GoogleFont[];
}

interface ProgressOverlayProps {
  state: PageState;
}
