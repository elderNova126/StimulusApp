import { Flex } from '@chakra-ui/layout';
import { FC, useState } from 'react';
import { CustomDatePicker } from '../../GenericComponents';

const DateField: FC<{ date: Date; setDate: (date: Date) => void }> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { date, setDate } = props;

  return (
    <Flex
      zIndex="modal"
      _focus={{ border: '1px solid blue', borderRadius: '4px' }}
      position="relative"
      onClick={() => (open ? null : setOpen(true))}
      flexDirection="row"
    >
      <CustomDatePicker
        open={open}
        setDate={(date) => {
          setDate(date);
          setOpen(false);
        }}
        date={date}
        placeholder="MM/DD/YYY"
      />
    </Flex>
  );
};

export default DateField;
