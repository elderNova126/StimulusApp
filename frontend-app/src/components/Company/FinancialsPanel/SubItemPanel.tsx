import { Box, Flex, Stack, Text } from '@chakra-ui/layout';

const SubItemPanel = (props: { icon: any; value: string | number; label: string; color: string }) => {
  const { icon, value, label, color } = props;
  return (
    <Flex color={color}>
      <Box>{value !== '-' ? icon : null}</Box>
      <Stack direction="row" spacing={1}>
        <Text textStyle="pagination" color={color}>
          {value}
        </Text>
        <Text textStyle="pagination" color={color}>
          {label}
        </Text>
      </Stack>
    </Flex>
  );
};

export default SubItemPanel;
