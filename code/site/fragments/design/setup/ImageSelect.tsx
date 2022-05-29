import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import type { RootState } from 'constants/reducers';
import { COLOR } from 'styles/Constants';
import * as Global from 'styles/Global';
import { ImageSelection as IS } from 'styles/pages/design/Setup.styles';

export default function ImageSelect() {
  const appState = useSelector((state: RootState) => state);
  const [state, setState] = useState<ImageSelectState>({
    imageSrc: appState.imageSrc,
  });

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
      alert('Maximum file size is 10MB');
      return;
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
  return (
    <IS.Section>
      <h2>Step 2: Select Your Image</h2>
      <IS.FileSelector>
        <Global.Button as={'label'} bgColor={COLOR.PRIMARY_3_DARK}>
          <input
            type={'file'}
            accept={'image/jpeg,image/png'}
            onChange={onImageSelect}
            hidden={true}
          />
          <span>Choose your image...</span>
        </Global.Button>
      </IS.FileSelector>
      <small>
        * Supported formats are JPEG and PNG. Maximum image size is 10MB.
      </small>
      <IS.ImagePreview>
        <PreviewImage src={state.imageSrc} />
      </IS.ImagePreview>
    </IS.Section>
  );
}

function PreviewImage({ src }: PreviewImageProps) {
  if (!src) return null;
  return <Image src={src} layout={'fill'} objectFit={'contain'} />;
}

interface ImageSelectState {
  imageSrc: string | null;
}

interface PreviewImageProps {
  src: string | null;
}
