import { IconButton } from '@chakra-ui/button';
import { CloseIcon } from '@chakra-ui/icons';
import { Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { useTranslation } from 'react-i18next';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { utcStringToLocalDate } from '../../../utils/date';
import { ContentTrimmer } from '../../GenericComponents';
import { Certification } from '../company.types';
import { useMemo } from 'react';
import { getExpirationInfo } from '../../../utils/companies/expirationInfo';

const CertificationItem = (props: {
  certification: Certification;
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
  reset: () => void;
  close: (data: boolean) => void;
}) => {
  const { certification, index, total, next, prev, close, reset } = props;
  const { t } = useTranslation();

  const expirationDaysInfo = useMemo(() => {
    return certification.remainingDays ? getExpirationInfo(certification.remainingDays) : '';
  }, [certification.remainingDays]);

  return (
    <Stack spacing={3} w="96%" ml="2%">
      <Flex justifyContent="space-between">
        <Text>
          {certification.name}
          {!!expirationDaysInfo && (
            <sup
              style={{ color: 'red', fontSize: '9px', paddingLeft: '5px', position: 'relative', bottom: '-14px' }}
            >{`(${expirationDaysInfo})`}</sup>
          )}
        </Text>
        <Stack direction="row" spacing="14px" alignItems="center">
          <Text textStyle="pagination">{`${index + 1} of ${total}`}</Text>
          <IconButton
            size="xs"
            variant="simple"
            icon={<MdChevronLeft />}
            aria-label="prev"
            disabled={index === 0}
            onClick={prev}
          />
          <IconButton
            size="xs"
            variant="simple"
            icon={<MdChevronRight />}
            aria-label="next"
            disabled={index + 1 === total}
            onClick={next}
          />
          <IconButton
            size="xs"
            variant="simple"
            icon={<CloseIcon fontSize="8px" />}
            aria-label="close"
            onClick={() => {
              close(false);
              return reset();
            }}
          />
        </Stack>
      </Flex>
      <Divider borderColor="#D5D5D5" />
      <Flex>
        <Stack flex="1">
          <Text textStyle="tableSubInfo">{t('Type')}</Text>
          <Text textStyle="body">{certification.type}</Text>
        </Stack>
        {!!certification.certificationDate && (
          <Stack flex="1">
            <Text textStyle="tableSubInfo">{t('Start')}</Text>
            <Text textStyle="body">{utcStringToLocalDate(certification.certificationDate)}</Text>
          </Stack>
        )}
        {!!certification.expirationDate && (
          <Stack flex="1">
            <Text textStyle="tableSubInfo">{t('End')}</Text>
            <Text textStyle="body">{utcStringToLocalDate(certification.expirationDate)}</Text>
          </Stack>
        )}
        {!!certification.certificationNumber || !!certification.issuedBy ? (
          <Stack flex="1">
            <Text textStyle="tableSubInfo">{t('Details')}</Text>
            {!!certification.certificationNumber && (
              <Text textStyle="body">{`Number: ${certification.certificationNumber}`}</Text>
            )}
            {!!certification.issuedBy && <Text textStyle="body">{`Issued by: ${certification.issuedBy}`}</Text>}
          </Stack>
        ) : null}
        <Stack flex="1">
          <Text textStyle="tableSubInfo">{t('Description')}</Text>
          <ContentTrimmer body={certification.description} />
        </Stack>
      </Flex>
    </Stack>
  );
};

export default CertificationItem;
