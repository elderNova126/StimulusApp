import { useLazyQuery } from '@apollo/client';
import { Icon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  List,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { navigate, useLocation, useParams } from '@reach/router';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { SavedSearch } from '../../graphql/dto.interface';
import {
  DiscoveryState,
  applyFilters,
  resetFilter,
  setAssetsFrom,
  setAssetsPctOfRevenueFrom,
  setAssetsPctOfRevenueTo,
  setAssetsTo,
  setBoardTotalFrom,
  setBoardTotalTo,
  setCloseSearch,
  setCustomersFrom,
  setCustomersTo,
  setDiverseOwnership,
  setEmployeesFrom,
  setEmployeesGrowthFrom,
  setEmployeesGrowthTo,
  setEmployeesTo,
  setFacebookFollowersFrom,
  setFacebookFollowersTo,
  setIndustries,
  setLeadershipTeamTotalFrom,
  setLeadershipTeamTotalTo,
  setLiabilitiesFrom,
  setLiabilitiesPctOfRevenueFrom,
  setLiabilitiesPctOfRevenueTo,
  setLiabilitiesTo,
  setLinkedInFollowersFrom,
  setLinkedInFollowersTo,
  setLocation,
  setNetProfitFrom,
  setNetProfitPctFrom,
  setNetProfitPctTo,
  setNetProfitTo,
  setNetPromoterScoreFrom,
  setNetPromoterScoreTo,
  setQuery,
  setRelationships,
  setRevenueFrom,
  setRevenueGrowthFrom,
  setRevenueGrowthTo,
  setRevenuePerEmployeeFrom,
  setRevenuePerEmployeeTo,
  setRevenueTo,
  setSavedSearch,
  setStatus,
  setStimulusScoreFrom,
  setStimulusScoreTo,
  setTwitterFollowersFrom,
  setTwitterFollowersTo,
  setType,
  setTypeOfLegalEntity,
  setLocationFilter,
  setCurrentLocationIsCheck,
} from '../../stores/features';
import { getNumberOfAppliedFilters } from '../../utils/companies/getNumberOfAppliedFilters';
import CompaniesSearchFormModal from '../CompaniesSearchFormModal';
import SavedSearchItem from './SavedSearchItem';
import LoadingSkeletonList from '../LoadingSkeletonList';
import StimButton from '../ReusableComponents/Button';
const { SAVED_SEARCHES } = CompanyQueries;

const CompaniesSavedSearches: FC = () => {
  const params = useParams();
  const urlLocation = useLocation();
  const pathname = urlLocation.pathname.replace(/\d.*/g, "$'");
  const urlToNavigate = params?.id ? `${pathname}${params.id}/${params.viewMode}/${1}` : `${pathname}1`;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isAddSearchOpen, setIsAddSearchOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [selectedSearch, setSelectedSearch] = useState<Partial<SavedSearch>>({});
  const closeSearch = useSelector((state: { discovery: DiscoveryState }) => state.discovery.closeSearch);
  const numberOfAppliedFilters = useSelector((state: { discovery: DiscoveryState }) => {
    return getNumberOfAppliedFilters(state.discovery);
  });
  const openModal = useSelector((state: { generalData: any }) => state.generalData.openModal);
  const [getSavedSearch, { data, loading: loadingSavedSearch }] = useLazyQuery(SAVED_SEARCHES, {
    fetchPolicy: 'cache-first',
  });
  const searches = data?.savedSearches?.results ?? [];

  const handleSelectSavedSearchItem = (searchItem: any) => {
    const {
      scoreValueFrom,
      scoreValueTo,
      jurisdictionOfIncorporation,
      industries,
      revenueFrom,
      revenueTo,
      employeesFrom,
      employeesTo,
      companyType,
      companyStatus,
      query,
      diverseOwnership,
      revenuePerEmployeeFrom,
      revenuePerEmployeeTo,
      revenueGrowthFrom,
      revenueGrowthTo,
      relationships,
      location,
      boardTotalFrom,
      boardTotalTo,
      leadershipTeamTotalFrom,
      leadershipTeamTotalTo,
      netProfitFrom,
      netProfitTo,
      netProfitPctFrom,
      netProfitPctTo,
      liabilitiesFrom,
      liabilitiesTo,
      customersFrom,
      customersTo,
      netPromoterScoreFrom,
      netPromoterScoreTo,
      twitterFollowersFrom,
      twitterFollowersTo,
      linkedInFollowersFrom,
      linkedInFollowersTo,
      facebookFollowersFrom,
      facebookFollowersTo,
      liabilitiesPctOfRevenueFrom,
      liabilitiesPctOfRevenueTo,
      employeesGrowthFrom,
      employeesGrowthTo,
      assetsFrom,
      assetsTo,
      assetsPctOfRevenueFrom,
      assetsPctOfRevenueTo,
      typeOfLegalEntity,
      radius,
      country,
      region,
      city,
      postalCode,
      latitude,
      longitude,
      currentLocationIsSet,
      // TODO complete this with all filters when they will be available on backend
    } = searchItem.config || {};

    const geoFilters = {
      radius,
      country,
      region,
      city,
      postalCode,
      latitude,
      longitude,
    };

    dispatch(setStimulusScoreFrom(scoreValueFrom || undefined));
    dispatch(setStimulusScoreTo(scoreValueTo || undefined));
    dispatch(setLocation(jurisdictionOfIncorporation || undefined));
    dispatch(setIndustries(industries ? JSON.parse(searchItem.config?.industries) : []));
    dispatch(setRevenueFrom(revenueFrom || undefined));
    dispatch(setRevenueTo(revenueTo || undefined));
    dispatch(setEmployeesFrom(employeesFrom || undefined));
    dispatch(setEmployeesTo(employeesTo || undefined));
    dispatch(setType([companyType] || ''));
    dispatch(setStatus([companyStatus] || ''));
    dispatch(setQuery(query || ''));
    dispatch(setDiverseOwnership(diverseOwnership ? [...diverseOwnership[0].split(',')] : []));
    dispatch(setRevenuePerEmployeeFrom(revenuePerEmployeeFrom || undefined));
    dispatch(setRevenuePerEmployeeTo(revenuePerEmployeeTo || undefined));
    dispatch(setRevenueGrowthFrom(revenueGrowthFrom || undefined));
    dispatch(setRevenueGrowthTo(revenueGrowthTo || undefined));
    dispatch(setRelationships(relationships ? [...relationships[0].split(',')] : []));
    dispatch(setLocation(location || ''));
    dispatch(setBoardTotalFrom(boardTotalFrom || undefined));
    dispatch(setBoardTotalTo(boardTotalTo || undefined));
    dispatch(setLeadershipTeamTotalFrom(leadershipTeamTotalFrom || undefined));
    dispatch(setLeadershipTeamTotalTo(leadershipTeamTotalTo || undefined));
    dispatch(setNetProfitFrom(netProfitFrom || undefined));
    dispatch(setNetProfitTo(netProfitTo || undefined));
    dispatch(setNetProfitPctFrom(netProfitPctFrom || undefined));
    dispatch(setNetProfitPctTo(netProfitPctTo || undefined));
    dispatch(setLiabilitiesFrom(liabilitiesFrom || undefined));
    dispatch(setLiabilitiesTo(liabilitiesTo || undefined));
    dispatch(setCustomersFrom(customersFrom || undefined));
    dispatch(setCustomersTo(customersTo || undefined));
    dispatch(setNetPromoterScoreFrom(netPromoterScoreFrom || undefined));
    dispatch(setNetPromoterScoreTo(netPromoterScoreTo || undefined));
    dispatch(setTwitterFollowersFrom(twitterFollowersFrom || undefined));
    dispatch(setTwitterFollowersTo(twitterFollowersTo || undefined));
    dispatch(setLinkedInFollowersFrom(linkedInFollowersFrom || undefined));
    dispatch(setLinkedInFollowersTo(linkedInFollowersTo || undefined));
    dispatch(setFacebookFollowersFrom(facebookFollowersFrom || undefined));
    dispatch(setFacebookFollowersTo(facebookFollowersTo || undefined));
    dispatch(setLiabilitiesPctOfRevenueFrom(liabilitiesPctOfRevenueFrom || undefined));
    dispatch(setLiabilitiesPctOfRevenueTo(liabilitiesPctOfRevenueTo || undefined));
    dispatch(setEmployeesGrowthFrom(employeesGrowthFrom || undefined));
    dispatch(setEmployeesGrowthTo(employeesGrowthTo || undefined));
    dispatch(setAssetsFrom(assetsFrom || undefined));
    dispatch(setAssetsTo(assetsTo || undefined));
    dispatch(setAssetsPctOfRevenueFrom(assetsPctOfRevenueFrom || undefined));
    dispatch(setAssetsPctOfRevenueTo(assetsPctOfRevenueTo || undefined));
    dispatch(setTypeOfLegalEntity(typeOfLegalEntity || undefined));
    dispatch(setLocationFilter(geoFilters || undefined));
    dispatch(setSavedSearch(true));
    dispatch(setCurrentLocationIsCheck(currentLocationIsSet));
    dispatch(applyFilters());
    navigate(urlToNavigate);
    setIsPopoverOpen(false);
    setSelectedSearch(searchItem);
  };

  const onRemoveAppliedSearch = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    handleSelectSavedSearchItem({});
    dispatch(setSavedSearch(false));
  };

  useEffect(() => {
    if (isPopoverOpen) {
      getSavedSearch();
    }
  }, [isPopoverOpen]);

  useEffect(() => {
    if (closeSearch) {
      handleSelectSavedSearchItem({});
      dispatch(resetFilter());
      navigate(urlToNavigate);
      dispatch(setCloseSearch(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeSearch]);

  return (
    <>
      <Popover isOpen={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
        <PopoverTrigger>
          <Button
            opacity={openModal.filter || openModal.search ? '.4' : ''}
            onClick={() => setIsPopoverOpen(true)}
            variant={isPopoverOpen || Object.keys(selectedSearch).length > 0 ? 'rounded' : 'simple'}
            borderRadius="28px"
            maxH="34px"
          >
            {Object.keys(selectedSearch).length > 0 && (
              <>
                <Text textStyle="textLink"> {selectedSearch.name}</Text>
                <Icon fontSize="12px" margin="7px" as={IoMdClose} onClick={onRemoveAppliedSearch} />
                <Box ml="5px" mr="5px" border="1px solid white" h="100%" />
              </>
            )}
            <Icon as={BsThreeDotsVertical} />
          </Button>
        </PopoverTrigger>
        <Box zIndex="100">
          <PopoverContent p="0" bg="#FCFCFC" mr="5" maxWidth="250px">
            <PopoverArrow />
            <PopoverBody p="0">
              <Text as="h4" textStyle="h4" size="sm" p="15px" pl="27px">
                {t('Saved Searches')}
              </Text>
              <List spacing={2}>
                {loadingSavedSearch ? (
                  <LoadingSkeletonList />
                ) : (
                  <>
                    {searches.map((savedSearch: SavedSearch) => (
                      <SavedSearchItem
                        onClick={handleSelectSavedSearchItem}
                        key={savedSearch.id}
                        isSelected={selectedSearch ? savedSearch.id === selectedSearch.id : false}
                        savedSearch={savedSearch}
                      />
                    ))}
                  </>
                )}
              </List>
              <Box display="flex" w="100%" p="24px">
                <Tooltip label={numberOfAppliedFilters === 0 && t('No filters applied')} placement="top">
                  <StimButton
                    size="stimSmall"
                    variant="stimOutline"
                    // bg={BUTTON_STYLE}
                    // _hover={{ bg: BUTTON_STYLE }}
                    onClick={() => numberOfAppliedFilters > 0 && setIsAddSearchOpen(true)}
                    disabled={numberOfAppliedFilters === 0}
                  >
                    {`+ ${t('Save Search')}`}
                  </StimButton>
                </Tooltip>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Popover>
      <CompaniesSearchFormModal isOpen={isAddSearchOpen} onClose={() => setIsAddSearchOpen(false)} />
    </>
  );
};

export default CompaniesSavedSearches;
