import { useLazyQuery } from '@apollo/client';
import { Box, Flex, IconButton, Image, Progress, Stack, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { getCompanyName } from '../../utils/dataMapper';
import { utcStringToLocalDate } from '../../utils/date';
import { CompanyLink } from '../EntityLink';

const { COMPANIES_BY_IDS_GQL } = CompanyQueries;

const CompaniesReport: FC<{ companiesIds: string[]; setshowDetails: (argument: boolean) => void }> = ({
  companiesIds,
  setshowDetails,
}) => {
  const [showData, setshowData] = useState(false);
  const [getCompanies, { data, loading }] = useLazyQuery(COMPANIES_BY_IDS_GQL, {
    fetchPolicy: 'cache-first',
    variables: { ids: companiesIds },
  });

  useEffect(() => {
    if (!loading && data) setshowDetails(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const companies = data?.searchCompanies?.results ?? [];
  return (
    <Box mx=".5rem">
      {!data && (
        <IconButton
          size="small"
          colorScheme="whiteAlpha"
          aria-label="companies"
          onClick={(event: any) => {
            if (companiesIds?.length > 0) {
              setshowData(!showData);
              getCompanies({ variables: { ids: companiesIds } });
            }
          }}
        >
          {!loading && <ExpandMoreIcon color="primary" />}
        </IconButton>
      )}
      <Box my=".5rem">
        {companies.map((company: any) => (
          <Box key={company.id}>
            <CompanyLink id={company.id} name={getCompanyName(company)} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const SourceReport: FC<{ report: any }> = ({ report }) => {
  const { t } = useTranslation();
  const errors = report?.errorsCount ?? 0;
  const [showDetails, setshowDetails] = useState(false);

  return (
    <Box>
      {report?.status === 'COMPLETED' ? (
        <Box>
          {report?.affectedCompanies?.length > 0 && (
            <>
              <Box display={showDetails ? 'block' : 'flex'}>
                <Text>
                  {t('Companies')}: {report?.affectedCompanies.length}
                </Text>
                <CompaniesReport setshowDetails={setshowDetails} companiesIds={report?.affectedCompanies} />
              </Box>
            </>
          )}
          {errors > 0 && (
            <Box>
              <Text>
                {t('Errors')}: {errors}
              </Text>
            </Box>
          )}
        </Box>
      ) : (
        <Flex direction="row">
          <Box display="flex" flexDirection="column" maxWidth="140px">
            <Text>{report?.status === 'PROGRESS' ? t('Processing...') : t('Initialized')}</Text>
            {report?.status === 'PROGRESS' && <Progress size="xs" isIndeterminate />}
          </Box>
        </Flex>
      )}
    </Box>
  );
};
const removeUuidFromName = (fileName: string) => {
  const [name] = fileName.split('.zip');
  return `${name.substring(0, name.length - 36)}.zip`;
};

function ActivityLogItem(props: { file: any; key: string }) {
  const { file, key } = props;

  return (
    <Tr border="none" key={key}>
      <Td>
        <Stack direction="row" alignItems="center">
          <Image width="30px" src="/icons/json.svg" alt="fav" />
          <Stack direction="row">
            <Tooltip label={removeUuidFromName(file.uploadReport?.fileName)}>
              <Text maxWidth="300px" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                {file.uploadReport?.status === 'COMPLETED' && <>{'Archive uploaded successfully'} </>}
                {file.blob?.id ?? removeUuidFromName(file.uploadReport?.fileName)}
              </Text>
            </Tooltip>
            <Text color="gray.100">{file.blob?.source}</Text>
          </Stack>
        </Stack>
      </Td>
      <Td>{file.uploadReport && <SourceReport report={file.uploadReport} />}</Td>
      <Td isNumeric>
        <Flex justifyContent="flex-end">
          {file.uploadReport?.status === 'COMPLETED' && (
            <Text color="gray.100">{utcStringToLocalDate(file.blob?.uploadTime)}</Text>
          )}
        </Flex>
      </Td>
    </Tr>
  );
}

export default ActivityLogItem;
