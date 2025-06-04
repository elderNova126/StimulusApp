import { useLazyQuery, useMutation } from '@apollo/client';
import { Box, Button, CircularProgress, Flex, Skeleton, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ISharedList, SharedListStatus } from '../../../graphql/Models/SharedList';
import ListsMutations from '../../../graphql/Mutations/ListsMutations';
import UserQueries from '../../../graphql/Queries/UserQueries';
import { useStimulusToast } from '../../../hooks';
import { setSharedLists } from '../../../stores/features/generalData';
import { capitalizeFirstLetter } from '../../../utils/dataMapper';
import { utcStringToLocalDate } from '../../../utils/date';
import { UserAvatar } from '../../GenericComponents';
import useStyles from './styles';
export interface IPendingInvitationItem {
  listInvitation: any;
}
const { GET_USER_BY_ID } = UserQueries;

export const PendingInvitationItem = (props: IPendingInvitationItem) => {
  const { listInvitation } = props;

  const classes = useStyles();
  const { CHANGE_STATUS_SHARED_LIST } = ListsMutations;
  const [changeStatusInvitation, { loading: changeStatusLoading }] = useMutation(CHANGE_STATUS_SHARED_LIST);
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();
  const sharedListResult: ISharedList[] = useSelector((state: any) => state.generalData.sharedLists);
  const [getCreatorUser, { data: userCreator }] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: 'network-only',
  });
  const [getTransmitterUser, { data: transmitterUser }] = useLazyQuery(GET_USER_BY_ID, {
    fetchPolicy: 'network-only',
  });
  const dispatch = useDispatch();

  const onChangeStatus = (status: SharedListStatus) => {
    changeStatusInvitation({
      variables: {
        id: listInvitation.id,
        listId: listInvitation.companyList.id,
        status,
      },
      update: (cache, { data }) => {
        let previewSharedList: any = {
          ...sharedListResult.find((sharedList) => sharedList.id === data.changeStatusSharedList.id),
        };
        if (previewSharedList) {
          previewSharedList = { ...previewSharedList, status: data.changeStatusSharedList.status };
          dispatch(setSharedLists([{ ...sharedListResult, ...previewSharedList }]));
          if (data?.createShareList) {
            enqueueSnackbar(t('Invitation accepted successfully'), { status: 'success' });
          }
        }
      },
      onError(error) {
        enqueueSnackbar('Failed to accept invitation', { status: 'error' });
      },
    });
  };

  useEffect(() => {
    getCreatorUser({
      variables: {
        externalAuthSystemId: listInvitation?.companyList?.createdBy,
      },
    });
    getTransmitterUser({
      variables: {
        externalAuthSystemId: listInvitation?.createdBy,
      },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const LoadingSkeleton = () => (
    <Skeleton height="15px" my={1} width="100%" startColor="green.100" endColor="green.400" />
  );

  return (
    <>
      <Flex className={classes.container}>
        <Flex flexShrink={1} className={classes.body}>
          <Box>
            <Text className={classes.title}>{listInvitation?.companyList?.name}</Text>
            <Text className={classes.subtitle}>{`Company List - Invited ${utcStringToLocalDate(
              listInvitation?.created
            )}`}</Text>
            {userCreator ? (
              <Box className={classes.extraInfo}>
                <p>
                  <UserAvatar className={classes.userAvatar} size="2xs" userId={userCreator?.getUserById?.id} />
                  {`Owned by ${capitalizeFirstLetter(userCreator?.getUserById?.givenName)} ${capitalizeFirstLetter(
                    userCreator?.getUserById?.surname
                  )}`}
                </p>
              </Box>
            ) : (
              <LoadingSkeleton />
            )}
            {transmitterUser ? (
              <Box className={classes.extraInfo}>
                <p>
                  <UserAvatar className={classes.userAvatar} size="2xs" userId={transmitterUser?.getUserById?.id} />
                  {`Invited by ${capitalizeFirstLetter(
                    transmitterUser?.getUserById?.givenName
                  )} ${capitalizeFirstLetter(transmitterUser?.getUserById?.surname)}`}
                </p>
              </Box>
            ) : (
              <LoadingSkeleton />
            )}
          </Box>
        </Flex>

        <Flex justifyContent={'center'}>
          {changeStatusLoading ? (
            <Flex justifyContent="center" w="150px">
              <CircularProgress isIndeterminate size="24px" />
            </Flex>
          ) : (
            <Flex className={classes.actionsContainer}>
              <Button
                className={classes.actionButton}
                onClick={() => onChangeStatus(SharedListStatus.APPROVED)}
                variant={'link'}
              >
                Accept
              </Button>
              <Button
                className={classes.actionButton}
                onClick={() => onChangeStatus(SharedListStatus.DECLINED)}
                variant={'link'}
              >
                Decline
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};
