import {
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spacer,
  Table,
  Tbody,
  Text,
  Tooltip,
  Tr,
  Stack,
} from '@chakra-ui/react';
import { GpsFixed } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setMapLocation } from '../../stores/features';
import { getCompanyName } from '../../utils/dataMapper';
import CompanyAddActionPanel from '../CompanyAddActionPanel';
import { TdBorder } from '../ComparisonTable/TdBorder';
import { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
const CompaniesMapTable = (props: { companies: any; showBanner?: (data: boolean) => void }) => {
  const { companies, showBanner } = props as any;
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (companies?.some((company: any) => !!company?.locationsByIndex === true) === false) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [companies]);

  useEffect(() => {
    if (noResults) {
      showBanner(true);
    } else {
      showBanner(false);
    }
  }, [noResults, companies]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Table w="100%" height="0" variant="simple" __css={{ borderCollapse: 'separate', borderSpacing: '0px' }}>
      <Tbody>
        {noResults ? (
          <Stack p="1rem">
            <Text fontSize="15px" textStyle={'fieldHelperText'}>
              Sorry! No results found. Please try again using different search criteria.
            </Text>
          </Stack>
        ) : (
          <>
            {companies
              ?.map((company: any) =>
                company.locationsByIndex?.map?.((location: any, index: any) => {
                  const { addressStreet, addressStreet2, addressStreet3 } = location;
                  const address = `${addressStreet ? addressStreet : ''} ${addressStreet2 ? addressStreet2 : ''} ${
                    addressStreet3 ? addressStreet3 : ''
                  }`;
                  return (
                    <Tr key={`${company.id}_${location.id}_${index}`}>
                      <CompanyDataRow company={company} location={location} address={address} />
                    </Tr>
                  );
                })
              )
              .flat()}
          </>
        )}
      </Tbody>
    </Table>
  );
};

const CompanyDataRow = (props: { company: any; location: any; address: any }) => {
  const { company, address, location } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const setLocations = () => {
    dispatch(setMapLocation(location));
    setTimeout(() => {
      dispatch(setMapLocation({}));
    }, 1000);
  };

  const GeolocationAction = () => (
    <>
      {location.latitude && location.longitude ? (
        <Stack direction="row-reverse">
          <Tooltip label={t('Click here to see the position on the map')}>
            <Stack w="30px">
              <IconButton
                size="sm"
                bg="green.500"
                onClick={() => setLocations()}
                aria-label="Search database"
                icon={<GpsFixed fontSize="small" htmlColor="white" />}
              />
            </Stack>
          </Tooltip>
        </Stack>
      ) : (
        <Stack direction="row-reverse">
          <Tooltip label={t('This company has no location information.')}>
            <Stack w="30px">
              <IconButton
                disabled
                size="sm"
                bg="green.600"
                aria-label="Search database"
                icon={<GpsFixed fontSize="small" htmlColor="white" />}
              />
            </Stack>
          </Tooltip>
        </Stack>
      )}
    </>
  );

  return (
    <TdBorder _hover={false} padding="10px">
      <Flex direction="row" justifyContent="space-between">
        <Flex direction="column">
          <Text
            as="h2"
            textStyle="h2"
            onClick={() => navigate(`/company/${company.id}`)}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
          >
            {getCompanyName(company)}
          </Text>
          <Text as="h4" textStyle="h4" fontWeight={400}>
            {address}
          </Text>
          <Text as="h4" textStyle="h4" my="5px" fontWeight={400}>
            {`${location?.city ? `${location?.city}, ` : ''} ${location?.state ? location?.state : ''} ${
              location?.postalCode ? location?.postalCode : ''
            } `}
          </Text>
          <Text as="h4" textStyle="h4" fontWeight={400}>
            {location?.phone ?? location.phone}
          </Text>
        </Flex>
        <Flex justifyContent="flex-end">
          <Popover placement="right-start">
            <PopoverTrigger>
              <IconButton
                aria-label="add"
                size="xs"
                _hover={{ bg: 'gradient.iconbutton', borderRadius: '20' }}
                bg="transparent"
                onClick={(e: any) => e.stopPropagation()}
              >
                <FiMoreHorizontal fontSize="20px" />
              </IconButton>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                onClick={(e: any) => e.stopPropagation()}
                maxH="500px"
                overflowY="scroll"
                p="0"
                width="200px"
                borderRadius="0"
                border="1px solid #E4E4E4"
                borderColor="#E4E4E4"
                boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
              >
                <PopoverBody p="0">
                  <CompanyAddActionPanel company={company} />
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Flex>
      </Flex>
      <Spacer />
      {GeolocationAction()}
    </TdBorder>
  );
};

export { CompaniesMapTable, CompanyDataRow };
