import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Flex, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CreateApiKeyHook } from '../../../hooks/tenant';
import StimButton from '../../ReusableComponents/Button';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

function NewApiKeyModal(props: IProps) {
  const { isOpen, onClose } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createNewApiKey, loading: loadingCreate } = CreateApiKeyHook();
  const { t } = useTranslation();

  function onSubmit(data: any) {
    createNewApiKey({ name: data?.name })
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('New Api Key')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel>{t('Title*')}</FormLabel>
              <TextField
                inputProps={{
                  'data-testid': 'company-name-field',
                  ref: register({ required: t('This is required') as string }),
                }}
                name="name"
                fullWidth
                variant="outlined"
                autoFocus
                error={errors.name}
              />
            </FormControl>
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>

            <Flex pt={5} justifyContent={'end'}>
              <StimButton type="submit" isLoading={loadingCreate}>
                {t('Save')}
              </StimButton>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default NewApiKeyModal;
