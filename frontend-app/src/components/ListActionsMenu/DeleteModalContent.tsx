import { useMutation } from '@apollo/client';
import { AlertDialogContent, AlertDialogFooter, AlertDialogHeader, forwardRef } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import { useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

const { DELETE_COMPANY_LIST } = ListsMutations;

const DeleteModalContent = forwardRef((props: { list: any; close: () => void }, cancelRef: any) => {
  const { t } = useTranslation();
  const { list, close } = props;
  const { enqueueSnackbar } = useStimulusToast();

  const [deleteList, { loading }] = useMutation(DELETE_COMPANY_LIST, {
    update: (cache, { data: { deleteCompanyList } }) => {
      if (deleteCompanyList.error) {
        enqueueSnackbar(t('There was an error. Please try again'), { status: 'error' });
      } else {
        enqueueSnackbar(t(`List ${list?.name} deleted`), { status: 'success' });
        navigate('/companies/all/list/1');
      }
      close();
    },
  });
  return (
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        {t('Delete')} {list.name}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <StimButton size="stimSmall" variant="stimOutline" ref={cancelRef} onClick={close}>
          {t('Cancel')}
        </StimButton>
        <StimButton
          size="stimSmall"
          isLoading={loading}
          variant="stimDestructive"
          onClick={() => deleteList({ variables: { id: Number(list.id) } })}
          ml={3}
        >
          {t('Delete')}
        </StimButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});

export default DeleteModalContent;
