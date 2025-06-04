import { useMutation } from '@apollo/client';
import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  forwardRef,
  Input,
  Text,
} from '@chakra-ui/react';
import * as R from 'ramda';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

const { CLONE_COMPANY_LIST } = ListsMutations;
const { GET_COMPANY_LISTS } = CompanyQueries;

const CloneModalContent = forwardRef((props: { list: any; close: () => void }, cancelRef: any) => {
  const { t } = useTranslation();
  const { list, close } = props;
  const { enqueueSnackbar } = useStimulusToast();
  const [name, setName] = useState(list.name ?? '');

  const [cloneCompanyList, { loading }] = useMutation(CLONE_COMPANY_LIST, {
    update: (cache, { data: { cloneCompanyList: newList } }) => {
      if (newList.error) {
        enqueueSnackbar(t('There was an error. Please try again'), { status: 'error' });
      } else {
        const { companyLists } = R.clone(cache.readQuery({ query: GET_COMPANY_LISTS }));
        companyLists.results = [...companyLists.results, newList];
        enqueueSnackbar(t('New list created'), { status: 'success' });
        cache.writeQuery({
          query: GET_COMPANY_LISTS,
          data: { companyLists },
        });
      }
      close();
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        {t('Duplicate ')}
        {list.name}
      </AlertDialogHeader>
      <AlertDialogBody>
        <Text as="h4" textStyle="h4">
          {t('Name')}
        </Text>
        <Input
          value={name}
          bg="#fff"
          onChange={(e) => setName(e.target.value)}
          marginTop="1rem"
          type="text"
          size="sm"
          borderRadius="4px"
          flex="1"
          border="1px solid #848484"
          placeholder="List name"
        />
      </AlertDialogBody>
      <AlertDialogFooter>
        <StimButton size="stimSmall" variant="stimOutline" ref={cancelRef} onClick={close}>
          {t('Cancel')}
        </StimButton>
        <StimButton
          size="stimSmall"
          isLoading={loading}
          onClick={() => cloneCompanyList({ variables: { id: list.id, name } })}
          ml={3}
        >
          {t('Clone')}
        </StimButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});

export default CloneModalContent;
