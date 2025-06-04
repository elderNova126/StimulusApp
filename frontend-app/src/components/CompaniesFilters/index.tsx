import {
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { applyFilters, DiscoveryState, resetFilter } from '../../stores/features';
import { setFilterOpen } from '../../stores/features/generalData';
import { getNumberOfAppliedFilters } from '../../utils/companies/getNumberOfAppliedFilters';
import BasicFilters from './Basic';
import CustomersAndBrandFilters from './CustomersAndBrand';
import DiversityAndEmployeesFilters from './DiversityAndEmployees/DiversityAndEmployeesFilters';
import FavoritesFilters from './Favorites';
import FinancialsFilters from './Financials';
import useEvent from 'react-use/lib/useEvent';
import { showErrorMessage } from '../../hooks/LocationFilterLogic';
import { navigate, useLocation, useParams } from '@reach/router';
import StimButton from '../ReusableComponents/Button';
const StyledTab = (props: { children: any }) => (
  <Tab
    p="5px 25px"
    textAlign="left"
    justifyContent="flex-start"
    width="100%"
    height="56px"
    color="#2A2A2899"
    _hover={{ bg: '#F6F6F6' }}
    _selected={{ borderBottom: '3px solid #12814B', color: 'green.600' }}
  >
    {props.children}
  </Tab>
);

const CompaniesFilters = () => {
  const params = useParams();
  const urlLocation = useLocation();
  const pathname = urlLocation.pathname.replace(/\d.*/g, "$'");
  const urlToNavigate = params?.id ? `${pathname}${params.id}/${params.viewMode}/${1}` : `${pathname}1`;
  const { t } = useTranslation();
  const numberOfFilters = useSelector((state: { discovery: DiscoveryState }) => {
    return getNumberOfAppliedFilters(state.discovery);
  });
  const localFilters = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter);
  const location = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.location);
  const searchOpen = useSelector((state: { generalData: any }) => state.generalData.openModal.search);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toastIdRef: any = useRef();
  const toast = useToast();
  const closeToast = () => toast.close(toastIdRef.current);

  useEffect(() => {
    if (isOpen) {
      dispatch(setFilterOpen(true));
    } else {
      dispatch(setFilterOpen(false));
    }
  });

  const styleNumberOfFilters = {
    w: '22px',
    height: '22px',
    borderRadius: '50%',
    bg: '#d9eee2',
    marginLeft: '-13px',
    zIndex: 'base',
  };
  const triggerRef: any = useRef(null);
  const popoverContentRef: any = useRef(null);

  useEvent('mousedown', (ev) => {
    if (!isOpen) {
      return;
    }
    const clickedInsideTrigger = triggerRef.current.contains(ev.target);

    const clickedInsidePopover = popoverContentRef.current.contains(ev.target);

    const clickedInsideAutocomplete = ev.target.closest('.pac-container') !== null;

    if (clickedInsideTrigger || clickedInsidePopover || clickedInsideAutocomplete) {
      return;
    }

    setIsOpen(false);
  });

  const handleOnClick = () => {
    if (!localFilters.latitude && !localFilters.longitude && !localFilters.postalCode && location) {
      showErrorMessage({
        closeToast,
        dispatch,
        t,
        toast,
        toastIdRef,
        message: `Please select a location from the suggested options or enter a zip code.`,
      });
    } else {
      setIsOpen(false);
      dispatch(applyFilters());
      navigate(urlToNavigate);
    }
  };
  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} closeOnBlur={false} onOpen={() => setIsOpen(true)} isLazy>
      <PopoverTrigger>
        <Flex>
          <StimButton
            ref={triggerRef}
            onClick={() => setIsOpen(true)}
            variant="stimTextButton"
            borderRadius="28px"
            maxH="34px"
            zIndex="auto"
            opacity={searchOpen ? '.4' : ''}
          >
            {t('Filters')}
          </StimButton>
          {!isOpen && numberOfFilters > 0 && (
            <Box sx={styleNumberOfFilters}>
              <Text textAlign="center" lineHeight="22px" fontWeight="semibold" fontSize="12px">
                {numberOfFilters}
              </Text>
            </Box>
          )}
        </Flex>
      </PopoverTrigger>
      <Box zIndex="modal">
        <PopoverContent bg="#FCFCFC" minWidth="75vw" maxWidth="80vw" mr="5" width="auto" ref={popoverContentRef}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody bg="#F8F8F8" p="0" height="550px" overflow="auto">
            <Tabs orientation="vertical" height="550px" h="100%" variant="unstyled" defaultIndex={0}>
              <TabList bg="#FCFCFC">
                <VStack spacing="0" alignItems="flex-start">
                  <StyledTab>
                    <Text textStyle="verticalTabs">{t('Favorites')}</Text>
                  </StyledTab>
                  <StyledTab>
                    <Text textStyle="verticalTabs">{t('Basic')}</Text>
                  </StyledTab>
                  <StyledTab>
                    <Text textStyle="verticalTabs">{t('Ownership & Employees')}</Text>
                  </StyledTab>
                  <StyledTab>
                    <Text textStyle="verticalTabs">{t('Financials')}</Text>
                  </StyledTab>
                </VStack>
              </TabList>

              <TabPanels>
                <TabPanel p="0" h="100%">
                  <FavoritesFilters />
                </TabPanel>
                <TabPanel>
                  <BasicFilters />
                </TabPanel>
                <TabPanel>
                  <DiversityAndEmployeesFilters />
                </TabPanel>
                <TabPanel>
                  <FinancialsFilters />
                </TabPanel>
                <TabPanel>
                  <CustomersAndBrandFilters />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </PopoverBody>
          <PopoverFooter h="47px" boxShadow="stimMedium">
            <Flex justifyContent="flex-between" w="100%" pb="2px">
              <Flex flex="1" alignItems="flex-start">
                <StimButton
                  onClick={() => {
                    setIsOpen(true);
                    dispatch(resetFilter());
                    navigate(urlToNavigate);
                  }}
                  size="stimSmall"
                  variant="stimTextButton"
                >
                  {t('Reset Filters')}
                </StimButton>
              </Flex>
              <Flex flex="1" direction="row-reverse" alignItems="flex-start">
                <StimButton
                  onClick={() => {
                    handleOnClick();
                  }}
                  colorScheme="teal"
                  variant="stimOutline"
                  bg="white"
                  size="stimSmall"
                >
                  {`${t('Apply filters')}(${numberOfFilters || 0})`}
                </StimButton>
                {false && (
                  <Text color="white" as="h6" textStyle="h6" pr="10px" pt="8px">
                    {t('x results')}
                  </Text>
                )}
              </Flex>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Box>
    </Popover>
  );
};

export default CompaniesFilters;
