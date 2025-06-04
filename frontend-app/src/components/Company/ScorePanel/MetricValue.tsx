import { Stack, Text } from '@chakra-ui/layout';
import { FC } from 'react';
import ScoreSvg from './ScoreSvg';
export const MetricValue: FC<{ value: number; label: string; dashboard?: boolean }> = ({ value, label, dashboard }) => {
  return (
    <Stack direction="row">
      <ScoreSvg dashboard={dashboard} showDetails={false} scoreValue={value} h="25" w="25" />
      <Stack spacing={0}>
        <Text
          textStyle="h3"
          as="h3"
          {...(dashboard && { lineHeight: '18px' })}
          {...(dashboard && { fontSize: '12px' })}
          {...(dashboard && { fontWeight: 'bold' })}
        >
          {value}
        </Text>
        <Text textStyle="pagination">{label}</Text>
      </Stack>
    </Stack>
  );
};
