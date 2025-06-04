import { useLazyQuery, useQuery } from '@apollo/client';
import { Box, CircularProgress, Flex, Stack, Table, Tbody, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReportQueries from '../../graphql/Queries/ReportQueries';
import { Pagination } from '../GenericComponents';
import ActivityLogItem from './ActivityLogItem';
import DataSourcesUpload from './DataSourcesUpload';
import StimButton from '../ReusableComponents/Button';

const { DATA_FILES_LIST } = ReportQueries;

const SourceReportPolling: FC = () => {
  useQuery(DATA_FILES_LIST, { fetchPolicy: 'network-only', pollInterval: 2000 });

  return null;
};

const DataSources: FC<RouteComponentProps> = () => {
  const [showDataSource, setShowDataSource] = useState<'json' | 'csv' | ''>('json');
  const [getFileList, { loading, data }] = useLazyQuery(DATA_FILES_LIST, { fetchPolicy: 'cache-first' });

  const files = data?.getUploadReports?.results ?? [];
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const { t } = useTranslation();

  useEffect(() => {
    getFileList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (newPage: number) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (val: number) => {
    setLimit(val);
    setPage(0);
  };

  const pollingActive = !!files.find(({ uploadReport }: any) => uploadReport?.status !== 'COMPLETED');

  return (
    <Flex direction="column" p="2rem">
      <Box>
        <Text as="h1" textStyle="h1">
          {t('Connected Data sources')}
        </Text>
        <Text textStyle="body">{t('You have 2 connected data sources.')}</Text>
      </Box>
      <Box data-testid="dataSources">
        {showDataSource ? (
          <>
            <DataSourcesUpload source={showDataSource} onClose={() => setShowDataSource('')} />
          </>
        ) : (
          <Stack p="1rem" justifyContent="center" alignItems="center">
            <Stack direction="row">
              <StimButton onClick={() => setShowDataSource('json')} minH="200px" minW="200px" variant="stimTextButton">
                <Box boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important">
                  <Stack p="1rem" alignItems="center">
                    <img src="/icons/json.svg" width="100px" alt="fav" />
                    <Box>{t('JSON')}</Box>
                  </Stack>
                </Box>
              </StimButton>
              <StimButton
                hidden
                onClick={() => setShowDataSource('csv')}
                minH="200px"
                minW="200px"
                variant="stimTextButton"
              >
                <Box boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important">
                  <Stack p="1rem" alignItems="center">
                    <img src="/icons/noun_csv.svg" width="100px" alt="fav" />
                    <Box>{t('CSV')}</Box>
                  </Stack>
                </Box>
              </StimButton>
            </Stack>
          </Stack>
        )}
      </Box>

      <Box border=" 1px solid #E4E4E4" m="1rem" border-radius="1rem">
        <Box p="2rem">
          <Text fontSize="1.5rem">
            {t('Data Source Activity Log')}
            {loading && <CircularProgress isIndeterminate color="green.300" mx="1rem" size="1.5rem" />}
          </Text>
        </Box>
        <Box>
          {pollingActive && <SourceReportPolling />}
          <Table bg="#ecececaa" variant="simple">
            <Thead display="none" border="none">
              <Tr>
                <Th />
                <Th />
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {files.slice(page * limit, (page + 1) * limit).map((file: any) => (
                <ActivityLogItem file={file} key={file.blob?.id} />
              ))}
            </Tbody>
          </Table>

          <Pagination
            page={page + 1}
            loading={loading}
            count={data?.getUploadReports?.results?.length ?? 0}
            rowsPerPageOptions={[]}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={limit}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default DataSources;
