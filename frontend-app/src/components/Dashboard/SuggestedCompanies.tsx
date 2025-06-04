import { Stack, Text, Table, Thead, Tbody, Tr, Th, Td, HStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { CompanyAvatar } from '../GenericComponents';
import StatusLabel from '../Company/LeftMenu/StatusLabel';
import { companies } from './DummyAiGrantData';
import Beta from '../Common/Beta';
import StimButton from '../ReusableComponents/Button';

const SuggestedCompanies = () => {
  const { t } = useTranslation();
  return (
    <Stack w="1090px" border="1px solid #E4E4E4" rounded="4px" h="300px" p="6px">
      <HStack>
        <Text fontSize="16px" mt="10px" fontWeight="600" pl="7">
          {t('Suggested Companies')}
        </Text>
        <Beta />
      </HStack>
      <Table w="1082px" h="300px" overflowY="scroll" display="block">
        <Thead>
          <Tr>
            <Th border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" width="65%">
              {t('COMPANY NAME')}
            </Th>
            <Th border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" width="15%" fontSize="11px">
              {t('STATUS')}
            </Th>
            <Th border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" width="10%" fontSize="11px">
              {t('SCORE')}
            </Th>
            <Th border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none" width="10%" fontSize="11px"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {companies.map((company) => (
            <CustomRow companyName={company.name} score={company.score} />
          ))}
        </Tbody>
      </Table>
    </Stack>
  );
};

const CustomRow = (props: { companyName: string; score: number }) => {
  const { t } = useTranslation();
  const { companyName, score } = props;
  return (
    <Tr cursor="pointer" _hover={{ bg: '#F6F6F6' }}>
      <Td border="0.5px solid #D5D5D5" borderLeft="none" width="185px" borderRight="none">
        <HStack alignItems="center" spacing={2}>
          <CompanyAvatar p="1px" mr="3px" size="2xs" mt="1px" companyId="89c691d4-e3a0-4e74-ac29-08bf278ec22b" />
          <Text fontSize="14px">{companyName}</Text>
        </HStack>
      </Td>
      <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
        <StatusLabel status={'external'} type={'external'} />
      </Td>
      <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
        <Text fontSize="14px">{score}</Text>
      </Td>
      <Td border="0.5px solid #D5D5D5" borderLeft="none" borderRight="none">
        <StimButton aria-label="add" leftIcon={<AddIcon fontSize="8px" />} size="stimSmall" variant="stimOutline">
          {t('Add To Favorites')}
        </StimButton>
      </Td>
    </Tr>
  );
};

export default SuggestedCompanies;
