import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@chakra-ui/icons';
import { BsThreeDots } from 'react-icons/bs';
import CompaniesSearchDeleteModal from '../CompaniesSearchDeleteModal';
import CompaniesSearchFormModal from '../CompaniesSearchFormModal';
import { SavedSearch } from '../../graphql/dto.interface';

interface Props {
  savedSearch: SavedSearch;
  onClick: (searchItem: SavedSearch) => void;
  isSelected: boolean;
}

const SavedSearchItem: FC<Props> = ({ savedSearch, onClick, isSelected }) => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);

  const onShowActionsClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onToggle();
  };
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <>
      <Popover placement="left" isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <ListItem
            onClick={() => onClick(savedSearch)}
            display="flex"
            w="100%"
            pl="27px"
            _hover={{ bg: '#F6F6F6' }}
            key={savedSearch.id}
          >
            <Text
              cursor="pointer"
              fontWeight={isSelected ? 'bold' : ''}
              color={isSelected ? 'green.600' : ''}
              textAlign="start"
              textStyle="body"
              w="75%"
              mr="5"
              pt="7px"
            >
              {savedSearch.name}
              {savedSearch.public && ' | account'}
            </Text>
            <Button
              onClick={onShowActionsClick}
              bg="transparent"
              color={isSelected ? 'green.600' : ''}
              _hover={{
                bg: 'transparent',
              }}
              borderRadius="28px"
              maxH="34px"
            >
              <Icon as={BsThreeDots} />
            </Button>
          </ListItem>
        </PopoverTrigger>
        <Box zIndex="100">
          <PopoverContent p="0" bg="#FCFCFC" width="158px" height="117px">
            <PopoverArrow />
            <PopoverBody p="24px 0px" h="100%" display="flex" flexDirection="column">
              <Text
                onClick={() => setShowRenameModal(true)}
                p="5px"
                as="button"
                _hover={{ bg: '#F6F6F6' }}
                textAlign="start"
                w="100%"
                pl="24px"
                textStyle="body"
              >
                {t('Rename')}
              </Text>
              <Text
                onClick={() => setShowDeleteModal(true)}
                p="5px"
                as="button"
                _hover={{ bg: '#F6F6F6' }}
                textAlign="start"
                w="100%"
                pl="24px"
                textStyle="body"
              >
                {t('Delete')}
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Popover>
      <CompaniesSearchDeleteModal
        savedSearch={savedSearch}
        onClose={() => setShowDeleteModal(false)}
        isOpen={showDeleteModal}
      />
      <CompaniesSearchFormModal
        savedSearch={savedSearch}
        onClose={() => setShowRenameModal(false)}
        isOpen={showRenameModal}
      />
    </>
  );
};

export default SavedSearchItem;
