import { Flex, Text } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Certification } from '../company.types';
import { CompanyAccordion, FakeRightBorder } from '../shared';
import CertificationItemRow from './CertificationItemRow';

const CertificationListView = (props: { certifications: Certification[] }) => {
  const { certifications } = props;
  const { t } = useTranslation();

  return (
    <>
      <Flex>
        <Box w="48px" position="relative">
          <FakeRightBorder />
        </Box>
        <Box flex={1}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('NAME')}
          </Text>
        </Box>
        <Box flex={1}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('TYPE')}
          </Text>
        </Box>
        <Box flex={0.4}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('START')}
          </Text>
        </Box>
        <Box flex={1}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('END')}
          </Text>
        </Box>
        <Box flex={1}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('CERTIFICATION ID')}
          </Text>
        </Box>
        <Box flex={1}>
          <Text as="h5" textStyle="h5" p="14px">
            {t('EXPIRES IN')}
          </Text>
        </Box>
      </Flex>
      <CompanyAccordion borderColor="#D5D5D5">
        {certifications.map((certification) => (
          <CertificationItemRow key={certification.id} certification={certification} />
        ))}
      </CompanyAccordion>
    </>
  );
};

export default CertificationListView;
