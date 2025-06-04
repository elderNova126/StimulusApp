import { Box, CircularProgress, Flex, Stack, Text } from '@chakra-ui/react';

const ItemPanel = (props: { icon: any; value: string | number; label: string; color?: string; circle?: boolean }) => {
  const { icon, value, label, color, circle } = props;
  return (
    <>
      <Flex direction="row" color={color}>
        {icon && (
          <Box w="25px" pl="5px" pt="7px">
            {icon}
          </Box>
        )}
        {circle && (
          <Box w="25px">
            <CircularProgress value={parseInt(value as string, 10)} color="gray" size="20px" />
          </Box>
        )}
        <Stack spacing={1}>
          <Text as="h2" textStyle="h2" color="inherit">
            {value}
          </Text>
          <Text textStyle="pagination" color="inherit">
            {label}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};

export default ItemPanel;
