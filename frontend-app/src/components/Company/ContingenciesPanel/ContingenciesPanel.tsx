import { Icon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdClose } from 'react-icons/io';
import { CustomTooltip } from '../../GenericComponents/CustomTooltip';
import { styleNumber, styleNumberOfResults } from '../commonStyles';
import { Company } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import ContingenciesFilters from './ContingenciesFilters';
import DisplayView from './DisplayView';
import UpdateView from './UpdateView';
import StimButton from '../../ReusableComponents/Button';

const ContingenciesPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const { t } = useTranslation();
  const contingencies = useMemo(() => company.contingencies?.results ?? [], [company]);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [count, setcount] = useState(0);

  useEffect(() => {
    if (company.contingencies?.results) {
      setcount(company.contingencies?.results.length);
    }
  }, [company]);

  const filteredContingencies = useMemo(
    () => contingencies.filter((contingency) => selectedTypes.includes(contingency.type)),
    [contingencies, selectedTypes]
  );
  const availableTypes = useMemo(
    () => Array.from(new Set((contingencies || []).map((contingency) => contingency.type))),
    [contingencies]
  );

  return (
    <Stack spacing={edit || isListView ? 0 : 5} id="contingencies">
      <Stack direction="column" spacing={4}>
        <Stack direction="row">
          <Flex>
            <Text as="h1" textStyle="h1_profile" marginRight="1.5">
              {t('Risk Management')}
            </Text>
            <CustomTooltip
              label={
                'Risk Management or contingency plans available for the company including Regulatory, Financial, Natural, Supply Chain plans.'
              }
            >
              <Box lineHeight="2rem">
                <InfoOutlineIcon color="gray" />
              </Box>
            </CustomTooltip>
            {count > 0 && (
              <Flex sx={styleNumberOfResults} marginTop="-2.5%">
                <Text sx={styleNumber}>{count}</Text>
              </Flex>
            )}
          </Flex>
          <Flex flexDirection="row" position="absolute" right="3rem">
            <ContingenciesFilters
              isOpen={isFiltersOpen}
              setIsOpen={setIsFiltersOpen}
              filterHook={[selectedTypes, setSelectedTypes]}
              availableTypes={availableTypes}
            />
            <StimButton
              onClick={() => setIsListView(true)}
              size="stimSmall"
              variant={isListView ? 'stimPrimary' : 'stimTextButton'}
            >
              {t('List View')}
              {isListView && (
                <Icon
                  data-testid="list-view-close-icon"
                  fontSize="12px"
                  margin="7px 0 7px 7px"
                  as={IoMdClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsListView(false);
                  }}
                />
              )}
            </StimButton>
          </Flex>
        </Stack>
        <CompanyProfileDivider />
      </Stack>
      {edit ? (
        <UpdateView
          ref={ref}
          companyId={company.id}
          contingencies={selectedTypes.length ? filteredContingencies : contingencies}
        />
      ) : (
        <DisplayView
          contingencies={selectedTypes.length ? filteredContingencies : contingencies}
          isListView={isListView}
        />
      )}
    </Stack>
  );
});

export default ContingenciesPanel;
