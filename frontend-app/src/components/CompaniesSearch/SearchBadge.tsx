import { CloseButton, Flex, Text, Tooltip } from '@chakra-ui/react';
import { FC, useMemo } from 'react';
import { useSearchFilters } from '../../hooks/utils';
import { capitalizeFirstLetter } from '../../utils/dataMapper';

const SearchBadge: FC<{ query: string; filterSearch: string; onClose: () => void }> = (props) => {
  const { query, onClose } = props;
  let { filterSearch } = props;

  const filters: any = useSearchFilters();

  filterSearch = useMemo(() => {
    return filters?.[filterSearch] || filterSearch;
  }, [filterSearch, filters]);

  return (
    <Flex alignItems="center" marginX="0rem" bg="white" maxH="30px">
      <Text
        whiteSpace="nowrap"
        sx={{
          '@media only screen and (max-width: 1336px)': {
            fontSize: '15px',
          },
        }}
        color="#288d5c"
        fontWeight="semibold"
        padding="5px"
      >
        {capitalizeFirstLetter(filterSearch)}:{' '}
      </Text>
      <Text color="#288d5c" fontWeight="normal" padding="5px" whiteSpace="nowrap">
        {query}
      </Text>
      <Tooltip label={`Click to remove ${query} option`}>
        <CloseButton fontSize="8px" onClick={onClose} />
      </Tooltip>
    </Flex>
  );
};

export default SearchBadge;
