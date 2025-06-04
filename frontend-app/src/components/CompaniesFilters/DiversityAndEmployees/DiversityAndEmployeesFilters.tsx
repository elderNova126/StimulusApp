import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  BoardFilters,
  DiversityFilters,
  MinorityFilters,
  EmployeesFilters,
  LeadershipFilters,
  EmployeeGrowthFilters,
} from './index';

const DiversityAndEmployeesFilters = () => {
  const { t } = useTranslation();

  return (
    <Box p="1.5rem" maxWidth="50vw">
      <Text pl="2" as="h2" textStyle="h2">
        {t('Ownership & Employees')}
      </Text>
      <Divider m="12px 0" />
      <Flex>
        <Box flex="4" pl="2">
          <DiversityFilters />
          <MinorityFilters />
        </Box>
        <Box flex="4" pl="10">
          <EmployeesFilters />
          <Stack spacing={3} direction="row">
            <Box flex="1">
              <BoardFilters />
            </Box>
            <Box flex="1">
              <LeadershipFilters />
            </Box>
          </Stack>
          <Box width="50%">
            <EmployeeGrowthFilters />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default DiversityAndEmployeesFilters;
