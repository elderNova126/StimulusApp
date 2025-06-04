import { Box, Center, Stack, Divider, Text, HStack } from '@chakra-ui/react';
import { CompanyLink } from '../EntityLink';
import { Link } from '@reach/router';
import { CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

export type Actions =
  | 'customList'
  | 'convertToInternal'
  | 'internalList'
  | 'favoriteList'
  | 'statusCompany'
  | 'createList'
  | 'updateList'
  | 'deleteList'
  | 'duplicatingList'
  | 'statusProject'
  | 'statusSupplier'
  | 'addingNote'
  | 'editEvaluation'
  | 'updateAccount'
  | 'updatePicture';

const MessageComponent = (props: {
  actions?: Actions;
  id?: string;
  name?: string;
  isFavorite?: boolean;
  bulkSelected?: number;
  bg?: string;
  color?: string;
  message?: null | string | HTMLElement | JSX.Element | ReactNode;
  close?: () => void;
}) => {
  const { t } = useTranslation();
  const { actions, id, name, isFavorite, bulkSelected, message, bg, color, close } = props;

  const messagesToShow = {
    customList: ' Companies added to a list.',
    internalList: bulkSelected === 1 ? ' Company added to Internal List.' : ' Companies added to Internal List.',
    favoriteList: bulkSelected === 1 ? ' Company added to Favorites List.' : ' Companies Added to Favorites List.',
    convertToInternal: ' Converting companies to internal.',
    statusCompany: " Changing a company's status.",
    createList: ' Creating a list.',
    updateList: ' Updating a list.',
    deleteList: ' Deleting a list.',
    duplicatingList: ' Duplicating a list.',
    statusProject: ' Change the status of a project to',
    statusSupplier: ' Provider status within a project changed',
    addingNote: ' Adding a note inside a project.',
    editEvaluation: ' Edit a company evaluation inside a project.',
    updateAccount: ' Updating information on the account profile',
    updatePicture: ' Updating the profile picture.',
  };
  const linkToGo = {
    customList: '',
    internalList: '/companies/internal/list/1',
    favoriteList: '/companies/favorites/list/1',
    convertToInternal: '',
    statusCompany: '',
    createList: '',
    updateList: '',
    deleteList: '',
    duplicatingList: '',
    statusProject: '',
    statusSupplier: '',
    addingNote: '',
    editEvaluation: '',
    updateAccount: '',
    updatePicture: '',
  };

  const texForLInk = {
    customList: 'View Custom',
    internalList: 'View Internal',
    favoriteList: 'View Favorites',
    convertToInternal: '',
    statusCompany: '',
    createList: '',
    updateList: '',
    deleteList: '',
    duplicatingList: '',
    statusProject: '',
    statusSupplier: '',
    addingNote: '',
    editEvaluation: '',
    updateAccount: '',
    updatePicture: '',
  };
  if (message) {
    return (
      <HStack
        width="max-content"
        color={color ? color : 'black'}
        boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
        bg={bg ? bg : 'white'}
        borderBottom={'1px solid'}
        borderLeft="1px solid"
        borderRight="1px solid"
        borderRightColor="#D3D3D3"
        borderLeftColor="#D3D3D3"
        borderBottomColor="#D3D3D3"
      >
        <Box p={5}>
          <Center height="20px">
            <Text whiteSpace="nowrap" fontWeight="bold">
              {typeof message === 'string' ? `${message}` : message}
            </Text>
          </Center>
        </Box>
        <Box
          cursor="pointer"
          color={color ? color : '"#161616"'}
          borderLeft="1px solid"
          borderLeftColor="#D3D3D3"
          p={5}
        >
          <CloseIcon fontSize="10px" onClick={close} />
        </Box>
      </HStack>
    );
  }

  return (
    <HStack
      width="max-content"
      color={color ? color : 'black'}
      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
      bg={bg ? bg : 'white'}
      borderBottom={'1px solid'}
      borderLeft="1px solid"
      borderRight="1px solid"
      borderRightColor="#D3D3D3"
      borderLeftColor="#D3D3D3"
      borderBottomColor="#D3D3D3"
    >
      <Box p={5}>
        <HStack justifyContent="space-between" verticalAlign="center">
          {id && name && (
            <>
              <CompanyLink id={id} name={name} />
              <Text whiteSpace="nowrap" fontWeight="bold">
                {isFavorite ? t(' added to Favorites List') : t(' removed from Favorites List')}
              </Text>
            </>
          )}
          {bulkSelected && (
            <Text whiteSpace="nowrap" fontWeight="bold">
              {`${bulkSelected ? bulkSelected + ' ' : ''} ${actions ? messagesToShow[actions] : ''}`}
            </Text>
          )}
          <Center height="20px">
            <Divider margin="0 8px 0 8px" orientation="vertical" borderColor="#C5C5C5" />
          </Center>
          <Stack>
            {actions && linkToGo[actions] !== undefined && (
              <Link to={`${linkToGo[actions]}`}>
                <Text textDecorationLine="underline" fontWeight="medium" whiteSpace="nowrap">
                  {t(`${texForLInk[actions]}`)}
                </Text>
              </Link>
            )}
          </Stack>
        </HStack>
      </Box>
      <Box cursor="pointer" color="#161616" borderLeft="1px solid" borderLeftColor="#D3D3D3" p={5} onClick={close}>
        <CloseIcon fontSize="10px" />
      </Box>
    </HStack>
  );
};

export default MessageComponent;
