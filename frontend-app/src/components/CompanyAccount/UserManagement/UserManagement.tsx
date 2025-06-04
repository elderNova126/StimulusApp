import { useMutation } from '@apollo/client';
import { Box, Container, Input, Stack, Text } from '@chakra-ui/react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { RouteComponentProps } from '@reach/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserManagementList } from '../../../graphql/Models/UsersList';
import UserMutations from '../../../graphql/Mutations/UserMutations';
import UserQueries from '../../../graphql/Queries/UserQueries';
import { useStimulusToast } from '../../../hooks';
import { CompanyProfileDivider } from '../../Company/shared';
import { Pagination } from '../../GenericComponents';
import GenericModal from '../../GenericModal/index';
import PendingTable from './PendingTable';
import TableUsers from './TableUsers';
import { useActiveUsers, usePendingUsers } from './UserManagementHooks';
import UserUpdate from './UserUpdate';
import LoadingScreen from '../../LoadingScreen';
import StimButton from '../../ReusableComponents/Button';

export interface User {
  id?: string | null;
  externalAuthSystemId?: string | null;
  givenName?: string | null;
  surname?: string | null;
  mail?: string | null;
  email?: string | null;
  jobTitle?: string | null;
  mobilePhone?: string | null;
  displayName?: string | null;
  businessPhones?: string[];
  accountEnabled?: boolean | null;
}
const EMAIL_REGEX = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$";
const { TENANT_USERS_GQL } = UserQueries;
const { DELETE_USER, INVITE_USER_GQL } = UserMutations;

const UserManagement = (props: RouteComponentProps) => {
  const { t } = useTranslation();

  const [deleteUser] = useMutation(DELETE_USER);

  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [invitationToResend, setInvitationToResend] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [emailToInvite, setEmailToInvite] = useState<string>();
  const [inviteError, setInviteError] = useState<boolean>(false);
  const { enqueueSnackbar } = useStimulusToast();
  const [inviteUser, { loading }] = useMutation(INVITE_USER_GQL);
  const [pageActiveUsers, setPageActiveUsers] = useState(1);
  const [limitActiveUsers, setLimitActiveUsers] = useState(10);
  const [pagePendingUsers, setPagePendingUsers] = useState(1);
  const [limitPendingUsers, setLimitPendingUsers] = useState(10);

  const {
    loading: loadingActiveUsers,
    data: activeUsersData,
    count: activeUsersCount,
  } = useActiveUsers(pageActiveUsers, limitActiveUsers);
  const {
    loading: loadingPendingUsers,
    data: pendingUsersData,
    count: pendingUsersCount,
  } = usePendingUsers(pagePendingUsers, limitPendingUsers, UserManagementList.PENDING);

  useEffect(() => {
    setPageActiveUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitActiveUsers]);

  useEffect(() => {
    setPagePendingUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitPendingUsers]);

  const removeModalActions = [
    { label: 'Cancel', onClick: () => setUserToRemove(null), color: 'white', colorScheme: 'red' },
    {
      label: 'Remove',
      colorScheme: 'green',
      color: 'white',
      onClick: () => {
        deleteUser({
          variables: { externalAuthSystemId: userToRemove?.externalAuthSystemId },
          update: (cache, { data }) => {
            if (data !== null && data?.deleteTenantUser?.done === true) {
              enqueueSnackbar(t('User deleted'), { status: 'success' });
            }
            setUserToRemove(null);
            setUserToEdit(null);
          },
          refetchQueries: [{ query: TENANT_USERS_GQL, variables: { page: pageActiveUsers, limit: limitActiveUsers } }],
        });
      },
    },
  ];

  const invitationToResendActions = [
    { label: t('Cancel'), onClick: () => setInvitationToResend(null), color: 'white', colorScheme: 'red' },
    {
      label: t('Confirm'),
      colorScheme: 'green',
      color: 'white',
      onClick: () => {
        inviteUser({ variables: { email: invitationToResend?.email, resend: true } });
        setInvitationToResend(null);
        setUserToEdit(null);
      },
    },
  ];

  const sendInvitation = () => {
    if (emailToInvite?.match(EMAIL_REGEX) && !activeUsersData?.some((user: any) => user.email === emailToInvite)) {
      inviteUser({
        variables: { email: emailToInvite },
        update: (cache, { data: { inviteTenantUser } }) => {
          if (inviteTenantUser) {
            enqueueSnackbar(t('User Invited'), { status: 'success' });
          }
        },
        refetchQueries: [
          {
            query: TENANT_USERS_GQL,
            variables: { page: pagePendingUsers, limit: limitPendingUsers, typeOfList: 'pending' },
          },
        ],
      });
      setEmailToInvite('');
    } else {
      enqueueSnackbar(t('User Already Exists'), { status: 'error' });
      setInviteError(true);
    }
  };

  return (
    <div>
      <Text as="h1" textStyle="h1_profile" mb="5rem">
        {t('User Management')}
      </Text>
      {userToEdit ? (
        <UserUpdate user={userToEdit} onClose={() => setUserToEdit(null)} />
      ) : (
        <>
          <Stack spacing={1} alignItems="start" data-testid="userManagement" mb="30px">
            <Stack w="100%" mb="5rem">
              <Text fontSize="18px" data-testid="userManagement-title">
                {t('Current Users')}
              </Text>
              {loadingActiveUsers ? (
                <LoadingScreen />
              ) : (
                <Box data-testid="loadedUsers-container">
                  <Stack spacing={6}>
                    <Pagination
                      count={activeUsersCount ?? 0}
                      rowsPerPage={limitActiveUsers}
                      page={pageActiveUsers}
                      onChangePage={setPageActiveUsers}
                      onChangeRowsPerPage={setLimitActiveUsers}
                      rowsPerPageOptions={[5, 10, 15]}
                    />
                    <CompanyProfileDivider />
                    <Box>
                      <TableUsers
                        setUserToRemove={setUserToRemove}
                        currentPosts={activeUsersData}
                        setUserToEdit={setUserToEdit}
                        loadingUsers={loadingActiveUsers}
                      />
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
            <Stack w="100%">
              <Text fontSize="18px" data-testid="userManagement-title">
                {t('Access Request')}
              </Text>
              <CompanyProfileDivider />
              <Stack spacing="10" isInline>
                <Stack>
                  <Box>
                    <Text my="20px" fontWeight="600" align="start">
                      {t('Invite New Users')}
                    </Text>
                  </Box>
                  <Container
                    maxWidth="md"
                    data-testid="inviteModal-container"
                    padding="40px"
                    bg="#F6F6F6"
                    border="1px solid #E4E4E4"
                    width="380px"
                    height="400px"
                    shadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
                  >
                    <Stack justifyContent="start" spacing={2}>
                      <Box>
                        <label>
                          <Text fontWeight="600" mb="15px">
                            {t('User Email')}
                          </Text>
                          <Input
                            bg="#FFFFFF"
                            name="emailToInvite"
                            value={emailToInvite}
                            onChange={(e) => setEmailToInvite(e.target.value)}
                            variant="outline"
                            type="email"
                          />
                        </label>
                        <Stack
                          visibility={inviteError && !emailToInvite?.match(EMAIL_REGEX) ? 'visible' : 'hidden'}
                          mt="2px"
                        >
                          <Text data-testid="first-name-field-error" role="alert">
                            {t('This is an email field')}
                          </Text>
                        </Stack>
                        <StimButton
                          position="absolute"
                          mt="12rem"
                          mr={3}
                          type="submit"
                          onClick={sendInvitation}
                          isLoading={loading}
                          disabled={!!emailToInvite === false ? true : false}
                        >
                          {t('Send Invite')}
                        </StimButton>
                      </Box>
                    </Stack>
                  </Container>
                </Stack>
                <Stack w="100%">
                  <Box>
                    <Text my="20px" fontWeight="600" align="start">
                      {t('Pending Invitations')}
                    </Text>
                  </Box>
                  {loadingPendingUsers ? (
                    <LoadingScreen />
                  ) : (
                    <>
                      <Pagination
                        count={pendingUsersCount ?? 0}
                        rowsPerPage={limitPendingUsers}
                        page={pagePendingUsers}
                        onChangePage={setPagePendingUsers}
                        onChangeRowsPerPage={setLimitPendingUsers}
                        rowsPerPageOptions={[5, 10, 15]}
                      />
                      <CompanyProfileDivider />
                      <PendingTable
                        pendingUsers={pendingUsersData ?? []}
                        setInvitationToResend={setInvitationToResend}
                      />
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {invitationToResend && (
            <GenericModal
              onClose={() => setInvitationToResend(null)}
              buttonActions={invitationToResendActions}
              justifyActions="space-between"
            >
              <div>
                <Stack>
                  <Box>
                    <Text align="center">
                      {t('Once you press “Confirm", an email will be send to ')}
                      {invitationToResend.email}
                    </Text>
                  </Box>
                </Stack>
              </div>
            </GenericModal>
          )}
          {userToRemove && (
            <GenericModal
              onClose={() => setUserToRemove(null)}
              buttonActions={removeModalActions}
              justifyActions="space-between"
            >
              <div>
                <Stack justifyContent="center">
                  <Box>
                    <Text align="center">
                      <DeleteForeverIcon />
                    </Text>
                  </Box>
                  <Box>
                    <Text align="center" color="secondary">
                      <b>
                        {t('You are about to remove user ') +
                          `${userToRemove?.givenName ?? ''} ${userToRemove?.surname ?? ''}`}
                      </b>
                    </Text>
                    <Text align="center">{t('Are you sure?')}</Text>
                  </Box>
                </Stack>
              </div>
            </GenericModal>
          )}
        </>
      )}
    </div>
  );
};
export default UserManagement;
