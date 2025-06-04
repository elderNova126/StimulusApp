import { IconButton } from '@chakra-ui/button';
import { Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { Insurance } from '../company.types';
import { getExpirationInfo } from '../../../utils/companies/expirationInfo';
import { utcStringToLocalDate } from '../../../utils/date';

interface InsuranceItemProps {
  insurance: Insurance;
  showInsuranceGrid: () => void;
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
}

const InsuranceItem: FC<InsuranceItemProps> = ({ insurance, index, total, next, prev, showInsuranceGrid }) => {
  const { t } = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  const expirationDaysInfo = useMemo(() => {
    return insurance.remainingDays ? getExpirationInfo(insurance.remainingDays) : '';
  }, [insurance.remainingDays]);

  return (
    <Stack spacing={1} w="96%" ml="2%">
      <Flex justifyContent="space-between">
        <Text marginTop="1rem" textStyle="h4" as="h4">
          {insurance.name}
          {!!expirationDaysInfo && (
            <sup
              style={{ color: 'red', fontSize: '9px', paddingLeft: '5px', position: 'relative', bottom: '-14px' }}
            >{`(${expirationDaysInfo})`}</sup>
          )}
        </Text>
        <Stack direction="row" spacing="14px" alignItems="center">
          <Text textStyle="pagination">{`${index + 1} of ${total}`}</Text>
          <Flex justifyContent="flex-start">
            <IconButton
              minWidth="0px"
              size="md"
              variant="simple"
              icon={<MdChevronLeft />}
              aria-label="prev"
              disabled={index === 0}
              onClick={prev}
            />
            <IconButton
              minWidth="0px"
              size="md"
              variant="simple"
              icon={<MdChevronRight />}
              aria-label="next"
              disabled={index + 1 === total}
              onClick={next}
            />
          </Flex>
          <IconButton size="md" variant="simple" icon={<IoMdClose />} aria-label="prev" onClick={showInsuranceGrid} />
        </Stack>
      </Flex>
      <Divider borderColor="#D5D5D5" />
      <Flex marginTop="1rem" flexDirection="row" width="100%">
        <Flex flex={1} flexDirection="column">
          <Text marginTop=".5rem" textStyle="tableSubInfo">
            {t('Type')}
          </Text>
          <Text marginTop="1rem" textStyle="body">
            {insurance.type}
          </Text>
        </Flex>
        <Flex flex={1} flexDirection="column">
          <Text marginTop=".5rem" textStyle="tableSubInfo">
            {t('Start')}
          </Text>
          <Text marginTop="1rem" textStyle="body">
            {insurance.coverageEnd ? utcStringToLocalDate(insurance.coverageStart) : 'N/A'}
          </Text>
        </Flex>
        <Flex flex={1} flexDirection="column">
          <Text marginTop=".5rem" textStyle="tableSubInfo">
            {t('End')}
          </Text>
          <Text marginTop="1rem" textStyle="body">
            {insurance.coverageEnd ? utcStringToLocalDate(insurance.coverageEnd) : 'N/A'}
          </Text>
        </Flex>
        <Flex flex={1} flexDirection="column">
          <Text marginTop=".5rem" textStyle="tableSubInfo">
            {t('Details')}
          </Text>
          {!!insurance.policyNumber && (
            <Text marginTop="1rem" textStyle="body">{`Policy number: ${insurance.policyNumber}`}</Text>
          )}
          <Text marginTop=".3rem" textStyle="body">
            {insurance.insurer}
          </Text>
        </Flex>
        <Flex flex={1.5} flexDirection="column">
          <Text marginTop=".5rem" textStyle="tableSubInfo">
            {t('Description')}
          </Text>
          <Text overflow="hidden" height={showFullDescription ? 'auto' : '60px'} marginTop="1rem" textStyle="body">
            {insurance.description}
          </Text>
          <Text
            onClick={() => setShowFullDescription((showFullDescription) => !showFullDescription)}
            textStyle="miniTextLink"
            cursor="pointer"
            margin=".5rem 0 1rem 0"
            color="#000"
          >
            {insurance?.description?.length > 100 ? (showFullDescription ? t('Show Less') : t('Show More')) : ''}
          </Text>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default InsuranceItem;
