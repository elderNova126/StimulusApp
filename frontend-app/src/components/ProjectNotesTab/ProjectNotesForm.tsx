import { useMutation } from '@apollo/client';
import { Box, Flex, Spinner, Text, Textarea } from '@chakra-ui/react';
import * as R from 'ramda';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast, useUser } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

const { PROJECT_NOTES_GQL } = ProjectQueries;
const { CREATE_PROJECT_NOTE_GQL, UPDATE_PROJECT_NOTE_GQL } = ProjectMutations;

interface Props {
  projectId: number;
  parentNoteId?: number;
  onClose?: () => void;
  isCancelAvailable?: boolean;
  title?: string;
  isEdit?: boolean;
  formBody?: string;
  noteId?: number;
}

const ProjectNotesForm: FC<Props> = ({
  projectId,
  parentNoteId,
  onClose,
  isCancelAvailable,
  formBody,
  isEdit,
  title = 'Comment',
  noteId,
}) => {
  const { t } = useTranslation();
  const errTranslations = useErrorTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const [comment, setComment] = useState<string>('');
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const {
    user: { sub: userId },
  } = useUser();

  useEffect(() => {
    if (formBody) {
      setComment(formBody);
    }
  }, [formBody]);

  const [saveNote] = useMutation(CREATE_PROJECT_NOTE_GQL, {
    update: (cache, { data: { createProjectNote: noteData } }) => {
      const { projectNotes } = R.clone(cache.readQuery({ query: PROJECT_NOTES_GQL(projectId) })) as any;
      const oldNotes = projectNotes?.results || [];
      projectNotes.results = [...oldNotes, noteData];
      projectNotes.count = (projectNotes?.count ?? 0) + 1;

      cache.writeQuery({
        query: PROJECT_NOTES_GQL(projectId),
        data: { projectNotes: { ...projectNotes } },
      });
      setComment('');

      if (typeof onClose !== 'undefined') {
        onClose();
      }
    },
  });

  const handleSaveNote = () => {
    saveNote({
      variables: { projectId, body: comment, ...(parentNoteId && { parentNoteId }) },
      optimisticResponse: {
        createProjectNote: {
          __typename: 'ProjectNote',
          id: null,
          created: null,
          body: comment,
          createdBy: userId,
          parentNote: parentNoteId || null,
        },
      },
    }).then(() => enqueueSnackbar(`Note added`, { status: 'success' }));
  };

  const [updateNote] = useMutation(UPDATE_PROJECT_NOTE_GQL);

  const handleNoteEdit = () => {
    setLoadingUpdate(true);
    updateNote({
      variables: { id: noteId, body: comment },
      optimisticResponse: {
        updateProjectNote: {
          __typename: 'ProjectNote',
          id: noteId,
          comment,
        },
      },
    }).then(({ data: { updateProjectNote: noteData } }) => {
      setLoadingUpdate(false);
      if (typeof onClose !== 'undefined') {
        onClose();
      }
      if (noteData?.error) {
        return enqueueSnackbar(errTranslations[noteData.code], { status: 'error' });
      }
      enqueueSnackbar(`Note edited`, { status: 'success' });
    });
  };

  return (
    <Flex flexDirection="column" marginBottom="3rem" marginLeft="2.5rem">
      <Text as="h4" textStyle={'h4'}>
        {title}
      </Text>
      <form onSubmit={() => (comment.length > 0 ? (isEdit ? handleNoteEdit() : handleSaveNote()) : undefined)}>
        <Textarea
          marginTop=".3rem"
          minHeight="120px"
          maxWidth="460px"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </form>
      <Box marginTop="1rem">
        <StimButton
          onClick={() => (comment.length > 0 ? (isEdit ? handleNoteEdit() : handleSaveNote()) : undefined)}
          isDisabled={comment.length === 0 || loadingUpdate}
          size="stimSmall"
          id="project-notes-form-submit-button-000"
        >
          {t('Send')}
        </StimButton>
        {isCancelAvailable && (
          <StimButton
            variant="stimTextButton"
            onClick={() => {
              setComment('');
              onClose && onClose();
            }}
            isDisabled={loadingUpdate}
          >
            {t('Cancel')}
          </StimButton>
        )}
        {loadingUpdate && <Spinner />}
      </Box>
    </Flex>
  );
};

export default ProjectNotesForm;
