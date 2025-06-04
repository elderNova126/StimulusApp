import {
  Box,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
  RadioGroup,
  Radio,
  Skeleton,
  InputGroup,
} from '@chakra-ui/react';
import { useEffect, useRef, useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useGeolocation } from '../../../hooks';
import {
  DiscoveryState,
  setLocation,
  setLocationFilter,
  setCurrentLocationIsCheck,
  applyFilters,
} from '../../../stores/features';
import { Checkbox } from '../../GenericComponents';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import config from '../../../config/environment.config';
import { getGeolocation, handleGoogleAutoComplete, showErrorMessage } from '../../../hooks/LocationFilterLogic';
import { options } from '../../../config/mapConfig';
import { DeleteIcon } from '@chakra-ui/icons';
import { getAddress } from '../../../utils/address';

const LocationFilter: FC<{ showTitle?: boolean }> = ({ showTitle = true }) => {
  const location = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.location);
  const miles = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter?.radius
  ) as number;
  const addressStreet = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter?.addressStreet
  );
  const isChecked = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.currentLocationIsCheck);
  const localFilters = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.locationsFilter);
  const [hasRoute, setHasRoute] = useState(addressStreet ? true : false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [coords, loadingFetch, setFetchData] = useGeolocation();
  const [radio, setRadio] = useState(miles > 0 ? '2' : '1');
  const INPUT_PLACE_HOLDER = 'Search by ZIP code, city, state or address';

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toastIdRef: any = useRef();
  const toast = useToast();
  const closeToast = () => toast.close(toastIdRef.current);
  const [libraries]: any = useState(['places']);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: config.googleMapsApiKey, libraries });
  const inputRef: any = useRef();

  useEffect(() => {
    if (coords && isChecked && miles !== 0) {
      setFetchData(false);
      const fetchData = async () => {
        try {
          const addressData = await getAddress({ longitude: coords.longitude, latitude: coords.latitude });
          dispatch(
            setLocationFilter({
              radius: miles,
              latitude: coords.latitude,
              longitude: coords.longitude,
              city: addressData?.city,
              country: addressData?.country,
              state: addressData?.state,
            })
          );
        } catch (error) {
          console.error('Error in fetchData:', error);
        }
      };
      fetchData();
    }
  }, [coords, isChecked]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (miles === 0) {
      setRadio('1');
      isChecked && dispatch(setCurrentLocationIsCheck(false));
    } else {
      setRadio('2');
    }
    setHasRoute(addressStreet ? true : false);
  }, [miles, radio]); // eslint-disable-line react-hooks/exhaustive-deps

  const handelNavigate = (event: any) => {
    event.stopPropagation();
    setRadio(isChecked ? '1' : '2');
    getGeolocation({
      setFetchData,
      closeToast,
      isChecked,
      toast,
      toastIdRef,
      t,
      dispatch,
    });
  };

  const handelInputChange = (e: any) => {
    if (e.target.value) {
      dispatch(setLocation(e.target.value));
      dispatch(setCurrentLocationIsCheck(false));
    } else if (e.target.value === '') {
      dispatch(setLocation(''));
      dispatch(setLocationFilter({ radius: localFilters.radius }));
    }
  };

  const handlePlaceChanged = () => {
    dispatch(setCurrentLocationIsCheck(false));
    const { hasAddress } = handleGoogleAutoComplete({
      inputRef,
      dispatch,
      closeToast,
      setIsInvalid,
      localFilters,
    });
    setHasRoute(hasAddress);
    dispatch(applyFilters());
  };

  const handleDeleteButton = () => {
    dispatch(setLocation(''));
    dispatch(setLocationFilter({ radius: 0 }));
    setIsInvalid(false);
    setHasRoute(false);
    dispatch(applyFilters());
  };

  const handleMilesChange = (e: any) => {
    dispatch(setLocationFilter({ ...localFilters, radius: e.target.value as number }));
  };

  const handleRefAutocomplete = (ref: any) => {
    inputRef.current = ref;
  };

  const handleOnClickSelect = () => {
    if (!localFilters.latitude && !localFilters.longitude) {
      showErrorMessage({
        closeToast,
        dispatch,
        t,
        toast,
        toastIdRef,
        message: `The range can't be selected without a location. Please, select a location first.`,
      });
    }
  };

  const onClickRadio = ({ searchByRadio }: { searchByRadio: boolean }) => {
    dispatch(setLocationFilter({ ...localFilters, radius: searchByRadio ? 10 : 0 }));
  };

  return (
    <>
      {showTitle && (
        <Text as="h4" textStyle="h4">
          {t('Location')} {loadingFetch && <Spinner color="#15844b" size="xs" />}
        </Text>
      )}
      <>
        {isLoaded ? (
          <Autocomplete
            onLoad={(ref) => handleRefAutocomplete(ref)}
            onPlaceChanged={handlePlaceChanged}
            options={options}
          >
            <InputGroup size="sm">
              <Input
                id="location-input"
                value={location}
                disabled={loadingFetch || isChecked}
                isInvalid={isInvalid}
                bg="#fff"
                onChange={(e) => {
                  handelInputChange(e);
                }}
                marginTop="1rem"
                type="text"
                size="sm"
                borderRadius="4px"
                flex="1"
                border="1px solid #848484"
                placeholder={INPUT_PLACE_HOLDER}
              />
              {location && (
                <DeleteIcon
                  color="#848484"
                  marginRight="0.5rem"
                  cursor="pointer"
                  marginTop="1.5rem"
                  marginLeft="0.5rem"
                  onClick={() => {
                    handleDeleteButton();
                  }}
                />
              )}
            </InputGroup>
          </Autocomplete>
        ) : (
          <Skeleton height="2rem" startColor="green.100" endColor="green.400" />
        )}
      </>
      <Stack
        spacing={3}
        direction="row"
        alignItems="center"
        cursor="pointer"
        marginTop="1rem"
        onClick={(e) => handelNavigate(e)}
      >
        <Checkbox checked={isChecked} color="blue" id="location-checkbox" data-testid="location-checkbox" />
        <Text textStyle="body">{t('Use my location')}</Text>
        {!showTitle && loadingFetch && <Spinner marginLeft="1%" color="#15844b" size="xs" />}
      </Stack>
      <Box display="flex" flexDirection="column" marginTop="1rem">
        <RadioGroup
          data-testid="location-radio-group"
          value={radio}
          onChange={(value) => {
            setRadio(value);
            onClickRadio({ searchByRadio: value === '2' });
          }}
        >
          <Stack spacing={5} direction="row">
            <Radio
              colorScheme="green"
              value="1"
              fontSize="14px"
              isDisabled={isChecked || hasRoute}
              onChange={() => onClickRadio({ searchByRadio: false })}
              cursor={isChecked || hasRoute ? 'not-allowed' : 'pointer'}
              data-testid="location-radio-exact"
            >
              <Text textStyle="body" cursor={isChecked || hasRoute ? 'not-allowed' : 'pointer'} fontSize="14px">
                {t('Exact')}
              </Text>
            </Radio>
            <Radio
              colorScheme="green"
              fontSize="14px"
              value="2"
              onChange={() => onClickRadio({ searchByRadio: true })}
              isDisabled={!localFilters.latitude && !localFilters.longitude}
              cursor={!localFilters.latitude && !localFilters.longitude ? 'not-allowed' : 'pointer'}
              data-testid="location-radio-radius"
            >
              <Text
                textStyle="body"
                cursor={!localFilters.latitude && !localFilters.longitude ? 'not-allowed' : 'pointer'}
                fontSize="14px"
              >
                {t('Radius')}
              </Text>
            </Radio>
            {isChecked || radio === '2' ? (
              <Select
                disabled={(isChecked || radio !== '2') && !localFilters.latitude && !localFilters.longitude}
                size="sm"
                borderRadius="4px"
                bg="#fff"
                value={miles}
                onClick={() => handleOnClickSelect()}
                onChange={(e: any) => {
                  handleMilesChange(e);
                }}
                marginTop="1rem"
                w="30%"
              >
                <option value={10}>10 Miles</option>
                <option value={20}>20 Miles</option>
                <option value={30}>30 Miles</option>
                <option value={50}>50 Miles</option>
                <option value={100}>100 Miles</option>
              </Select>
            ) : null}
          </Stack>
        </RadioGroup>
      </Box>
    </>
  );
};

export default LocationFilter;
