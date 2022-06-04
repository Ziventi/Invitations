import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import NextImage from 'next/image';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FontIcon from 'components/icon';
import type {
  AppDispatch,
  PageStatePayload,
  RootState,
} from 'constants/reducers';
import { updateState } from 'constants/reducers';
import type { DesignSetupStepProps } from 'constants/types';
import * as Global from 'styles/Components.styles';
import { COLOR } from 'styles/Constants.styles';
import {
  Default as DS,
  ImageSelection as IS,
} from 'styles/pages/design/DesignSetup.styles';

export default function ImageSelect({
  setCurrentStep,
  visible,
}: DesignSetupStepProps) {
  const appState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const setAppState = useCallback(
    (payload: PageStatePayload) => {
      dispatch(updateState(payload));
    },
    [dispatch],
  );

  /**
   * Called on selection of a file to edit. Ensures only files below limit are
   * allowed
   * @param e The change event.
   */
  function onImageSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (!files || !files.length) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      e.target.value = '';
      alert('Maximum file size is 10MB');
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const img = new Image();
      img.src = fileReader.result as string;
      img.onload = () => {
        setAppState({
          imageDimensions: {
            width: img.width,
            height: img.height,
          },
          imageSrc: img.src,
        });
      };
    };
  }

  return (
    <DS.Step visible={visible}>
      <IS.Container>
        <DS.Partition>
          <DS.Heading>Step 2: Select Your Design</DS.Heading>
          <DS.Text>
            Choose your existing design template on which to print each listed
            name.
          </DS.Text>
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
          <IS.SmallPrint>
            * Supported image formats are JPEG and PNG. Maximum image size is
            10MB.
          </IS.SmallPrint>
        </DS.Partition>
        <DS.Partition>
          <IS.ImagePreview>
            <PreviewImage src={appState.imageSrc} />
          </IS.ImagePreview>
        </DS.Partition>
      </IS.Container>
      <DS.Footer>
        <DS.Button
          bgColor={COLOR.PRIMARY_4_DARK}
          onClick={() => setCurrentStep(0)}>
          <FontIcon icon={faChevronLeft} spaceRight={true} />
          Previous
        </DS.Button>
        <DS.FooterLink href={'/design/editor'}>
          <DS.Button
            bgColor={COLOR.PRIMARY_4_LIGHT}
            visible={!!appState.imageSrc}>
            Start Editing
          </DS.Button>
        </DS.FooterLink>
      </DS.Footer>
    </DS.Step>
  );
}

function PreviewImage({ src }: PreviewImageProps) {
  if (!src) return null;
  return <NextImage src={src} layout={'fill'} objectFit={'contain'} />;
}

interface PreviewImageProps {
  src: string | null;
}
