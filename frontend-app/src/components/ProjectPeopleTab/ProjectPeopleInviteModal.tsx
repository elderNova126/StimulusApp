import { SearchIcon } from '@chakra-ui/icons';
import { ListItem, Skeleton, Text, Input, InputGroup, InputLeftElement, Center, Box, List } from '@chakra-ui/react';
import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../hooks';
import Dialog from '../GenericComponents/Dialog';
import UserRow from './UserRow';
import { useSearchUsers } from './inviteHook';

interface Props {
  projectId: number;
  invitedUsers: any[];
  onClose: () => void;
  isOpen: boolean;
}

const ProjectPeopleInviteModal: FC<Props> = ({ projectId, invitedUsers, onClose, isOpen }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  const [pendingList, setPendingList] = useState<any>([]);

  const {
    user: { sub },
  } = useUser();

  useEffect(() => {
    const listOfPending = invitedUsers?.filter?.(({ id, userType }: any) => id !== sub && userType !== 'collaborator');
    setPendingList(listOfPending);
  }, [invitedUsers, sub]);

  const { data, loading: loadingSearchUser } = useSearchUsers(searchValue);

  const usersToInvite = data?.getUserByName?.results?.filter?.(
    ({ externalAuthSystemId }: any) =>
      externalAuthSystemId !== sub && !invitedUsers?.some((invitedUser) => invitedUser?.id === externalAuthSystemId)
  );

  const filteredUsersToInvite = usersToInvite?.filter(
    (user: any) =>
      user?.givenName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user?.surname?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Dialog
      closeButton={true}
      mt="20vh"
      h="370px"
      w="470px"
      fontSize="18px"
      fontWeight="400"
      border="1px solid var(--tooltip-box, #E4E4E4)"
      bg="#F6F6F6"
      boxShadow="box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25)"
      isOpen={isOpen}
      onClose={onClose}
      title={t('Invite User')}
    >
      <>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            id="input-search-people"
            w="400px"
            bg="#FDFDFD"
            border="1px solid #D4D4D4"
            type="text"
            placeholder="Search Connections"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <Box mt="1rem" h="210px" overflowY="scroll" overflowX="hidden" className="scrollBarInvites">
          {searchValue === '' ? (
            <List>
              {(pendingList ?? []).map((user: any, index: number) => (
                <UserRow
                  key={`${index}_${projectId}`}
                  projectId={projectId}
                  invitedUsers={invitedUsers}
                  pending={true}
                  setSearchValue={setSearchValue}
                  user={user ?? {}}
                />
              ))}
            </List>
          ) : loadingSearchUser ? (
            <List>
              {new Array(5).fill(null).map((_, i) => (
                <ListItem
                  marginTop="1rem"
                  _hover={{ bg: '#F6F6F6' }}
                  display="flex"
                  mx="8px"
                  flexDir="column"
                  w="98%"
                  key={i}
                >
                  <Skeleton height="20px" startColor="green.100" endColor="green.400" />
                </ListItem>
              ))}
            </List>
          ) : (
            <List>
              {filteredUsersToInvite?.length > 0 ? (
                filteredUsersToInvite.map((user: any, index: number) => (
                  <UserRow
                    key={`${index}_${projectId}`}
                    projectId={projectId}
                    invitedUsers={invitedUsers}
                    pending={false}
                    setSearchValue={setSearchValue}
                    user={user ?? {}}
                  />
                ))
              ) : (
                <Center my="5.5rem">
                  <Text>{t('No users found')}</Text>
                </Center>
              )}
            </List>
          )}
        </Box>
      </>
    </Dialog>
  );
};

export default ProjectPeopleInviteModal;
