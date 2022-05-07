import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import ZiventiLogo from 'components/logo';
import { AppDispatch, PageStatePayload, updateState } from 'constants/reducers';

const Home: NextPage = () => {
  const [state, setState] = useState<HomeState>({
    names: '',
    imageSrc: null,
  });

  const dispatch = useDispatch<AppDispatch>();
  const setAppState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );
  const router = useRouter();

  function onTextChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setState((current) => ({ ...current, names: e.target.value }));
  }

  /**
   * Called on selection of a file to edit. Ensures only files below limit are
   * allowed
   * @param e The change event.
   */
  function onImageSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (!files || !files.length) return;

    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      e.target.value = '';
      return alert('Maximum file size is 10MB');
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setState((current) => ({
        ...current,
        imageSrc: fileReader.result as string,
      }));
    };
  }

  function onSubmit() {
    const names = state.names;
    const namesList = names.split('\n').filter((name) => name.trim());
    setAppState({ namesList, imageSrc: state.imageSrc });
    void router.push('/design');
  }

  return (
    <main className={'home'}>
      <ZiventiLogo
        layout={'fixed'}
        objectFit={'contain'}
        width={300}
        height={300}
      />
      <section className={'content'}>
        <div>
          <section>
            <h2>Step 1</h2>
            <div className={'file-selector-container'}>
              <label className={'file-selector'}>
                <input
                  type={'file'}
                  accept={'image/jpeg,image/png'}
                  onChange={onImageSelect}
                  hidden={true}
                />
                <span>Choose your image...</span>
              </label>
            </div>
            <small>
              * Supported formats are JPEG and PNG. Maximum image size is 10MB.
            </small>
          </section>
          <section>
            <h2>Step 2</h2>
            <textarea
              id={'names-list'}
              onChange={onTextChange}
              value={state.names}
              placeholder={'List each individual name...'}
              rows={5}
            />
          </section>
        </div>
        <footer>
          <button onClick={onSubmit}>Start</button>
        </footer>
      </section>
    </main>
  );
};

export default Home;

interface HomeState {
  names: string;
  imageSrc: string | null;
}
