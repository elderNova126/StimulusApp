import { Flex, Spinner, Text, Center, Box } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../graphql/types';
import { capitalizeFirstLetter } from '../../utils/dataMapper';
import { UserAvatar } from '../GenericComponents';
import { useSendInvitation } from './inviteHook';
import StimButton from '../ReusableComponents/Button';

interface Props {
  projectId: number;
  invitedUsers: any[];
  user: any;
  setSearchValue: (value: string) => void;
  pending: boolean;
}

const UserRow: FC<Props> = ({ projectId, invitedUsers, user, setSearchValue, pending }) => {
  const { t } = useTranslation();

  const { sendUserInvitation, inviteLoading } = useSendInvitation(projectId, setSearchValue);

  return (
    <Flex justifyContent="space-between" borderBottom="1px solid #D4D4D4">
      <Center>
        <UserAvatar userId={user.externalAuthSystemId} name={`${user?.givenName} ${user?.surname}`} />
        <Box m="1rem 1rem 1rem 0.5rem">
          <Box fontWeight="600" fontSize="14px" mb="-3px">
            {capitalizeFirstLetter(user?.givenName ?? '')} {capitalizeFirstLetter(user?.surname ?? '')}
          </Box>
          <Box fontSize="12px" color="#666">
            {user?.email}
          </Box>
        </Box>
      </Center>
      <StimButton
        mt="10px"
        variant="stimTextButton"
        maxH="34px"
        paddingLeft="0px"
        {...(pending && { cursor: 'auto' })}
        {...(!pending && {
          onClick: () => {
            if (!invitedUsers.find(({ id }: User) => user.id === id)) {
              sendUserInvitation({ userId: user.externalAuthSystemId, projectId, userType: 'collaborator' });
            }
          },
        })}
      >
        {pending ? (
          <Text textStyle="textLink" textDecor="none" cursor="auto">
            {t('Pending')}
          </Text>
        ) : (
          <Text textStyle="textLink">{inviteLoading ? <Spinner /> : t('Invite')}</Text>
        )}
      </StimButton>
    </Flex>
  );
};

export default UserRow;
