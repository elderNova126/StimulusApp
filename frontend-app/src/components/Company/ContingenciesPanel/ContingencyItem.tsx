import { IconButton } from '@chakra-ui/button';
import { Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { utcStringToLocalDate } from '../../../utils/date';
import { ContentTrimmer } from '../../GenericComponents';
import { Contingency } from '../company.types';

const ContingencyItem = (props: {
  contingency: Contingency;
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
  showContingencyGrid: () => void;
}) => {
  const { contingency, index, total, next, prev, showContingencyGrid } = props;
  const { t } = useTranslation();

  return (
    <Stack spacing={3} w="96%" ml="2%">
      <Flex justifyContent="space-between">
        <Text>{contingency.name}</Text>
        <Stack direction="row" spacing="14px" alignItems="center">
          <Text textStyle="pagination">{`${index + 1} of ${total}`}</Text>
          <Flex justifyContent="flex-start">
            <IconButton
              minWidth="0px"
              size="xs"
              variant="simple"
              icon={<MdChevronLeft />}
              aria-label="prev"
              disabled={index === 0}
              onClick={prev}
            />
            <IconButton
              minWidth="0px"
              size="xs"
              variant="simple"
              icon={<MdChevronRight />}
              aria-label="next"
              disabled={index + 1 === total}
              onClick={next}
            />
          </Flex>
          <IconButton size="md" variant="simple" icon={<IoMdClose />} aria-label="prev" onClick={showContingencyGrid} />
        </Stack>
      </Flex>
      <Divider borderColor="#D5D5D5" />
      <Flex>
        <Stack flex="1">
          <Text textStyle="tableSubInfo">{t('Type')}</Text>
          <Text textStyle="body">{contingency.type}</Text>
        </Stack>
        <Stack flex="1">
          <Text textStyle="tableSubInfo">{t('Details')}</Text>

          <Text textStyle="body">{`Created: ${utcStringToLocalDate(contingency.created) ?? ''}`}</Text>
          <Text textStyle="body">{`Updated: ${utcStringToLocalDate(contingency.updated) ?? ''}`}</Text>
        </Stack>
        <Stack flex="1">
          <Text textStyle="tableSubInfo">{t('Description')}</Text>
          <ContentTrimmer body={contingency.description} />
        </Stack>
      </Flex>
    </Stack>
  );
};

export default ContingencyItem;
