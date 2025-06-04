import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

interface IProps {
  value: string;
  onRemove?: (value: string) => void;
}

function Tag(props: IProps) {
  const { value, onRemove } = props;
  return (
    <Flex
      mb="5px"
      key={`${value}_tag_id`}
      bg={'#F1F1F1'}
      borderRadius="7px"
      p="0px 4px 0px 8px"
      mr="5px"
      w="fit-content"
      align="center"
      id={`${value}_tag_id`}
    >
      <Text color={'gray.400'} display="inline-block" fontSize="12" lineHeight="21px" fontWeight="semibold">
        {value}
      </Text>
      {onRemove && (
        <Tooltip aria-label="Remove" title="Remove">
          <MdClose style={{ cursor: 'pointer' }} onClick={() => onRemove(value)} size={11} />
        </Tooltip>
      )}
    </Flex>
  );
}

export default Tag;
