import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@chakra-ui/react';
import Modal from '../GenericComponents/Dialog';
import DeleteSearchModalActions from './DeleteSearchModalActions';
import { SavedSearch } from '../../graphql/dto.interface';

interface Props {
  savedSearch: SavedSearch;
  onClose: () => void;
  isOpen: boolean;
}

const CompaniesSearchDeleteModal: FC<Props> = ({ savedSearch, onClose, isOpen }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={t(`Delete ${savedSearch.name}`)}
      actions={<DeleteSearchModalActions savedSearch={savedSearch} onClose={onClose} />}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Text p="5px" w="100%">
        {t('Are you sure you want to delete this search? Once you press “Delete”, the information will be removed')}
      </Text>
    </Modal>
  );
};

export default CompaniesSearchDeleteModal;
