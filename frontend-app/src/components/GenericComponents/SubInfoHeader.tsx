import { FC } from 'react';
import { Stack, Text, Button, Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  yearDataRecorded?: number;
  chart: boolean;
  setChart(data: boolean): void;
  metric?: string;
  period?: string;
  setMetric?(data: string): void;
  setPeriod?(data: string): void;
  edit?: boolean;
}

export const SubInfoHeader: FC<Props> = ({
  yearDataRecorded,
  chart,
  setChart,
  metric,
  period,
  setMetric,
  setPeriod,
  edit,
}) => {
  const { t } = useTranslation();

  return (
    <Stack placeSelf="end" direction="row" spacing={4}>
      <Text lineHeight="2rem" textStyle="tableSubInfoSecondary">
        {!chart ? (yearDataRecorded ?? '') : null}
      </Text>
      {chart && (
        <Stack isInline={true} spacing="5">
          <Select size="sm" width="auto" variant="flushed" value="total">
            <option value="">Total</option>
          </Select>
          <Select size="sm" width="auto" value="{selectedPeriod}" variant="flushed">
            <option value="Last6Months">Last 6 Months</option>
          </Select>
        </Stack>
      )}
      <Button
        disabled={true}
        {...(chart && { bg: 'gradient.iconbutton' })}
        onClick={() => setChart(!chart)}
        size="sm"
        colorScheme="gradient.iconbutton"
        variant="ghost"
        borderRadius="28px"
      >
        <Text textStyle="textLink">{t('Chart View')}</Text>
      </Button>
    </Stack>
  );
};
