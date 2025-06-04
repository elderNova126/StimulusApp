import { Box, Divider, Flex, Stack, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../GenericComponents';
import Map from '../../Map';
import { Company, Location } from '../company.types';
import { CompanyProfileDivider } from '../shared';

const DisplayView = (props: { company: Company }) => {
  const { company } = props;
  const locations = company.locations?.results ?? [];
  const companyForMap = { ...company, locationsByIndex: locations };
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const indexOfLastPost = page * limit;
  const indexOfFirstPost = indexOfLastPost - limit;
  const currentLocations = locations.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <Flex>
        <Stack flex="1" spacing={4} overflow="scroll" maxH="70vh">
          <Pagination
            count={locations?.length ?? 0}
            rowsPerPage={limit}
            page={page}
            onChangePage={setPage}
            onChangeRowsPerPage={setLimit}
            hideRowsPerPage={true}
          />
          <Box>
            <CompanyProfileDivider marginTop="-15px" />
          </Box>
          {locations.length > 0 ? (
            currentLocations.map((location: Location, i: number) => {
              const { addressStreet, addressStreet2, addressStreet3 } = location;
              const address = `${addressStreet ? addressStreet : ''} ${addressStreet2 ? addressStreet2 : ''} ${
                addressStreet3 ? addressStreet3 : ''
              }`;
              return (
                <Box key={location.id}>
                  <Stack spacing={2} w="80%">
                    <Text as="h3" textStyle="h3" fontWeight="medium">
                      {location.name}
                    </Text>
                    <Text textStyle="body">{address}</Text>
                    <Text textStyle="body">
                      {`${location?.city ? `${location?.city}, ` : ''} ${location?.state ? location?.state : ''}
                        ${location?.postalCode ? location?.postalCode : ''} `}
                    </Text>
                    <Text textStyle="body">{location?.phone}</Text>
                    <Text textStyle="miniTextLink">{t('Get Directions')}</Text>
                  </Stack>
                  {i !== locations.length - 1 && <Divider w="80%" />}
                </Box>
              );
            })
          ) : (
            <Text textStyle="body">{t('No Locations Found.')}</Text>
          )}
        </Stack>
        <Box flex="2">
          <Map companies={[companyForMap]} />
        </Box>
      </Flex>
    </>
  );
};

export default DisplayView;
