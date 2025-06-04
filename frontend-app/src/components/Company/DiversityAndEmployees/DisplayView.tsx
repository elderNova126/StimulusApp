import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaArrowUp, FaUser } from 'react-icons/fa';
import { getColorByPercentage, localeUSDFormat } from '../../../utils/number';
import { Company } from '../company.types';
import ItemPanel from './ItemPanel';

const DisplayView = (props: { company: Company; employees: boolean; leadership: boolean; board: boolean }) => {
  const { company, employees, leadership, board } = props;
  const { t } = useTranslation();

  return (
    <>
      <Flex flex="1">
        <Stack w="70%">
          {employees && (
            <Text as="h5" textStyle="h5" fontWeight="bold" p="5px">
              {t('Employees')}
            </Text>
          )}
          <Flex>
            <Stack flex="1" spacing={4}>
              {company.employeesTotal && (
                <ItemPanel
                  icon={<FaUser fontSize="12px" />}
                  label={t('Employees')}
                  value={company.employeesTotal}
                  color="primary"
                />
              )}
              {company.employeesTotalGrowthCAGR && (
                <ItemPanel
                  icon={<FaArrowUp fontSize="12px" />}
                  label={t('CAGR')}
                  value={company.employeesTotalGrowthCAGR && `${company.employeesTotalGrowthCAGR} %`}
                  color={getColorByPercentage(company.employeesTotalGrowthCAGR)}
                />
              )}
            </Stack>
            <Stack flex="1" spacing={4}>
              {company.employeesDiverse && (
                <ItemPanel
                  icon={null}
                  label={t('Diverse')}
                  circle={true}
                  value={company.employeesDiverse && `${company.employeesDiverse} %`}
                />
              )}
              {company.revenuePerEmployee && (
                <ItemPanel
                  icon={<FaUser fontSize="12px" />}
                  label={t('Revenue/Employee')}
                  value={company.revenuePerEmployee && `${localeUSDFormat(company.revenuePerEmployee)} USD`}
                />
              )}
            </Stack>
          </Flex>
        </Stack>
      </Flex>
      <Flex flex="2">
        <Stack w="100%">
          <Flex w="66%">
            {leadership && (
              <Text flex="1" as="h5" textStyle="h5" p="5px">
                {t('Leadership')}
              </Text>
            )}
            {board && (
              <Text flex="1" as="h5" textStyle="h5" p="5px">
                {t('Board')}
              </Text>
            )}
          </Flex>
          <Flex>
            <Stack flex="1" spacing={4}>
              {company.leadershipTeamTotal && (
                <ItemPanel
                  icon={<FaUser fontSize="12px" />}
                  label={t('Leaders')}
                  value={company.leadershipTeamTotal}
                  color="primary"
                />
              )}
              {company.leadershipTeamDiverse && (
                <ItemPanel
                  icon={null}
                  label={t('Diverse')}
                  circle={true}
                  value={company.leadershipTeamDiverse && `${company.leadershipTeamDiverse} %`}
                />
              )}
              {company.diverseOwnership &&
                company.diverseOwnership.map((diverse: any) => {
                  return (
                    <Flex key={diverse}>
                      <Box bg={'#F1F1F1'} borderRadius="4px" p="0 8px">
                        <Text color={'#717171'} fontSize="15">
                          {diverse}
                        </Text>
                      </Box>
                    </Flex>
                  );
                })}
            </Stack>
            <Stack flex="2" spacing={20} direction="row">
              {company.boardTotal && (
                <ItemPanel
                  icon={<FaUser fontSize="12px" />}
                  label={t('Members')}
                  value={company.boardTotal}
                  color="primary"
                />
              )}
              {company.boardDiverse && (
                <ItemPanel
                  icon={null}
                  label={t('Diverse')}
                  circle={true}
                  value={company.boardDiverse && `${company.boardDiverse} %`}
                />
              )}
            </Stack>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};

export default DisplayView;
