import { Box, Stack, Table, Td, Text, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { UserAvatar } from '../../GenericComponents';
import { useTranslation } from 'react-i18next';
import { User } from '../../../graphql/types';
import StimButton from '../../ReusableComponents/Button';
const TableUsers = (props: {
  currentPosts: User[];
  setUserToEdit: (user: any) => void;
  setUserToRemove: (user: any) => void;
  loadingUsers: boolean;
}) => {
  const { currentPosts, setUserToEdit, setUserToRemove, loadingUsers } = props;
  const { t } = useTranslation();
  return (
    <>
      {loadingUsers === false && !!currentPosts?.length === false ? (
        <Text color="textSecondary">
          {t(
            ' Currently, there are no users added to the account. Please click ‘Add User’ to invite users to the platform.'
          )}
        </Text>
      ) : (
        <Stack maxHeight="500px" overflowY="scroll">
          <Table>
            <Thead>
              <Tr>
                <Th
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  borderTop="none"
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {t('NAME')}
                </Th>
                <Th
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  borderTop="none"
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {t('EMAIL')}
                </Th>
                <Th
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  borderTop="none"
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {t('STATUS')}
                </Th>
                <Th
                  border="0.5px solid #D5D5D5"
                  borderLeft="none"
                  borderRight="none"
                  borderTop="none"
                  cursor={'pointer'}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {t('TITLE')}
                </Th>
                <Th border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" borderTop="none" />
              </Tr>
            </Thead>
            <Tbody>
              {currentPosts?.map((user: User) => (
                <Tr key={user.id} _hover={{ bg: '#F6F6F6' }}>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
                    <Stack isInline>
                      <Box marginRight={'35px'}>
                        <UserAvatar userId={user?.externalAuthSystemId} />
                      </Box>
                      <Text
                        cursor="pointer"
                        as="h3"
                        textStyle="h3"
                        fontWeight="semibold"
                        marginLeft="25px"
                        _hover={{ textDecor: 'underline' }}
                        lineHeight="30px"
                        onClick={(e: any) => setUserToEdit(user)}
                      >
                        {`${user.givenName && user.surname ? user.givenName + ' ' + user.surname : 'N/A'}`}
                      </Text>
                    </Stack>
                  </Td>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" fontSize="15px">
                    {user.email}
                  </Td>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" fontSize="15px">
                    {user.accountEnabled ? t('Active') : t('Inactive')}
                  </Td>
                  <Td
                    border="0.5px solid #D5D5D5"
                    borderLeft="none"
                    borderRight="none"
                    textDecor="underline"
                    fontSize="15px"
                  >
                    {user.jobTitle ? user.jobTitle : t('N/A')}
                  </Td>
                  <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" fontSize="15px">
                    <StimButton
                      size="stimSmall"
                      variant="stimTextButton"
                      maxH="34px"
                      onClick={() => setUserToRemove(user)}
                    >
                      {t('Remove')}
                    </StimButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Stack>
      )}
    </>
  );
};

export default TableUsers;
