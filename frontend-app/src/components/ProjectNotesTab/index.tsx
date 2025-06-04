import { useMutation, useQuery } from '@apollo/client';
import { Box, Divider, Text } from '@chakra-ui/react';
import * as R from 'ramda';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast, useUser } from '../../hooks';
import { notesMapper } from '../../utils/dataMapper';
import { Dialog } from '../GenericComponents';
import ProjectNotesForm from './ProjectNotesForm';
import SimpleNote from './SimpleNote';
import LoadingScreen from '../LoadingScreen';
import StimButton from '../ReusableComponents/Button';

const { PROJECT_NOTES_GQL } = ProjectQueries;
const { DELETE_PROJECT_NOTE_GQL } = ProjectMutations;

export interface Note {
  body: string;
  createdBy: string;
  created: string;
  id: number;
}

interface CurrentNote {
  id: number;
  type: string;
}

interface Props {
  projectId: number;
}

const ProjectNotesTab: FC<Props> = ({ projectId }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const [noteIdToDelete, setNoteIdToDelete] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<CurrentNote | null>(null);
  const {
    user: { sub: currentUserId },
  } = useUser();
  const { loading: loadingNotes, data } = useQuery(PROJECT_NOTES_GQL(projectId), {
    fetchPolicy: 'cache-first',
  });
  const notes: any = !loadingNotes && notesMapper(data?.projectNotes?.results || []);

  const [deleteNote] = useMutation(DELETE_PROJECT_NOTE_GQL, {
    update: (cache, { data: { deleteProjectNote } }) => {
      if (deleteProjectNote?.done) {
        const { projectNotes } = R.clone(cache.readQuery({ query: PROJECT_NOTES_GQL(projectId) })) as any;
        projectNotes.results = projectNotes.results.filter((note: any) => note.id !== noteIdToDelete);

        cache.writeQuery({
          query: PROJECT_NOTES_GQL(projectId),
          data: { projectNotes: { ...projectNotes } },
        });
      }
      setNoteIdToDelete(null);
    },
  });

  const handleNoteDelete = () => {
    deleteNote({
      variables: { id: noteIdToDelete },
      optimisticResponse: {
        deleteProjectNote: {
          done: true,
          __typename: 'BaseResponse',
        },
      },
    })
      .then(({ data: { deleteProjectNote } }) => {
        if (deleteProjectNote?.error) {
          return enqueueSnackbar(errTranslations[deleteProjectNote.code], { status: 'error' });
        }
        enqueueSnackbar(t('Note deleted!'), { status: 'success' });
      })
      .catch((e) => {
        // unable to delete
        return enqueueSnackbar(t('Unable to delete the note, try again'), { status: 'error' });
      });
  };

  return (
    <Box pr="8rem" marginTop="2rem">
      {loadingNotes ? (
        <LoadingScreen />
      ) : (
        <>
          {notes?.map((note: any) => {
            const { replies } = note;
            const editable = currentUserId === note.createdBy;
            return (
              <>
                <SimpleNote
                  onDelete={editable ? (idToDelete: number) => setNoteIdToDelete(idToDelete) : undefined}
                  key={note.id}
                  note={note}
                  currentNote={currentNote}
                  editable={editable}
                  canReply={true}
                  projectId={projectId}
                  setCurrentNote={setCurrentNote}
                />
                {(replies ?? []).map((replyNote: Note, i: number) => {
                  return (
                    <SimpleNote
                      isReply={true}
                      projectId={projectId}
                      onDelete={editable ? (idToDelete: number) => setNoteIdToDelete(idToDelete) : undefined}
                      key={replyNote.id}
                      currentNote={currentNote}
                      note={replyNote}
                      editable={currentUserId === replyNote.createdBy}
                      canReply={false}
                      setCurrentNote={setCurrentNote}
                    />
                  );
                })}
              </>
            );
          })}
          <Divider margin={'2rem 0 2rem 0'} />
          <ProjectNotesForm projectId={projectId} />
        </>
      )}
      <Dialog
        isOpen={!!noteIdToDelete}
        actions={
          <Box>
            <StimButton
              id="cancel-delete-note-000"
              size="stimSmall"
              variant="stimOutline"
              onClick={() => setNoteIdToDelete(null)}
            >
              {t('Cancel')}
            </StimButton>
            <StimButton
              id="confirm-delete-note-001"
              size="stimSmall"
              variant="stimDestructive"
              onClick={handleNoteDelete}
              ml={3}
            >
              {t('Delete')}
            </StimButton>
          </Box>
        }
        onClose={() => setNoteIdToDelete(null)}
      >
        <Text>{t('Are you sure you want to delete this note?')}</Text>
      </Dialog>
    </Box>
  );
};

export default ProjectNotesTab;
