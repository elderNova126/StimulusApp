import { useMutation } from '@apollo/client';
import * as R from 'ramda';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { SavedSearch } from '../../graphql/dto.interface';
import SearchMutations from '../../graphql/Mutations/SearchMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import { DiscoveryState, FilterInterval, Industry } from '../../stores/features';
import StimButton from '../ReusableComponents/Button';

const { UPDATE_SAVED_SEARCH, SAVE_SEARCH } = SearchMutations;
const { SAVED_SEARCHES } = CompanyQueries;

interface Props {
  savedSearch?: SavedSearch;
  isPublic: boolean;
  savedSearchName: string;
  onSubmit: () => void;
  onClose: () => void;
}

const SaveSearchModalActions: FC<Props> = ({ savedSearch, isPublic, savedSearchName, onSubmit, onClose }) => {
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();
  const errTranslations = useErrorTranslation();
  const [updateSearch] = useMutation(UPDATE_SAVED_SEARCH);
  const [saveSearch] = useMutation(SAVE_SEARCH);

  // basic
  const stimulusScore: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.stimulusScore
  );
  const query: string = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.query);
  const location: string = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.location);
  const companyType: string[] = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.type);
  const companyStatus: string[] = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.status);
  const industries: Industry[] = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.industries);
  const relationships: string[] = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.relationships);

  // financials
  const revenue: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.revenue);
  const revenueGrowth: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.revenueGrowth
  );
  const netProfit: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.netProfit);
  const netProfitPct: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.netProfitPct
  );
  const assets: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.assets);
  const assetsPctOfRevenue: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.assetsPctOfRevenue
  );
  const liabilities: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.liabilities
  );
  const liabilitiesPctOfRevenue: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.liabilitiesPctOfRevenue
  );

  // diversity
  const employees: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.employees);
  const diverseOwnership = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.diverseOwnership);
  const boardTotal: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.boardTotal);
  const leadershipTeamTotal: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.leadershipTeamTotal
  );
  const employeesGrowth: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.employeesGrowth
  );
  const revenuePerEmployee: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.revenuePerEmployee
  );

  // customers
  const customers: FilterInterval = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.customers);
  const netPromoterScore: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.netPromoterScore
  );
  const twitterFollowers: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.twitterFollowers
  );
  const facebookFollowers: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.facebookFollowers
  );
  const linkedInFollowers: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.linkedInFollowers
  );

  // geoFilters
  const radius = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.radius);
  const city = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.city);
  const country = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.country);
  const latitude = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.latitude);
  const longitude = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.longitude);
  const postalCode = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.postalCode);
  const region = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter.state);

  const currentLocationIsSet = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.currentLocationIsCheck
  );

  const typeOfLegalEntity = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.typeOfLegalEntity);

  const onRenameClicked = () => {
    // @ts-ignore
    const variables = {
      ...(savedSearch && { id: savedSearch.id }),
      name: savedSearchName,
      public: isPublic,
      ...(query && { query }),
      ...(stimulusScore?.from && { scoreValueFrom: stimulusScore.from }),
      ...(stimulusScore?.to && { scoreValueTo: stimulusScore.to }),
      ...(industries && industries.length > 0 && { industries: JSON.stringify(industries) }),
      ...(location && { location }),
      ...(revenue?.from && { revenueFrom: revenue.from }),
      ...(revenue?.to && { revenueTo: revenue.to }),
      ...(employees?.from && { employeesFrom: employees.from }),
      ...(employees?.to && { employeesTo: employees.to }),
      ...(companyType && companyType.length > 0 && { companyType: companyType?.join() }),
      ...(companyStatus && companyStatus.length > 0 && { companyStatus: companyStatus?.join() }),
      ...(relationships && relationships.length > 0 && { relationships: relationships.join(',') }),
      ...(revenueGrowth?.from && { revenueGrowthFrom: revenueGrowth.from }),
      ...(revenueGrowth?.to && { revenueGrowthTo: revenueGrowth.to }),
      ...(netProfit?.from && { netProfitFrom: netProfit.from }),
      ...(netProfit?.to && { netProfitTo: netProfit.to }),
      ...(netProfitPct?.from && { netProfitPctFrom: netProfitPct.from }),
      ...(netProfitPct?.to && { netProfitPctTo: netProfitPct.to }),
      ...(assets?.from && { assetsFrom: assets.from }),
      ...(assets?.to && { assetsTo: assets.to }),
      ...(assetsPctOfRevenue?.from && { assetsPctOfRevenueFrom: assetsPctOfRevenue.from }),
      ...(assetsPctOfRevenue?.to && { assetsPctOfRevenueTo: assetsPctOfRevenue.to }),
      ...(liabilities?.from && { liabilitiesFrom: liabilities.from }),
      ...(liabilities?.to && { liabilitiesTo: liabilities.to }),
      ...(liabilitiesPctOfRevenue?.from && { liabilitiesPctOfRevenueFrom: liabilitiesPctOfRevenue.from }),
      ...(liabilitiesPctOfRevenue?.to && { liabilitiesPctOfRevenueTo: liabilitiesPctOfRevenue.to }),
      ...(diverseOwnership && diverseOwnership.length > 0 && { diverseOwnership: diverseOwnership.join(',') }),
      ...(boardTotal?.from && { boardTotalFrom: boardTotal.from }),
      ...(boardTotal?.to && { boardTotalTo: boardTotal.to }),
      ...(leadershipTeamTotal?.from && { leadershipTeamTotalFrom: leadershipTeamTotal.from }),
      ...(leadershipTeamTotal?.to && { leadershipTeamTotalTo: leadershipTeamTotal.to }),
      ...(employeesGrowth?.from && { employeesGrowthFrom: employeesGrowth.from }),
      ...(employeesGrowth?.to && { employeesGrowthTo: employeesGrowth.to }),
      ...(revenuePerEmployee?.from && { revenuePerEmployeeFrom: revenuePerEmployee.from }),
      ...(revenuePerEmployee?.to && { revenuePerEmployeeTo: revenuePerEmployee.to }),
      ...(customers?.from && { customersFrom: customers.from }),
      ...(customers?.to && { customersTo: customers.to }),
      ...(netPromoterScore?.from && { netPromoterScoreFrom: netPromoterScore.from }),
      ...(netPromoterScore?.to && { netPromoterScoreTo: netPromoterScore.to }),
      ...(twitterFollowers?.from && { twitterFollowersFrom: twitterFollowers.from }),
      ...(twitterFollowers?.to && { twitterFollowersTo: twitterFollowers.to }),
      ...(facebookFollowers?.from && { facebookFollowersFrom: facebookFollowers.from }),
      ...(facebookFollowers?.to && { facebookFollowersTo: facebookFollowers.to }),
      ...(linkedInFollowers?.from && { linkedInFollowersFrom: linkedInFollowers.from }),
      ...(linkedInFollowers?.to && { linkedInFollowersTo: linkedInFollowers.to }),
      ...(radius && { radius }),
      ...(city && { city }),
      ...(region && { region }),
      ...(country && { country }),
      ...(latitude && { latitude }),
      ...(longitude && { longitude }),
      ...(postalCode && { postalCode }),
      ...(typeOfLegalEntity && { typeOfLegalEntity }),
      ...(currentLocationIsSet && { currentLocationIsSet }),
    };
    if (savedSearch) {
      updateSearch({
        variables,
        update: (cache, { data: { updateSavedSearch } }) => {
          if (updateSavedSearch.error) {
            const message = errTranslations[updateSavedSearch.code];
            return enqueueSnackbar(message, { status: 'error' });
          }
          const message = `Search ${updateSavedSearch?.name} updated.`;
          enqueueSnackbar(message, { status: 'success' });
        },
      });
    } else {
      saveSearch({
        variables,
        update: (cache, { data: { createSavedSearch } }) => {
          if (createSavedSearch.error) {
            const message = errTranslations[createSavedSearch.code];
            return enqueueSnackbar(message, { status: 'error' });
          }
          const message = `Search ${createSavedSearch?.name} saved.`;
          enqueueSnackbar(message, { status: 'success' });

          const { savedSearches } = R.clone(cache.readQuery({ query: SAVED_SEARCHES })) as any;
          const { results: searches } = savedSearches;
          savedSearches.results = searches ? [...searches, createSavedSearch] : [createSavedSearch];

          cache.writeQuery({
            query: SAVED_SEARCHES,
            data: { savedSearches: { ...savedSearches } },
          });
        },
      });
    }

    onSubmit();
  };

  return (
    <>
      <StimButton size="stimSmall" variant="stimOutline" onClick={() => onClose()}>
        {t('Cancel')}
      </StimButton>
      <StimButton
        size="stimSmall"
        variant="stimDestructive"
        onClick={() => savedSearchName.length !== 0 && onRenameClicked()}
        disabled={savedSearchName.length === 0}
        ml={3}
      >
        {t(`${savedSearch ? 'Update' : 'Save'}`)}
      </StimButton>
    </>
  );
};

export default SaveSearchModalActions;
