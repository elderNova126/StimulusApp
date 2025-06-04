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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ListsMutations from '../../graphql/Mutations/ListsMutations';
import { useStimulusToast } from '../../hooks';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import * as R from 'ramda';
import StimButton from '../ReusableComponents/Button';

const { UPDATE_COMPANY_LIST } = ListsMutations;
const { GET_COMPANY_LISTS } = CompanyQueries;
const RenameModalContent = forwardRef((props: { list: any; close: () => void }, cancelRef: any) => {
  const { t } = useTranslation();
  const { list, close } = props;
  const [name, setName] = useState(list.name ?? '');
  const { enqueueSnackbar } = useStimulusToast();

  const [updateList, { loading }] = useMutation(UPDATE_COMPANY_LIST, {
    update: (cache, { data: { updateCompanyList } }) => {
      if (updateCompanyList.error) {
        enqueueSnackbar(t('There was an error. Please try again'), { status: 'error' });
      } else {
        const { companyLists } = R.clone(
          cache.readQuery({ query: GET_COMPANY_LISTS }) ?? {
            results: [],
          }
        );
        companyLists.results = companyLists?.results?.map((list: any) => {
          if (list.id === updateCompanyList.id) {
            return { ...list, name: updateCompanyList?.name };
          }
          return list;
        });

        cache.writeQuery({
          query: GET_COMPANY_LISTS,
          data: { companyLists },
        });
        enqueueSnackbar(t('List name updated'), { status: 'success' });
      }
      close();
    },
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        {t('Edit ')}
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
          isLoading={loading || undefined}
          variant="stimDestructive"
          onClick={() => updateList({ variables: { name, id: list.id } })}
          ml={3}
        >
          {t('Update')}
        </StimButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});

export default RenameModalContent;
