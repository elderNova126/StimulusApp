import { useLazyQuery } from '@apollo/client';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useOutsideClick,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigate, useLocation, useParams } from '@reach/router';

import SearchMenu from './SearchMenu';
import SearchBadge from './SearchBadge';
import { setOpenSearch } from '../../stores/features/generalData';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import LoadingSkeletonList from '../LoadingSkeletonList';
import { applyFilters, DiscoveryState, setFilterSearch, setQuery } from '../../stores/features';
import StimButton from '../ReusableComponents/Button';

const { GET_COMPANY_DIVERSE_OWNERSHIP } = CompanyQueries;

const CompaniesSearch = () => {
  const params = useParams();
  const urlLocation = useLocation();
  const pathname = urlLocation.pathname.replace(/\d.*/g, "$'");
  const urlToNavigate = params?.id ? `${pathname}${params.id}/${params.viewMode}/${1}` : `${pathname}1`;
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const query = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.query);
  const filterSearch = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.filterSearch);
  const savedSearch = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.savedSearch);
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { t } = useTranslation();
  const [getDiverseOwnership, { data: cachedDiverseOwnership, loading: loadingDiverseOwnership }] = useLazyQuery(
    GET_COMPANY_DIVERSE_OWNERSHIP,
    {
      fetchPolicy: 'cache-first',
    }
  );
  const availableDiverseOwnership = cachedDiverseOwnership?.getCompanyDistinctDiverseOwnership?.diverseOwnership ?? [];

  useEffect(() => {
    if (searchOpen) {
      dispatch(setOpenSearch(true));
    } else {
      dispatch(setOpenSearch(false));
    }
  });

  useEffect(() => {
    if (showSuggestions) getDiverseOwnership();
  }, [showSuggestions]);

  useOutsideClick({
    ref,
    handler: () => {
      if (searchOpen) {
        dispatch(applyFilters());
        navigate(urlToNavigate);
        setSearchOpen(false);
      }
    },
  });

  const setOption = (suggestion: string) => {
    if (!searchOpen) {
      setShowSuggestions(true);
      setSearchOpen(true);
    } else {
      dispatch(setQuery(suggestion));
      dispatch(applyFilters());
      navigate(urlToNavigate);
    }
  };

  const closeSearch = () => {
    dispatch(setQuery(''));
    dispatch(setFilterSearch('legalBusinessName'));
    setShowSuggestions(true);
    setSearchOpen(true);
  };

  return (
    <Box ref={ref}>
      <Flex>
        {!!query && !savedSearch && <SearchBadge filterSearch={filterSearch} query={query} onClose={closeSearch} />}
        <Box zIndex="modal">
          {searchOpen && (
            <Flex>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(applyFilters());
                  navigate(urlToNavigate);
                }}
              >
                <Popover isOpen={showSuggestions} placement="bottom-start">
                  <PopoverTrigger>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
                      <Input
                        bg="#FDFDFD"
                        maxH="34px"
                        type="text"
                        border="1px solid #D4D4D4"
                        boxSizing="border-box"
                        size="sm"
                        borderRadius="4px 0px 0px 4px"
                        value={query}
                        onChange={(e: any) => dispatch(setQuery(e.target.value))}
                      />
                    </InputGroup>
                  </PopoverTrigger>
                  <PopoverContent
                    w="auto"
                    border="1px solid #E4E4E4"
                    borderColor="#E4E4E4"
                    borderRadius="0"
                    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
                    boxSizing="border-box"
                  >
                    <PopoverBody>
                      <Stack spacing={3} maxW="auto">
                        <Text as="h4" textStyle="h4">
                          {t('Try using keywords or tags like')}
                        </Text>
                        <Flex flexWrap="wrap" maxW="400px">
                          {loadingDiverseOwnership ? (
                            <LoadingSkeletonList />
                          ) : (
                            <>
                              {availableDiverseOwnership.map((suggestion: string) => {
                                return (
                                  <StimButton
                                    onClick={() => setOption(suggestion)}
                                    w="50%"
                                    alignSelf="flex-start"
                                    variant="stimTextButton"
                                    colorScheme="gray"
                                    bg={query === suggestion ? 'lightgray' : 'white'}
                                    key={suggestion}
                                  >
                                    {suggestion}
                                  </StimButton>
                                );
                              })}
                            </>
                          )}
                        </Flex>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </form>
              <SearchMenu
                onOpen={() => {
                  setShowSuggestions(false);
                  setSearchOpen(true);
                }}
                onClose={() => setShowSuggestions(true)}
              />
            </Flex>
          )}
        </Box>
        <StimButton
          flex="20%"
          onClick={() => {
            if (!searchOpen) {
              setShowSuggestions(true);
              setSearchOpen(true);
            } else {
              dispatch(applyFilters());
              navigate(urlToNavigate);
            }
          }}
          variant={searchOpen || query ? 'stimPrimary' : 'stimTextButton'}
          maxH="34px"
        >
          {t('Search')}
        </StimButton>
      </Flex>
    </Box>
  );
};

export default CompaniesSearch;
