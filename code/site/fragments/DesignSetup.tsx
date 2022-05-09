import router from 'next/router';
import React, { ReactElement, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  RootState,
  AppDispatch,
  PageStatePayload,
  updateState,
} from 'constants/reducers';

export default function DesignSetup(): ReactElement {
  const state = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  /**
   * Called on change to the name list.
   * @param e The change event.
   */
  function onNameListChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const namesList = e.target.value.split('\n').filter((name) => name.trim());
    setState({ namesList });
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
      setState({
        imageSrc: fileReader.result as string,
      });
    };
  }

  function onSubmit() {
    void router.push('/design');
  }

  return (
    <main className={'content'}>
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
            onChange={onNameListChange}
            value={state.namesList.join('\n')}
            placeholder={'List each individual name...'}
            rows={5}
          />
        </section>
      </div>
      <footer>
        <button onClick={onSubmit}>Start</button>
      </footer>
    </main>
  );
}
