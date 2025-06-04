import { Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GenericChart from '../../GenericChart';
import { SubInfoHeader } from '../../GenericComponents/SubInfoHeader';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';
const FinancialsPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { t } = useTranslation();
  const { company, edit } = props;
  const [chart, setChart] = useState<boolean>(false);

  return (
    <Stack spacing={edit ? 0 : 5} id="financials">
      <Stack isInline={true} justifyContent="space-between" spacing={4}>
        <Text as="h1" textStyle="h1_profile">
          {t('Financials')}
        </Text>
        <SubInfoHeader yearDataRecorded={company?.peopleDataYear} chart={chart} setChart={setChart} edit={edit} />
      </Stack>
      <CompanyProfileDivider />
      {edit ? (
        <UpdateView />
      ) : chart ? (
        <GenericChart profile={true} query={null} companyId={null} />
      ) : (
        <DisplayView company={company} />
      )}
    </Stack>
  );
});

export default FinancialsPanel;
