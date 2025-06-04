import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  forwardRef,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { DiscoveryState } from '../../stores/features';
import { Direction, SortBy } from '../../graphql/enums';
import { mapperDownloadList } from '../../utils/dataMapper';
import { useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';
const { DOWNLOAD_LIST } = CompanyQueries;

const DownloadModalContent = forwardRef((props: { list: any; close: () => void }, cancelRef: any) => {
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();
  const { list, close } = props;
  const filters: any = useSelector((state: { discovery: DiscoveryState }) => state.discovery.variables);
  const [direction] = useState(Direction.ASC);
  const [orderBy] = useState(SortBy.NAME);
  const [getCompanies, { loading }] = useLazyQuery(DOWNLOAD_LIST, {
    fetchPolicy: 'cache-and-network',
    variables: {
      page: 1,
      direction,
      orderBy,
      lists: [list.id],
      limit: 1000,
      ...Object.keys(filters).reduce(
        (acc, curr) => ({
          ...acc,
          ...(!!filters[curr] && { [curr]: filters[curr] }),
        }),
        {}
      ),
    },
    onCompleted(data) {
      if (data.discoverCompanies.count > 0) {
        mapperDownloadList(data, list);
      } else {
        enqueueSnackbar('There are no results to download', { status: 'warning' });
      }
      close();
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        {t('Download ')}
        {list.name}
      </AlertDialogHeader>
      <AlertDialogBody>
        <Text as="h4" textStyle="h4">
          {t('The data of the first 1000 companies will be downloaded.')}
        </Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <StimButton size="stimSmall" variant="stimOutline" ref={cancelRef} onClick={close}>
          {t('Cancel')}
        </StimButton>
        <StimButton size="stimSmall" isLoading={loading} onClick={() => getCompanies()} ml={3}>
          {t('Download')}
        </StimButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});

export default DownloadModalContent;
