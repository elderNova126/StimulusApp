import React, { FC } from 'react';
import * as R from 'ramda';
import { useStimulusToast, useErrorTranslation } from '../../hooks';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { SavedSearch } from '../../graphql/dto.interface';
import { useDispatch } from 'react-redux';
import { resetFilter, setCloseSearch } from '../../stores/features';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import SearchMutations from '../../graphql/Mutations/SearchMutations';
import { navigate, useLocation, useParams } from '@reach/router';
import StimButton from '../ReusableComponents/Button';
const { DELETE_SAVED_SEARCH_GQL } = SearchMutations;
const { SAVED_SEARCHES } = CompanyQueries;

interface Props {
  savedSearch: SavedSearch;
  onClose: () => void;
}

const DeleteSearchModalActions: FC<Props> = ({ savedSearch, onClose }) => {
  const { t } = useTranslation();
  const errTranslations = useErrorTranslation();
  const [deleteSearch] = useMutation(DELETE_SAVED_SEARCH_GQL);
  const { enqueueSnackbar } = useStimulusToast();
  const dispatch = useDispatch();
  const params = useParams();
  const urlLocation = useLocation();
  const pathname = urlLocation.pathname.replace(/\d.*/g, "$'");
  const urlToNavigate = params?.id ? `${pathname}${params.id}/${params.viewMode}/${1}` : `${pathname}1`;
  const onDeleteClicked = () => {
    deleteSearch({
      variables: { id: savedSearch.id },
      update: (cache, { data: { deleteSavedSearch } }) => {
        if (deleteSavedSearch.error) {
          const message = errTranslations[deleteSavedSearch.code];
          return enqueueSnackbar(message, { status: 'error' });
        }
        const message = t(`Search ${savedSearch.name} deleted.`);
        enqueueSnackbar(message, { status: 'success' });

        const { savedSearches } = R.clone(cache.readQuery({ query: SAVED_SEARCHES })) as any;
        const { results: searches } = savedSearches;
        savedSearches.results = searches.filter(({ id }: any) => id !== savedSearch.id);

        cache.writeQuery({
          query: SAVED_SEARCHES,
          data: { savedSearches: { ...savedSearches } },
        });
      },
    });
    onClose();
    dispatch(resetFilter());
    navigate(urlToNavigate);
    dispatch(setCloseSearch(true));
  };

  return (
    <>
      <StimButton size="stimSmall" variant="stimOutline" onClick={onClose}>
        {t('Cancel')}
      </StimButton>
      <StimButton size="stimSmall" variant="stimDestructive" onClick={onDeleteClicked} ml={3}>
        {t('Delete')}
      </StimButton>
    </>
  );
};

export default DeleteSearchModalActions;
