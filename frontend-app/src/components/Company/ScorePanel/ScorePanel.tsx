import { Box, Stack, Text } from '@chakra-ui/layout';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';

const ScorePanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;

  const { t } = useTranslation();

  return (
    <Box position="relative" id="score">
      <Stack direction="column">
        <Text as="h1" textStyle="h1_profile">
          {t('Stimulus Score')}
        </Text>
        <CompanyProfileDivider />
        {edit ? <UpdateView /> : <DisplayView company={company} edit={edit} />}
      </Stack>
    </Box>
  );
});

export default ScorePanel;
