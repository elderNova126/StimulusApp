import { Stack, Text } from '@chakra-ui/layout';

const ItemPanel = (props: { name: string; value: string }) => {
  const { name, value } = props;
  return (
    <Stack spacing="13px">
      <Text as="h5" textStyle="h5">
        {name}
      </Text>
      <Text as="h2" textStyle="h2">
        {value}
      </Text>
    </Stack>
  );
};

export default ItemPanel;
