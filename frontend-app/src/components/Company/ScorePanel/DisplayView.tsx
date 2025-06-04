import { Box, Flex, Stack } from '@chakra-ui/layout';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Company } from '../company.types';
import { MetricValue } from './MetricValue';
import ScoreSvg from './ScoreSvg';
const DisplayView = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company } = props;

  const { t } = useTranslation();
  const score = company.stimulusScore?.results?.[0] ?? {
    id: 1,
    scoreValue: 1245,
    brandValue: 452,
    customerValue: 123,
    employeeValue: 1234,
    longevityValue: 1235,
    quality: 1800,
    reliability: 1234,
    features: 765,
    cost: 845,
    relationship: 246,
    financial: 1600,
    diversity: 1349,
    innovation: 1760,
    flexibility: 1534,
    brand: 1010,
  };

  return (
    <Flex pt="40px" data-testid="score-panel" id="score-panel-display">
      <Box flex="1">
        <ScoreSvg showDetails={true} scoreValue={score.scoreValue} w="215" h="227" />
      </Box>
      <Box flex="1">
        <Flex>
          <Stack spacing={6} flex="1">
            <MetricValue label={t('Cost')} value={score.cost} />
            <MetricValue label={t('Brand')} value={score.brand} />
            <MetricValue label={t('Financials')} value={score.financial} />
            <MetricValue label={t('Quality')} value={score.quality} />
            <MetricValue label={t('Features')} value={score.features} />
          </Stack>
          <Stack spacing={6} flex="1">
            <MetricValue label={t('Diversity')} value={score.diversity} />
            <MetricValue label={t('Relationship')} value={score.relationship} />
            <MetricValue label={t('Flexibility')} value={score.flexibility} />
            <MetricValue label={t('Innovation')} value={score.innovation} />
            <MetricValue label={t('Reliability')} value={score.reliability} />
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
});

export default DisplayView;
