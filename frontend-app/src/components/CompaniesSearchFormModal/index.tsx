import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import Modal from '../GenericComponents/Dialog';
import { Checkbox } from '../GenericComponents';
import { SavedSearch } from '../../graphql/dto.interface';
import SaveSearchModalActions from './SaveSearchModalActions';

interface Props {
  savedSearch?: SavedSearch;
  onClose: () => void;
  isOpen: boolean;
}

const CompaniesSearchFormModal: FC<Props> = (props) => {
  const { savedSearch, onClose, isOpen } = props;
  const { t } = useTranslation();
  const [isPublic, setIsPublic] = useState<boolean>(savedSearch?.public || false);
  const [savedSearchName, setSavedSearchName] = useState<string>(savedSearch?.name || '');

  const modalTitle = t(savedSearch ? `Update ${savedSearch.name}` : `Save new search`);

  const actions = () => (
    <SaveSearchModalActions
      savedSearch={savedSearch}
      isPublic={isPublic}
      savedSearchName={savedSearchName}
      onSubmit={() => {
        onClose();
        if (!!savedSearch === false) {
          setSavedSearchName('');
        }
      }}
      onClose={() => {
        if (!!savedSearch === false) {
          setSavedSearchName('');
        }
        onClose();
      }}
    />
  );

  return (
    <Modal title={modalTitle} actions={actions()} isOpen={isOpen} onClose={onClose}>
      <Flex direction="column" justifyContent="space-evenly">
        <Text as="h4" textStyle="h4">
          {t('Name')}
        </Text>
        <Input
          value={savedSearchName}
          bg="#fff"
          onChange={(e) => setSavedSearchName(e.target.value)}
          marginTop="0.5rem"
          type="text"
          size="md"
          borderRadius="4px"
          flex="1"
          border="1px solid #848484"
          placeholder={t('Name is required')}
        />
        <Flex mt="1rem" direction="row" w="100%">
          <Box mt="4px" mr="5px">
            <Checkbox width="16px" height="16px" checked={isPublic} onClick={() => setIsPublic(!isPublic)} />
          </Box>
          <Text mr="10px" as="h3" textStyle="h3">
            {t('For Account')}
          </Text>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default CompaniesSearchFormModal;
