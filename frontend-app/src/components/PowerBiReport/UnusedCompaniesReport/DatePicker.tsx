import { Flex, Input } from '@chakra-ui/react';

const DatePicker = (props: { setDate: (date: Date) => void; date: Date; placement?: string }) => {
  const { setDate, date } = props;

  return (
    <Flex>
      <Input
        disabled
        textAlign="center"
        _disabled={{ textColor: 'black' }}
        required
        placeholder="Select Date and Time"
        _focus={{ border: '1px solid black' }}
        borderColor="#D0D0D0"
        border="solid 1px"
        w="110px"
        size="xs"
        type="date"
        value={date.toISOString().substring(0, 10)}
        onChange={(e) => !!e.target.value && setDate(new Date(e.target.value))}
      />
    </Flex>
  );
};

export default DatePicker;
