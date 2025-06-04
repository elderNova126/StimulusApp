import {
  Box,
  Divider,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsThreeDots } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { setFavoriteFilters, Filter, GeneralState } from '../../stores/features/generalData';
import { Checkbox, SwitchButton } from '../GenericComponents';
import { IndustryFilter, RelationshipFilter, StatusFilter, StimulusScoreFilter, LegalEntityType } from './Basic';
import LocationFilter from './BasicFilters/LocationFilters';
import {
  BoardFilters,
  EmployeeGrowthFilters,
  EmployeesFilters,
  LeadershipFilters,
  DiversityFilters,
} from './DiversityAndEmployees';
import { AssetsFilters, LiabilitiesFilters, NetProfitFilters, RevenueFilters } from './Financials';
import { useUser } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

const FILTERS_MAPPER = {
  // basic
  SCORE: 'SCORE',
  INDUSTRY: 'INDUSTRY',
  LOCATION: 'LOCATION',
  RELATIONSHIP: 'RELATIONSHIP',
  STATUS: 'STATUS',
  LEGALENTITY: 'LEGALENTITY',
  // customer and brand
  CUSTOMER: 'CUSTOMER',
  BRAND: 'BRAND',
  // diversity and employee
  DIVERSITYFILTERS: 'DIVERSITYFILTERS',
  BOARD: 'BOARD',
  LEADERSHIP: 'LEADERSHIP',
  EMPLOYEE_GROWTH: 'EMPLOYEE_GROWTH',
  EMPLOYEE: 'EMPLOYEE',
  // financials
  REVENUE: 'REVENUE',
  NET_PROFIT: 'NET_PROFIT',
  ASSETS: 'ASSETS',
  LIABILITIES: 'LIABILITIES',
};
const FilterComponentsMapper: { [key: string]: FC } = {
  [FILTERS_MAPPER.SCORE]: StimulusScoreFilter,
  [FILTERS_MAPPER.INDUSTRY]: IndustryFilter,
  [FILTERS_MAPPER.LOCATION]: LocationFilter,
  [FILTERS_MAPPER.RELATIONSHIP]: RelationshipFilter,
  [FILTERS_MAPPER.STATUS]: StatusFilter,
  [FILTERS_MAPPER.LEGALENTITY]: LegalEntityType,
  // [FILTERS_MAPPER.CUSTOMER]: CustomersFilter,
  // [FILTERS_MAPPER.BRAND]: BrandFilters,
  [FILTERS_MAPPER.DIVERSITYFILTERS]: DiversityFilters,
  [FILTERS_MAPPER.BOARD]: BoardFilters,
  [FILTERS_MAPPER.LEADERSHIP]: LeadershipFilters,
  [FILTERS_MAPPER.EMPLOYEE_GROWTH]: EmployeeGrowthFilters,
  [FILTERS_MAPPER.EMPLOYEE]: EmployeesFilters,
  [FILTERS_MAPPER.REVENUE]: RevenueFilters,
  [FILTERS_MAPPER.NET_PROFIT]: NetProfitFilters,
  [FILTERS_MAPPER.ASSETS]: AssetsFilters,
  [FILTERS_MAPPER.LIABILITIES]: LiabilitiesFilters,
};

const FavoritesFilters = () => {
  const { t } = useTranslation();
  const FiltersTitleMapper: { [key: string]: string } = {
    [FILTERS_MAPPER.SCORE]: t('Stimulus Score'),
    [FILTERS_MAPPER.INDUSTRY]: t('Industry'),
    [FILTERS_MAPPER.LOCATION]: t('Location'),
    [FILTERS_MAPPER.RELATIONSHIP]: t('Relationship'),
    [FILTERS_MAPPER.STATUS]: t('Status'),
    [FILTERS_MAPPER.LEGALENTITY]: t('Legal Entity Type'),
    // [FILTERS_MAPPER.CUSTOMER]: t('Customers'),
    // [FILTERS_MAPPER.BRAND]: t('Brand'),
    [FILTERS_MAPPER.DIVERSITYFILTERS]: t('Diversity'),
    [FILTERS_MAPPER.BOARD]: t('Board'),
    [FILTERS_MAPPER.LEADERSHIP]: t('Leadership'),
    [FILTERS_MAPPER.EMPLOYEE_GROWTH]: t('Employee Growth'),
    [FILTERS_MAPPER.EMPLOYEE]: t('Employee'),
    [FILTERS_MAPPER.REVENUE]: t('Revenue'),
    [FILTERS_MAPPER.NET_PROFIT]: t('Net Profit'),
    [FILTERS_MAPPER.ASSETS]: t('Assets'),
    [FILTERS_MAPPER.LIABILITIES]: t('Liabilities'),
  };

  const favoriteFilters: any = useSelector((state: { generalData: GeneralState }) => state.generalData.favoriteFilters);
  const tenantName: any = useSelector((state: { generalData: GeneralState }) => state.generalData.TenantName);

  const [config, setConfig] = useState<Filter[]>(favoriteFilters);
  const [showConfig, setShowConfig] = useState(config.length === 0);
  const dispatch = useDispatch();
  const {
    user: { sub },
  } = useUser();
  const MIN_NUMBER_FROM_STORAGE = 2;

  useEffect(() => {
    const favoriteFilterFromStore = localStorage.getItem(`favoriteF-${sub}-${tenantName}`);
    if (favoriteFilterFromStore) {
      setConfig(JSON.parse(favoriteFilterFromStore));
      setShowConfig(favoriteFilterFromStore.length <= MIN_NUMBER_FROM_STORAGE);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(setFavoriteFilters(config));
    localStorage.setItem(`favoriteF-${sub}-${tenantName}`, JSON.stringify(config));
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box p="2.5rem" {...(showConfig && { bg: 'menu.company_category' })} h="100%" overflow="scroll">
      {showConfig ? (
        <FiltersGuide
          mapper={FiltersTitleMapper}
          config={config}
          setConfig={setConfig}
          onSubmit={() => setShowConfig(false)}
        />
      ) : (
        <>
          <Flex justifyContent="space-between">
            <Text as="h2" textStyle="h2">
              {t('Favorites')}
            </Text>
            <Box>
              <FiltersMenu
                mapper={FiltersTitleMapper}
                config={config}
                setConfig={setConfig}
                showConfig={setShowConfig}
              />
            </Box>
          </Flex>
          <Divider m="12px 0" />
          <Stack spacing={7}>
            {config.map((filterKey: Filter) => {
              const Component = FilterComponentsMapper[filterKey];

              return <Box key={filterKey}>{Component && <Component />}</Box>;
            })}
          </Stack>
        </>
      )}
    </Box>
  );
};

const FiltersMenu: FC<{
  mapper: any;
  config: Filter[];
  setConfig: (val: Filter[]) => void;
  showConfig: (val: boolean) => void;
}> = (props) => {
  const { mapper, config, setConfig, showConfig } = props;

  useEffect(() => {
    if (!!config.length === false) {
      showConfig(true);
    }
  }, [config]);

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={IconButton} aria-label="Companies Options" icon={<BsThreeDots />} variant="simple" />
      <MenuList overflow="scroll" maxHeight="50vh">
        {(Object.keys(mapper) as Filter[]).map((filter) => {
          const checked = config.indexOf(filter) > -1;

          return (
            <MenuItem
              key={filter}
              onClick={(e: any) => {
                setConfig(checked ? config.filter((v) => v !== filter) : [...config, filter]);
              }}
              icon={
                <SwitchButton onClick={(e: any) => e.stopPropagation()} onChange={(e: any) => {}} isChecked={checked} />
              }
            >
              {mapper[filter]}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

const FiltersGuide: FC<{ mapper: any; config: Filter[]; setConfig: (val: Filter[]) => void; onSubmit: () => void }> = (
  props
) => {
  const [showConfig, setShowConfig] = useState(false);
  const { mapper, config, setConfig, onSubmit } = props;
  const { t } = useTranslation();

  return (
    <Flex h="490px">
      <Stack spacing={4} w="255px" pt="2.5rem" pl="1.7rem">
        <Text as="h2" textStyle="h2">
          {t('Favorites')}
        </Text>
        {showConfig ? (
          <>
            <Text textStyle="body">{t('Start by selecting your most used filters from our list')}</Text>
            <Stack spacing={4} overflow="scroll" maxH="180px">
              {(Object.keys(mapper) as Filter[]).map((filter) => {
                const checked = config.indexOf(filter) > -1;

                return (
                  <Stack
                    key={filter}
                    direction="row"
                    alignItems="center"
                    cursor="pointer"
                    onClick={() => setConfig(checked ? config.filter((v) => v !== filter) : [...config, filter])}
                  >
                    <Checkbox checked={checked} />
                    <Text textStyle="body">{mapper[filter]}</Text>
                  </Stack>
                );
              })}
            </Stack>
            <Box>
              <StimButton size="stimSmall" onClick={onSubmit}>
                {t('Save')}
              </StimButton>
            </Box>
          </>
        ) : (
          <>
            <Text textStyle="body">{t('Put all your most used filters here for quick access.')}</Text>
            <Box>
              <StimButton size="stimSmall" onClick={() => setShowConfig(true)}>
                {t('Add Favorite Filters')}
              </StimButton>
            </Box>
          </>
        )}
      </Stack>

      <Image position="absolute" bottom={'3.7rem'} right={10} src="/icons/man_looking_to_charts.svg" />
    </Flex>
  );
};

export default FavoritesFilters;
