import { Td } from '@chakra-ui/react';

export const TdBorder = (props: any) => {
  const { children, ...rest } = props;

  return (
    <Td
      transition="all .1s ease"
      _hover={{ transform: 'scale(0.99)', bg: '#F6F6F6' }}
      border="0.5px solid #D5D5D5"
      {...rest}
    >
      {children}
    </Td>
  );
};
