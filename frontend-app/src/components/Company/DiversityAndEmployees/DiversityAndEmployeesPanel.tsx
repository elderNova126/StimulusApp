import { Flex, Stack, Text } from '@chakra-ui/react';
import { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GenericChart from '../../GenericChart';
import { SubInfoHeader } from '../../GenericComponents/SubInfoHeader';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';

const DiversityAndEmployeesPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const { t } = useTranslation();
  const [chart, setChart] = useState<boolean>(false);
  const [employees, setEmployees] = useState(false);
  const [leadership, setLeadership] = useState(false);
  const [board, setBoard] = useState(false);
  const [header, setHeader] = useState(false);

  useEffect(() => {
    if (
      company.employeesDiverse ||
      company.employeesTotal ||
      company.employeesTotalGrowthCAGR ||
      company.revenuePerEmployee
    ) {
      setEmployees(true);
    }
    if (company.leadershipTeamDiverse || company.leadershipTeamTotal || company.diverseOwnership.length) {
      setLeadership(true);
    }
    if (company.boardDiverse || company.boardTotal) {
      setBoard(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (board || employees || leadership) {
      setHeader(true);
    }
  }, [employees, board, leadership]);

  return (
    <Stack spacing={edit ? 0 : 5}>
      {header || edit ? (
        <>
          <Stack isInline={true} justifyContent="space-between" spacing={4} id="diversityEmployees">
            <Text as="h1" textStyle="h1_profile">
              {t('Ownership & Employees')}
            </Text>
            <SubInfoHeader yearDataRecorded={company?.peopleDataYear} chart={chart} setChart={setChart} edit={edit} />
          </Stack>
          <CompanyProfileDivider />
        </>
      ) : null}
      {edit ? (
        <UpdateView />
      ) : chart ? (
        <GenericChart profile={true} />
      ) : (
        <Flex justifyContent="space-between">
          <DisplayView company={company} employees={employees} board={board} leadership={leadership} />
        </Flex>
      )}
    </Stack>
  );
});

export default DiversityAndEmployeesPanel;
