import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '../../../GenericComponents/CustomTooltip';

interface CompanyIndustriesProps {
  id: string;
  title: string;
  code: string;
}

export const CompanyIndustries = ({ industries }: { industries: CompanyIndustriesProps[] }) => {
  const { t } = useTranslation();

  return (
    <Stack margin="0 1rem 1rem 1rem" spacing={1} alignItems="flex-start">
      <Text as="h5" textStyle="h5" mb="10px">
        {t('Industry')}
      </Text>
      <Stack w="220px !important" maxH="182px" overflowY="scroll" className="fade">
        {industries?.map?.((industry: any, i: number) => (
          <Flex my={'5px'} key={`${industry.id}_${industry.title}_${i}`} justify="space-between" w="180px">
            <Box mb="4px !important">
              <CustomTooltip arrow={false} label={`${industry.title}`}>
                <Text id={industry.id} fontSize="14px" maxW="127px !important" noOfLines={3} mb="4px">
                  {`${industry.title}`}
                </Text>
              </CustomTooltip>
            </Box>
            <Text fontSize="11px" color="#666666" fontWeight="300">
              {`${industry.code ? industry.code : ''}`}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};
