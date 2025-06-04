import { useLazyQuery, useMutation } from '@apollo/client';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  forwardRef,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ISharedListCollaborator, SharedListStatus } from '../../../graphql/Models/SharedList';
import ListsMutations from '../../../graphql/Mutations/ListsMutations';
import UserQueries from '../../../graphql/Queries/UserQueries';
import { useStimulusToast, useTenantCompany, useUser } from '../../../hooks';
import { setSharedListCollaborators } from '../../../stores/features/generalData';
import CollaboratorItem from './CollaboratorItem';
import useStyles from './styles';
import UserItem from './UserItem';

const { GET_USER_BY_NAME } = UserQueries;
const { CREATE_SHARE_LIST, CHANGE_STATUS_SHARED_LIST } = ListsMutations;

export interface IShareListModalContent {
  list: any;
  close: () => void;
  open: boolean;
}

const ShareListModalContent = forwardRef((props: IShareListModalContent) => {
  const { list, open, close } = props;
  const {
    user: { sub },
  } = useUser();
  const { tenantId } = useTenantCompany();
  const creatorList = list?.userCreator;
  const classes = useStyles();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [findUser, setFindUser] = useState('');
  const [changeStatusInvitation, { loading: changeStatusLoading }] = useMutation(CHANGE_STATUS_SHARED_LIST);

  const [currentUserId, setCurrentUserId] = useState('');
  const { enqueueSnackbar } = useStimulusToast();
  const collaborators = useSelector((state: any) => state.generalData.sharedListCollaborators);

  const [removingUser, setRemovingUser] = useState('');
  const [getUser, { data, loading: loadingSearchUser }] = useLazyQuery(GET_USER_BY_NAME, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    variables: { surname: findUser },
  });
  const userSuggestion = data?.getUserByName.results ?? [];
  const suggestionDiffertentCollaborators = userSuggestion.filter(
    (user: any) =>
      !collaborators.find((collaborator: any) => collaborator.id === user.externalAuthSystemId) &&
      list.createdBy !== user.externalAuthSystemId
  );

  const [shareList, { loading: shareListLoading }] = useMutation(CREATE_SHARE_LIST, {
    onCompleted(data) {
      if (data?.createSharedList) {
        const newUser = data?.createSharedList?.user;
        const userSelected = userSuggestion.find((user: any) => user.id === newUser?.id);
        const newCollaborator: ISharedListCollaborator = {
          ...userSelected,
          status: data?.createSharedList?.status,
          sharedListId: data?.createSharedList?.id,
        };
        dispatch(setSharedListCollaborators([...collaborators, newCollaborator]));
        enqueueSnackbar(t('Invitation sent successfully'), { status: 'success' });
        setFindUser('');
      }
      setCurrentUserId('');
    },
    onError(error) {
      setCurrentUserId('');
      enqueueSnackbar('Sending the invitation failed', { status: 'error' });
    },
  });

  const onRemove = (sharedListId: string) => {
    setRemovingUser(sharedListId);
    changeStatusInvitation({
      variables: {
        id: sharedListId.toString(),
        listId: list.id.toString(),
        status: SharedListStatus.DELETED,
      },
      update: (cache, { data }) => {
        const previewCollaboratorsList: any = {
          ...collaborators.find((collaborator: any) => collaborator.sharedListId === data.changeStatusSharedList.id),
        };
        if (previewCollaboratorsList) {
          const newCollaborators = collaborators.map((collaborator: any) => {
            if (collaborator.sharedListId === data.changeStatusSharedList.id) {
              return { ...previewCollaboratorsList, status: data.changeStatusSharedList.status };
            }
            return collaborator;
          });
          dispatch(setSharedListCollaborators(newCollaborators));
          if (data?.changeStatusSharedList) {
            enqueueSnackbar(t('User removed from the list'), { status: 'success' });
          }
        }
      },
      onError(error) {
        enqueueSnackbar('Error removing user from list', { status: 'error' });
      },
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (findUser && findUser.length > 4) {
        getUser();
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [findUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const onShare = (userId: string) => {
    setCurrentUserId(userId);
    if (sub !== userId) {
      // si es diferente al usuario logueado
      const isCreator = list.createdBy === sub; // chequeo si el usuario logueado es el creador de la lista
      if (isCreator) {
        // de ser asi envio el tenant del usuario logueado porque se que es el creador
        shareList({
          variables: {
            listId: list.id.toString(),
            listName: list.name,
            userId,
            tenantId,
          },
        });
      } else {
        shareList({
          variables: {
            listId: list.id.toString(),
            listName: list.name,
            userId,
          },
        });
      }
    }
  };

  const renderCreator = () => {
    return <UserItem user={creatorList ?? null} onShare={onShare} isCreator={true} />;
  };

  const renderCollaborators = () => {
    return (
      <>
        {collaborators.map((collaborator: any, index: number) => (
          <CollaboratorItem
            key={`${index}`}
            collaborator={collaborator ?? null}
            onRemove={() => onRemove(collaborator?.sharedListId)}
            loading={(changeStatusLoading || shareListLoading) && removingUser === collaborator?.sharedListId}
          />
        ))}
      </>
    );
  };

  const renderSuggestion = () => {
    return (
      <>
        {suggestionDiffertentCollaborators.length === 0 && (
          <>
            <Flex justifyContent={'center'} alignItems={'center'} h={200}>
              {loadingSearchUser ? <p>Loading</p> : <p>No users found</p>}
            </Flex>
          </>
        )}
        {suggestionDiffertentCollaborators.length > 0 && // eslint-disable-next-line
          suggestionDiffertentCollaborators.map((user: any, index: number) => {
            const exist = collaborators.find((collaborator: any) => collaborator?.id === user.id);
            if (exist === undefined && list.createdBy !== user.id) {
              return <UserItem loading={currentUserId === user.id} key={index} user={user} onShare={onShare} />;
            }
          })}
      </>
    );
  };

  return (
    <Modal isCentered={true} isOpen={open} onClose={close}>
      <ModalOverlay />
      <ModalContent border="1px solid var(--tooltip-box, #E4E4E4)">
        <ModalHeader className={classes.headerModal} fontSize="18px" fontWeight="400">
          {t('Invite People to List')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className={classes.bodyModal}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
            <Input
              className={classes.inputSearch}
              onChange={(e) => setFindUser(e.target.value)}
              value={findUser}
              placeholder="Search connection"
            />
            <InputRightElement
              children={
                loadingSearchUser && <Spinner thickness="4px" speed="0.65s" emptyColor="gray.300" color="green.500" />
              }
            />
          </InputGroup>

          <Flex flexDirection={'column'} mt={2} overflow="auto" maxH={'400px'}>
            {findUser.length <= 4 && suggestionDiffertentCollaborators.length === 0 ? (
              <>
                {renderCreator()}
                {renderCollaborators()}
              </>
            ) : (
              <>{renderSuggestion()}</>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default ShareListModalContent;
