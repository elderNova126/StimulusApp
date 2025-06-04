import { Input } from '@chakra-ui/input';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormControl,
  FormErrorMessage,
  forwardRef,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import StimButton from '../ReusableComponents/Button';

const NewListModalContent = forwardRef(
  (
    props: {
      loadingList: boolean;
      newListModalOpen: boolean;
      close: () => void;
      createCompanyList: (data: any) => void;
    },
    cancelRef: any
  ) => {
    const { t } = useTranslation();
    const { newListModalOpen, close, createCompanyList, loadingList } = props;
    const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
    } = useForm();

    const onSubmit = (data: any) => {
      createCompanyList({ variables: { name: data.nameList } });
      reset();
    };
    return (
      <AlertDialog isOpen={newListModalOpen} leastDestructiveRef={cancelRef} onClose={() => close()}>
        <AlertDialogOverlay>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {t('Create new list')}
              </AlertDialogHeader>
              <AlertDialogBody>
                <FormControl isInvalid={errors.nameList}>
                  <Text as="h4" textStyle="h4">
                    {t('Name')}
                  </Text>
                  <Input
                    id="nameList"
                    placeholder="Name"
                    onChange={(e) => setValue('nameList', e.target.value)}
                    name="nameList"
                    {...register('nameList', {
                      required: 'This is required',
                    })}
                  />
                  <FormErrorMessage>{errors.nameList && errors.nameList.message}</FormErrorMessage>
                </FormControl>
              </AlertDialogBody>

              <AlertDialogFooter>
                <StimButton size="stimSmall" variant="stimOutline" ref={cancelRef} onClick={() => close()}>
                  {t('Cancel')}
                </StimButton>
                <StimButton size="stimSmall" isLoading={loadingList} type="submit" ml="1rem">
                  {t('Add')}
                </StimButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  }
);

export default NewListModalContent;
