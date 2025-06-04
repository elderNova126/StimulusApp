import { Box, Stack, Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { User } from '../../../graphql/types';
import { UserAvatar } from '../../GenericComponents';
import StimButton from '../../ReusableComponents/Button';

const PendingTable = (props: { pendingUsers: User[]; setInvitationToResend: (data: any) => void }) => {
  const { pendingUsers, setInvitationToResend } = props;
  const { t } = useTranslation();

  return (
    <Table>
      <Tbody>
        {pendingUsers?.map((invited: User) => {
          return (
            <Tr key={invited.id} _hover={{ bg: '#F6F6F6' }}>
              <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
                <Stack isInline>
                  <Box marginRight={'15px'}>
                    <UserAvatar userId={invited.id} />
                  </Box>
                  <Text as="h3" textStyle="h3" fontWeight="semibold" lineHeight="30px">
                    {invited.email}
                  </Text>
                </Stack>
              </Td>
              <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" fontSize="15px">
                <Box>
                  <StimButton
                    data-testid="submit-button"
                    size="stimSmall"
                    onClick={() => setInvitationToResend(invited)}
                  >
                    {t('Resend')}
                  </StimButton>
                </Box>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default PendingTable;
