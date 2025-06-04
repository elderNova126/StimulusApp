import { useMutation, useQuery } from '@apollo/client';
import { Box, CircularProgress, Stack, Text } from '@chakra-ui/react';
import clsx from 'clsx';
import * as R from 'ramda';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useErrorTranslation, useStimulusToast, useUser } from '../../hooks';
import { notesMapper } from '../../utils/dataMapper';
import CompanyEvaluationNotesForm from '../CompanyEvaluationNotesForm';
import GenericModal from '../GenericModal/index';
import SimpleNote, { NOTE_CATEGORY } from '../SimpleNote';
import useStyles from './style';

const { COMPANY_EVALUATION_NOTES_GQL } = CompanyQueries;
const { UPDATE_COMPANY_EVALUATION_NOTE_GQL, DELETE_COMPANY_EVALUATION_NOTE_GQL } = CompanyMutations;

interface Note {
  id: number;
  body: string;
  createdBy: string;
  created: string;
  parentNote: number;
}

interface CurrentNote {
  id: number;
  type: string;
}

const CompanyEvaluationNotes = (props: { companyEvaluationId: number }) => {
  const { companyEvaluationId } = props;
  const { loading, data } = useQuery(COMPANY_EVALUATION_NOTES_GQL(companyEvaluationId), { fetchPolicy: 'cache-first' });
  const notes: any = !loading && notesMapper(data?.companyEvaluationNotes?.results || []);
  const { enqueueSnackbar } = useStimulusToast();
  const [noteIdToDelete, setNoteIdToDelete] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<CurrentNote | null>(null);
  const [currentAction, setCurrentAction] = useState<CurrentNote | null>(null);
  const classes = useStyles();
  const { t } = useTranslation();
  const errTranslations = useErrorTranslation();
  const {
    user: { sub: currentUserId },
  } = useUser();

  const [deleteNote] = useMutation(DELETE_COMPANY_EVALUATION_NOTE_GQL, {
    update: (cache, { data: { deleteCompanyEvaluationNote } }) => {
      if (deleteCompanyEvaluationNote?.done) {
        const { companyEvaluationNotes } = R.clone(
          cache.readQuery({ query: COMPANY_EVALUATION_NOTES_GQL(companyEvaluationId) })
        ) as any;
        companyEvaluationNotes.results = companyEvaluationNotes.results.filter((note: any) => {
          return note.id !== noteIdToDelete;
        });
        companyEvaluationNotes.count = (companyEvaluationNotes?.count ?? 1) - 1;
        cache.writeQuery({
          query: COMPANY_EVALUATION_NOTES_GQL(companyEvaluationId),
          data: { companyEvaluationNotes: { ...companyEvaluationNotes } },
        });
      }
      setNoteIdToDelete(null);
    },
  });

  const [updateNote] = useMutation(UPDATE_COMPANY_EVALUATION_NOTE_GQL);

  const handleNoteEdit = (id: number, body: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      updateNote({
        variables: { id, body },
        optimisticResponse: {
          updateProjectNote: {
            __typename: 'CompanyEvaluationNote',
            id,
            body,
          },
        },
      })
        .then(({ data: { updateProjectNote: noteData } }) => {
          if (noteData?.error) {
            return enqueueSnackbar(errTranslations[noteData.code], { status: 'error' });
          }
          enqueueSnackbar(`Note edited`, { status: 'success' });
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const handleNoteDelete = () => {
    deleteNote({
      variables: { id: noteIdToDelete },
      optimisticResponse: {
        deleteProjectNote: {
          done: true,
          __typename: 'BaseResponse',
        },
      },
    }).then(({ data: { deleteCompanyNote } }) => {
      if (deleteCompanyNote?.error) {
        return enqueueSnackbar(errTranslations[deleteCompanyNote.code], { status: 'error' });
      }
      enqueueSnackbar(t('Note deleted!'), { status: 'success' });
    });
  };

  const modalActions = [
    {
      label: 'Cancel',
      className: clsx(classes.backAction, classes.modalAction),
      onClick: () => setNoteIdToDelete(null),
      color: 'primary',
    },
    {
      label: 'Delete',
      className: clsx(classes.modalAction, classes.cancelAction),
      variant: 'contained',
      color: 'secondary',
      onClick: handleNoteDelete,
    },
  ];

  const getProjectNoteJsx = useMemo(
    () => (note: Note, options?: { isReply?: boolean; isFirstReply?: boolean; isLast: boolean }) => {
      const editable = currentUserId === note.createdBy;
      const { isReply, isFirstReply, isLast } = options ?? {};
      const className = clsx(isReply ? 'replyNote' : '', isFirstReply ? 'replyNote__first' : '');
      const noteProps = {
        note,
        editable,
        className,
        ...(editable && { onSubmitEdit: handleNoteEdit, onDelete: (id: Note) => setNoteIdToDelete(id.id) }),
      };

      return (
        <Box key={note.id}>
          <SimpleNote
            showTimeline={true}
            lastInTimeline={isLast}
            canReply={!isReply}
            {...noteProps}
            noteRelation={{ type: NOTE_CATEGORY.COMPANY_EVALUATION, id: companyEvaluationId }}
            currentNote={currentNote}
            currentAction={currentAction}
            setCurrentNote={setCurrentNote}
            setCurrentAction={setCurrentAction}
          />
        </Box>
      );
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyEvaluationId, currentUserId, currentNote]
  );

  const notesComponents = useMemo(() => {
    return notes?.map?.((note: Note & { replies: Note[] }, i: number) => {
      const { replies } = note;
      const replyComponents = (replies ?? []).map((note, i) =>
        getProjectNoteJsx(note, {
          isReply: true,
          isFirstReply: i === 0,
          isLast: i === replies.length - 1,
        })
      );
      return (
        <Box key={note.id}>
          {getProjectNoteJsx(note, { isLast: i === notes.length - 1 && !replyComponents.length })}
          {replyComponents}
        </Box>
      );
    });
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box data-testid="companyEvaluation">
      <Stack alignContent="center" justifyContent="center">
        {loading ? (
          <CircularProgress color="green.200" isIndeterminate />
        ) : (
          <>
            <Box>
              {noteIdToDelete && (
                <GenericModal
                  maxWidth="xs"
                  justifyActions="space-between"
                  onClose={() => setNoteIdToDelete(null)}
                  buttonActions={modalActions}
                >
                  <div>
                    <Stack justifyContent="center">
                      <Box>
                        <Text align="center">{t('Are You Sure You Wish to Delete?')}</Text>
                      </Box>
                      <Box>
                        <Text>{t('Once you press “Delete”, the information will be removed')}</Text>
                      </Box>
                    </Stack>
                  </div>
                </GenericModal>
              )}
              {notesComponents}
              <CompanyEvaluationNotesForm companyEvaluationId={companyEvaluationId} />
            </Box>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CompanyEvaluationNotes;
