import { useMutation } from '@apollo/client';
import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import * as R from 'ramda';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import UserMutations from '../../../graphql/Mutations/UserMutations';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { useAssetUri, useErrorTranslation, useStimulusToast } from '../../../hooks';
import { AvatarResizer } from '../../../utils/file';
import { FormCompanyContext } from '../../../hooks/companyForms/companyForm.provider';
import { CompanyFormFields } from '../../../hooks/companyForms/FormValidations';
import FormErrorsMessage from '../../GenericComponents/FormErrorsMessage';
import StimButton from '../../ReusableComponents/Button';
const { UPLOAD_ASSET } = UserMutations;
const { COMPANY_OR_USER_ASSETS } = CompanyQueries;
const UploadModal = (props: { isOpen: boolean; onClose: () => void; companyId: string }) => {
  const [uploadCompanyImage, { loading }] = useMutation(UPLOAD_ASSET);
  const { isOpen, onClose, companyId } = props;
  const [image, setImage] = useState<File | null>(null);
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();
  // eslint-disable-next-line
  const { refetch } = useAssetUri({ ...(companyId && { companyId }) });
  const errTranslations = useErrorTranslation();
  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue, clearErrors } = formMethods;

  const uploadImage = (file: any, companyId: any) => {
    const updatedFile = new File([file], file.name.replace(/[^\w\s]| /g, ''));
    AvatarResizer(updatedFile).then((file) => {
      uploadCompanyImage({
        variables: { file, companyId },
        update: (cache, { data: { uploadAsset } }) => {
          const { assetDetails } = R.clone(
            cache.readQuery({ query: COMPANY_OR_USER_ASSETS, variables: { companyId } })
          ) as any;
          assetDetails.results = [...(assetDetails?.results || []), uploadAsset];

          cache.writeQuery({
            query: COMPANY_OR_USER_ASSETS,
            variables: { companyId },
            data: { assetDetails: { ...assetDetails } },
          });
          onClose();
          clearErrors();
          setImage(null);

          if (uploadAsset?.id) {
            refetch(uploadAsset.id);
          }

          if (uploadAsset?.error) {
            return enqueueSnackbar(errTranslations[uploadAsset.code], { status: 'error' });
          }

          return enqueueSnackbar(t('Logo changed successfully'), { status: 'success' });
        },
      });
    });
  };

  const onSubmit = () => {
    uploadImage(image, companyId);
  };

  return (
    <form>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          clearErrors();
          setImage(null);
          setValue(CompanyFormFields.UPLOAD_PICTURE, '', { shouldValidate: true });
        }}
        size="xl"
      >
        <ModalOverlay sx={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }} />
        <ModalContent backgroundColor="#f6f6f6" border="1px solid #e4e4e4">
          <ModalHeader mt="10px">{t('Change Logo Image')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody my="15px">
            <Text>{t('Your New Image (SVG, PNG, JPG)')}</Text>
            <Input
              name="image"
              type="file"
              accept=".svg, .png, .jpg, .jpeg"
              className="modalUpload"
              border="none"
              my="15px"
              marginLeft="-1rem"
              textStyle="body"
              {...register(CompanyFormFields.UPLOAD_PICTURE)}
              onChange={(e) => {
                const imageType = e?.target?.files?.[0]?.type;
                setValue(CompanyFormFields.UPLOAD_PICTURE, imageType, { shouldValidate: true });
                setImage(e?.target?.files?.[0] as any);
              }}
            />
            <FormErrorsMessage errorMessage={errors?.[CompanyFormFields.UPLOAD_PICTURE]?.message} />
          </ModalBody>
          <ModalFooter justifyContent="start" mt="25px" mb="10px">
            <StimButton
              mr={3}
              type="submit"
              onClick={onSubmit}
              isLoading={loading}
              disabled={!!Object.keys(errors).length || image === null}
            >
              {t('Save Changes')}
            </StimButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
};

export default UploadModal;
