import { Flex, Text } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Badge } from './badge.types';
import { CompanyAccordion, FakeRightBorder } from '../../Company/shared';
import BadgeItemRow from './BadgeItemRow';
import { tableTitleName, tableTitleDateStatus } from './styles';

const BadgeTable = (props: { badges: Badge[]; setBadge: (data: any) => void }) => {
  const { badges, setBadge } = props;
  const { t } = useTranslation();

  return (
    <>
      <Flex id="badge-table" data-testid="badge-table">
        <Box w="48px" position="relative">
          <FakeRightBorder />
        </Box>
        <Box flex={0.3}>
          <Text sx={tableTitleName}>{t('NAME')}</Text>
        </Box>
        <Box sx={tableTitleDateStatus}>
          <Text p="14px">{t('DATE')}</Text>
        </Box>
      </Flex>
      <CompanyAccordion borderColor="#D5D5D5">
        {badges?.map((badge: any, index: number) => (
          <BadgeItemRow key={`${badge.id}_${index}`} badge={badge} setBadge={setBadge} />
        ))}
      </CompanyAccordion>
    </>
  );
};

export default BadgeTable;
