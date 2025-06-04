import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../../../graphql/Queries/CompanyQueries';
import { useMutation } from '@apollo/client';
import * as R from 'ramda';
import { useStimulusToast, useErrorTranslation } from '../../../../hooks';
import { deleteModal } from './stylesComments';
import StimButton from '../../../ReusableComponents/Button';

const { DELETE_COMPANY_NOTE_GQL } = CompanyMutations;
const { COMPANY_NOTES_GQL } = CompanyQueries;

const DeleteComments = (props: {
  isOpen: boolean;
  companyId: string;
  comment: any;
  setComment: (data: any) => void;
  setIsOpen: (data: boolean) => void;
}) => {
  const { isOpen, companyId, comment, setComment, setIsOpen } = props;
  const { onClose } = useDisclosure();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();

  const [deleteNote] = useMutation(DELETE_COMPANY_NOTE_GQL, {
    update: (cache, { data: { deleteCompanyNote } }) => {
      if (deleteCompanyNote?.error) {
        return enqueueSnackbar(errTranslations[deleteCompanyNote.code], { status: 'error' });
      } else if (deleteCompanyNote?.done) {
        const { companyNotes } = R.clone(cache.readQuery({ query: COMPANY_NOTES_GQL(companyId ?? '') })) as any;
        companyNotes.results = companyNotes.results.filter(
          (note: any) => note.id !== comment?.id && note.parentNote !== comment?.id
        );
        cache.writeQuery({
          query: COMPANY_NOTES_GQL(companyId ?? ''),
          data: { companyNotes: { ...companyNotes } },
        });
        enqueueSnackbar(t('Comment deleted'), { status: 'success' });
      }
      if (setComment) {
        setComment({ id: '', action: '', textNote: '', parentId: '' });
      }
    },
  });

  const handleDelete = () => {
    deleteNote({ variables: { id: comment?.id } });
    return setIsOpen(false);
  };

  const handleClose = () => {
    if (setComment) {
      setComment({ id: '', action: '', textNote: '', parentId: '' });
    }
    return setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} data-testid="deleteModal" id="deleteModalComment">
      <ModalOverlay />
      <ModalContent sx={deleteModal}>
        <ModalHeader>
          <Text align="start" p="5px" fontSize="18px" fontWeight="400">
            {t(comment?.replies ? 'Delete Comment Chain?' : 'Delete Comment?')}
          </Text>
        </ModalHeader>
        <ModalCloseButton fontSize="10px" mt="8px" color="#2A2A28" onClick={() => handleClose()} />
        <ModalBody>
          <Stack p="5px">
            <Box mt="-10px">
              <Text fontSize="14px">
                {t(
                  `Are you sure you want to delete this comment? ${
                    comment?.replies ? 'This action will remove the entire message chain.' : ''
                  }`
                )}
              </Text>
            </Box>
          </Stack>
        </ModalBody>
        <Flex justifyContent="flex-end" p="5">
          <StimButton variant="stimOutline" size="stimSmall" onClick={() => handleClose()}>
            {t('Cancel')}
          </StimButton>
          <StimButton size="stimSmall" variant="stimDestructive" onClick={() => handleDelete()} ml="1rem">
            {t('Delete')}
          </StimButton>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default DeleteComments;
