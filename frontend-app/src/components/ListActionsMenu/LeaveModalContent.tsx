import { useMutation } from '@apollo/client';
import { AlertDialogContent, AlertDialogFooter, AlertDialogHeader, forwardRef } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SharedListStatus } from '../../graphql/Models/SharedList';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import { useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

const { CHANGE_STATUS_SHARED_LIST } = ListsMutations;

const LeaveModalContent = forwardRef((props: { list: any; close: () => void }, cancelRef: any) => {
  const { t } = useTranslation();
  const { list, close } = props;
  const { enqueueSnackbar } = useStimulusToast();
  const sharedListResult = useSelector((state: any) => state.generalData.sharedLists);

  const [leaveList, { loading: changeStatusLoading }] = useMutation(CHANGE_STATUS_SHARED_LIST, {
    update: (cache, { data: { changeStatusSharedList } }) => {
      if (changeStatusSharedList.error) {
        enqueueSnackbar(t('There was an error. Please try again'), { status: 'error' });
      } else {
        enqueueSnackbar(t('List left'), { status: 'success' });
        navigate('/companies/all/list/1');
      }
      close();
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        {t('Leave')} {list.name}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <StimButton size="stimSmall" variant="stimOutline" ref={cancelRef} onClick={close}>
          {t('Cancel')}
        </StimButton>
        <StimButton
          size="stimSmall"
          isLoading={changeStatusLoading}
          variant="stimDestructive"
          onClick={() => {
            const sharedList = sharedListResult.find(
              (sharedList: any) => sharedList.companyList?.id === list.id && sharedList.companyList?.name === list.name
            );
            if (sharedList) {
              leaveList({
                variables: {
                  id: sharedList.id.toString(),
                  listId: list.id.toString(),
                  status: SharedListStatus.DELETED,
                },
              });
            }
          }}
          ml={3}
        >
          {t('Delete')}
        </StimButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});

export default LeaveModalContent;
