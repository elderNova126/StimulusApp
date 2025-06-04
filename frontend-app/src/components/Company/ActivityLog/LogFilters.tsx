import { Flex, Stack, Text } from '@chakra-ui/layout';
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from '@chakra-ui/popover';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventFilter } from './ActivityLog';
import { getLastWeekDate } from '../../../utils/date';
import DateField from './DateField';
import StimButton from '../../ReusableComponents/Button';

const LogFilters: FC<{ applyFilters: (data: EventFilter) => void; count: number }> = (props) => {
  const { applyFilters, count } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const [startDate, setStartDate] = useState(() => {
    const date = getLastWeekDate();
    return new Date(formatDate(date));
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return new Date(formatDate(date));
  });

  const resetFilters = () => {
    setProjectFilter(null);
    setCompanyId(null);
    applyFilters({
      timestampFrom: startDate,
      timestampTo: endDate,
    });
  };

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <StimButton
          data-testid="filters-trigger-button"
          data-variant={isOpen ? 'stimPrimary' : 'stimTextButton'}
          onClick={() => setIsOpen(true)}
          variant={isOpen ? 'stimPrimary' : 'stimTextButton'}
          maxH="34px"
        >
          {t('Filters')}
        </StimButton>
      </PopoverTrigger>
      <PopoverContent
        data-testid="popover-content"
        bg="#FCFCFC"
        mr="5"
        width="auto"
        borderRadius="0"
        border="1px solid #E4E4E4"
        borderColor="#E4E4E4"
        boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
      >
        <PopoverBody bg="#F8F8F8" p="1.5rem" w="320px">
          <Stack alignItems="flex-start">
            <Stack spacing={1}>
              <Text as="h4" textStyle="h4">
                {t('Date')}
              </Text>
              <Stack direction="row" spacing={2}>
                <Stack spacing={0}>
                  <Text textStyle="body">{t('Start')}</Text>
                  <DateField setDate={setStartDate} date={startDate} />
                </Stack>
                <Stack spacing={0}>
                  <Text textStyle="body">{t('End')}</Text>
                  <DateField setDate={setEndDate} date={endDate} />
                </Stack>
              </Stack>
            </Stack>
            <StimButton
              data-testid="reset-filters-button"
              data-variant="stimTextButton"
              p="0"
              onClick={resetFilters}
              variant="stimTextButton"
            >
              {t('Reset Filters')}
            </StimButton>
          </Stack>
        </PopoverBody>
        <PopoverFooter h="47px" boxShadow="stimMedium">
          <Flex flex="1" direction="row-reverse" alignItems="flex-start">
            <StimButton
              data-testid="apply-filters-button"
              data-variant="stimOutline"
              data-size="stimSmall"
              onClick={() => {
                applyFilters({
                  timestampFrom: startDate,
                  timestampTo: endDate,
                  ...(!!companyId && { companyId }),
                  ...(!!projectFilter && { projectId: projectFilter as any }),
                });
                setIsOpen(false);
              }}
              variant="stimOutline"
              size="stimSmall"
            >
              {`${t('Apply filters')} (${[startDate, endDate, companyId, projectFilter].filter((i) => i).length})`}
            </StimButton>
            {count && (
              <Text fontWeight="600" marginRight="18px" marginTop="6px" fontSize="12px">
                {count + ' Results'}
              </Text>
            )}
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default LogFilters;
