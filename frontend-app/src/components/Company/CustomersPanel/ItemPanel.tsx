import { Stack, Text, Box } from '@chakra-ui/layout';
import { CircularProgress } from '@chakra-ui/react';

const ItemPanel = (props: {
  value: string | number;
  label: string;
  color?: string;
  secondValue?: string;
  secondColor?: string;
  progress?: boolean;
}) => {
  const { value, label, color, secondValue, secondColor, progress } = props;
  return (
    <Stack spacing={4} flex="1">
      <Text as="h6" textStyle="h6">
        {label}
      </Text>
      <Stack spacing={1}>
        <Box display="flex">
          {progress && <CircularProgress color="green" m="3px 3px 0 0" size={'20px'} value={value as number} />}
          <Text as="h2" textStyle="h2" color={color ?? 'inherit'}>
            {value} {progress ? '%' : undefined}
          </Text>
        </Box>
        {secondValue && (
          <Text textStyle="pagination" color={secondColor ?? 'inherit'}>
            {secondValue}
          </Text>
        )}
      </Stack>
    </Stack>
  );
};

export default ItemPanel;
