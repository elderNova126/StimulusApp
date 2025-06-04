import { Input, Stack, Text, Spinner, FormLabel } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser, useLazyAssetUri } from '../../../hooks';
import { UserAvatar } from '../../GenericComponents';
import { useSelector } from 'react-redux';
import { useUploadImage, useRemovePhoto } from '../../../hooks/assets';
import { AvatarResizer } from '../../../utils/file';
import StimButton from '../../ReusableComponents/Button';

const ImageContainer: FC = () => {
  const {
    user: { sub: currentUserId },
  } = useUser();
  const { t } = useTranslation();
  const [getAsset, { assetUri, refetch, clearAsset }] = useLazyAssetUri();
  const [error, setError] = useState('');
  const loadingLogo = useSelector((state: any) => state.generalData.loadingLogo.user);
  const { loadingImage, uploadProfileImage } = useUploadImage();
  const { deleteProfileimage } = useRemovePhoto();

  useEffect(() => {
    getAsset({ variables: { userId: currentUserId } });
  }, [loadingLogo, currentUserId]);

  const onChangeFile = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => {
    const supportedFormats = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (supportedFormats.includes(file?.type)) {
      AvatarResizer(file).then((file: any) => {
        const updatedFile = new File([file], file.name.replace(/[^\w\s]| /g, ''));
        file && validity.valid && uploadImage(updatedFile);
      });
    } else {
      setError(
        'Upload Failed: There was an issue processing your image. Please ensure the file format is supported (e.g., SVG, JPEG, PNG) and try again.'
      );
    }
  };

  const uploadImage = (file: File) => {
    uploadProfileImage(file, currentUserId, null, refetch, clearAsset);
    setError('');
  };
  const removePhoto = () => {
    deleteProfileimage(currentUserId, null, clearAsset);
    setError('');
  };

  return (
    <Stack w="300px" alignItems="center">
      {loadingLogo ? (
        <Spinner color="#15844b" borderRadius="50%" width="55px" height="55px" />
      ) : (
        <>
          {currentUserId && <UserAvatar size="xl" userId={currentUserId ?? ''} />}
          <StimButton size="stimSmall" variant="stimOutline">
            <>
              <FormLabel htmlFor="file" w="50px" h="10px">
                {t('Change')}
              </FormLabel>
              <Input
                id="file"
                type="file"
                onChange={onChangeFile}
                multiple={false}
                hidden
                accept=".svg, .png, .jpg, .jpeg"
                onClick={(e) => {
                  (e.currentTarget.value as any) = null;
                }}
              />
            </>
          </StimButton>
          {!!error && (
            <Text textStyle="h6" color="secondary">
              {t(error)}
            </Text>
          )}
          <StimButton
            size="stimSmall"
            data-testid="remove-photo-button"
            variant="stimTextButton"
            disabled={!assetUri}
            onClick={removePhoto}
          >
            {!loadingImage && (
              <Text textStyle="miniTextLink" color="#000">
                {t('Remove')}
              </Text>
            )}
          </StimButton>
        </>
      )}
    </Stack>
  );
};

export default ImageContainer;
