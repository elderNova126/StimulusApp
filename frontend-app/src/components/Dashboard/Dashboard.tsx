import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TenantCompanyContext } from '../../context/TenantCompany';
import { GrMore } from 'react-icons/gr';
import { ProjectStatus } from '../../graphql/enums';
import { useActivityLog, useCheckDashboarData, useGetProjects, useUser } from '../../hooks';
import { capitalizeFirstLetter } from '../../utils/dataMapper';
import { CompanyAvatar, SwitchButton } from '../GenericComponents';
import MyActivityLog from './ActivityLogs/MyActivityLog';
import TenantActivityLog from './ActivityLogs/TenantActivityLog';
import ChartDash from './ChartDash';
import NoResultsReports from './NoResults/NoResultsReports';
import RecentProjects from './RecentProjects';
import AiSuggestion, { ScatterPlot3D } from './AiSuggestions';
import SuggestedCompanies from './SuggestedCompanies';

const Dashboard: FC<RouteComponentProps> = () => {
  const { t } = useTranslation();
  const [reportsQty, setReportsQty] = useState(0);
  const [internalCompanies, setInternalCompanies] = useState(true);
  const [projects, setProjects] = useState(true);
  const [totalSpent, setTotalSpent] = useState(true);

  const { hasData, currentProject, currentSpent, currentSupplier, prevProject, prevSpent, prevSupplier } =
    useCheckDashboarData();

  useEffect(() => {
    const reports = [internalCompanies, projects, totalSpent];

    setReportsQty(reports.filter(Boolean).length);
  }, [internalCompanies, projects, totalSpent]);

  const {
    user: { sub: userId, given_name },
  } = useUser();

  const { logs: userLogs, loading: loadingMyActivity } = useActivityLog({ userId, page: 1, limit: 5 });
  const { logs: tenantLogs, loading: loadingTenantActivity } = useActivityLog({
    notUserId: userId,
    page: 1,
    limit: 50,
  });

  const {
    projects: recentProjects,
    count,
    loading: loadingProjects,
  } = useGetProjects(userId, 1, 5, ProjectStatus.INPROGRESS);

  const { tenantCompany } = useContext(TenantCompanyContext);
  const tenantId: string = tenantCompany?.id ?? '';
  return (
    <Center>
      <Stack p="30px 0 0 10px">
        <Stack isInline>
          <Text fontSize={'34px'} mb="5px">{`${t('Welcome')}, ${capitalizeFirstLetter(given_name)}`}</Text>
          <Menu closeOnSelect={false}>
            <MenuButton bg="transparent" w="30px" h="30px" borderRadius="50%" _active={{ bg: '#92D6C160' }}>
              <Icon as={GrMore} ml="auto" size="sm" color="gray.500" />
            </MenuButton>
            <MenuList overflow="scroll" maxHeight="50vh" border="1px solid #E4E4E4" borderRadius="4px">
              <MenuItem
                icon={
                  <SwitchButton
                    onClick={(e: any) => e.stopPropagation()}
                    onChange={() => {
                      setInternalCompanies(!internalCompanies);
                    }}
                    isChecked={internalCompanies}
                  />
                }
              >
                {t('SUPPLIERS')}
              </MenuItem>
              <MenuItem
                icon={
                  <SwitchButton
                    onClick={(e: any) => e.stopPropagation()}
                    onChange={() => {
                      setTotalSpent(!totalSpent);
                    }}
                    isChecked={totalSpent}
                  />
                }
              >
                {t('SPENDING')}
              </MenuItem>
              <MenuItem
                icon={
                  <SwitchButton
                    onClick={(e: any) => e.stopPropagation()}
                    onChange={() => {
                      setProjects(!projects);
                    }}
                    isChecked={projects}
                  />
                }
              >
                {t('PROJECTS')}
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
        <Stack isInline fontSize="12px" fontWeight="bold">
          {tenantId && <CompanyAvatar size="xs" companyId={tenantId} mt="-5px" />}
          <Text>{tenantCompany?.legalBusinessName}</Text>
        </Stack>
        <Stack>
          <HStack h="auto" mt="30px" spacing={8}>
            {tenantId ? (
              <ScatterPlot3D companyId={tenantId} />
            ) : (
              <Box h="500px" w="654px" border="1px solid #E4E4E4" rounded="4px">
                <Flex h="100%" alignItems="center" justifyContent="center">
                  <Spinner />
                </Flex>
              </Box>
            )}
            <AiSuggestion />
          </HStack>
        </Stack>
        <Stack>
          <HStack h="auto" mt="30px" spacing={8}>
            {hasData ? (
              <>
                {internalCompanies && (
                  <ChartDash
                    qty={reportsQty}
                    type={'Suppliers'}
                    current={currentSupplier}
                    prev={prevSupplier}
                    hasData={hasData}
                  />
                )}
                {totalSpent && (
                  <ChartDash
                    qty={reportsQty}
                    type={'Spent'}
                    current={currentSpent}
                    prev={prevSpent}
                    hasData={hasData}
                  />
                )}
                {projects && (
                  <ChartDash
                    qty={reportsQty}
                    type={'Projects'}
                    current={currentProject}
                    prev={prevProject}
                    hasData={hasData}
                  />
                )}
              </>
            ) : (
              <NoResultsReports />
            )}
          </HStack>
        </Stack>
        <HStack py="20px" spacing={8}>
          <MyActivityLog events={userLogs?.slice(0, 5)} loading={loadingMyActivity} />
          <TenantActivityLog events={tenantLogs?.slice(0, 10)} loading={loadingTenantActivity} />
        </HStack>
        <Stack my="20px" pb="20px">
          <SuggestedCompanies />
        </Stack>
        <Stack mt="20px" pb="25px">
          <RecentProjects projects={recentProjects} loading={loadingProjects} count={count} />
        </Stack>
      </Stack>
    </Center>
  );
};

export default Dashboard;
