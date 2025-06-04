import { useMutation } from '@apollo/client';
import { Box, Divider, Flex, Skeleton, Stack, Text } from '@chakra-ui/react';
import clsx from 'clsx';
import * as R from 'ramda';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useErrorTranslation, useStimulusToast, useUser } from '../../hooks';
import { notesMapper } from '../../utils/dataMapper';
import { styleNumberOfResults } from '../Company/commonStyles';
import CompanyNotesForm from '../CompanyNotesForm';
import GenericModal from '../GenericModal';
import SimpleNote, { NOTE_CATEGORY } from '../SimpleNote';

const { COMPANY_NOTES_GQL } = CompanyQueries;
const { UPDATE_COMPANY_NOTE_GQL, DELETE_COMPANY_NOTE_GQL } = CompanyMutations;

interface Note {
  id: number;
  body: string;
  createdBy: string;
  created: string;
}

interface CurrentNote {
  id: number;
  type: string;
}
interface CurrentAction {
  id: number | null;
  action: string | null;
}

const CompanyNotes = (props: { companyId: string; loading: boolean; data: any }) => {
  const { t } = useTranslation();
  const { companyId, loading, data } = props;
  const notes: any = !loading && notesMapper(data || []);
  const count = notes.length || 0;

  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const [noteIdToDelete, setNoteIdToDelete] = useState<any | null>(null);
  const [currentNote, setCurrentNote] = useState<CurrentNote | null>(null);
  const [currentAction, setCurrentAction] = useState<CurrentAction>({
    id: null,
    action: 'none',
  });

  const {
    user: { sub: currentUserId },
  } = useUser();

  const [updateNote] = useMutation(UPDATE_COMPANY_NOTE_GQL, {
    update: (_, { data: { updateCompanyNote: noteData } }) => {
      if (noteData?.error) {
        return enqueueSnackbar(errTranslations[noteData.code], { status: 'error' });
      }
      setCurrentAction({ id: null, action: 'none' });
      enqueueSnackbar(`Note edited`, { status: 'success' });
    },
  });

  const [deleteNote] = useMutation(DELETE_COMPANY_NOTE_GQL, {
    update: (cache, { data: { deleteCompanyNote } }) => {
      if (deleteCompanyNote?.error) {
        return enqueueSnackbar(errTranslations[deleteCompanyNote.code], { status: 'error' });
      } else if (deleteCompanyNote?.done) {
        const { companyNotes } = R.clone(cache.readQuery({ query: COMPANY_NOTES_GQL(companyId) })) as any;
        companyNotes.results = companyNotes.results.filter((note: any) => note.id !== noteIdToDelete.id);

        cache.writeQuery({
          query: COMPANY_NOTES_GQL(companyId),
          data: { companyNotes: { ...companyNotes } },
        });
        enqueueSnackbar(t('Note deleted!'), { status: 'success' });
      }

      setNoteIdToDelete(null);
    },
  });

  const handleNoteEdit = (id: number, body: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      updateNote({ variables: { id, body } })
        .then(() => resolve())
        .catch(() => reject());
    });
  };

  const getProjectNoteJsx = (note: Note, options?: { isReply?: boolean; isFirstReply?: boolean; isLast: boolean }) => {
    const editable = currentUserId === note.createdBy;
    const { isReply, isFirstReply, isLast } = options ?? {};
    const className = clsx(isReply ? 'replyNote' : '', isFirstReply ? 'replyNote__first' : '');
    const noteProps = {
      note,
      editable,
      className,
      ...(editable && { onSubmitEdit: handleNoteEdit, onDelete: (id: any) => setNoteIdToDelete(id) }),
    };

    return (
      <Box key={note.id}>
        <SimpleNote
          showTimeline={true}
          lastInTimeline={isLast}
          canReply={!isReply}
          {...noteProps}
          noteRelation={{ type: NOTE_CATEGORY.COMPANY, id: companyId }}
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          setCurrentAction={setCurrentAction}
        />
      </Box>
    );
  };

  const modalActions = [
    {
      label: 'Cancel',
      onClick: () => setNoteIdToDelete(null),
      color: 'primary',
    },
    {
      label: 'Delete',
      variant: 'contained',
      color: 'secondary',
      onClick: () => deleteNote({ variables: { id: noteIdToDelete.id } }),
    },
  ];
  const noteComponents = useMemo(
    () =>
      notes?.map?.((note: Note & { replies: Note[] }, i: number) => {
        const { replies } = note;
        const replyComponents = (replies ?? []).map((note, i) =>
          getProjectNoteJsx(note, {
            isReply: true,
            isFirstReply: i === 0,
            isLast: i === replies.length - 1,
          })
        );

        return (
          <Stack key={note.id}>
            {getProjectNoteJsx(note, { isLast: i === notes.length - 1 && !replyComponents.length })}
            <Stack p="20px 60px">{replyComponents}</Stack>
          </Stack>
        );
      }), // eslint-disable-next-line react-hooks/exhaustive-deps
    [notes]
  );

  return (
    <Flex className="container-notes" direction="column" alignContent="center" justifyContent="center">
      <Flex>
        <Text fontWeight={'bold'} variant="body" mr="5px" lineHeight={'18px'}>
          {t('All Comments')}
        </Text>
        <Flex sx={styleNumberOfResults} marginTop="-0.5%">
          <Text textAlign="center" lineHeight="22px" fontWeight="semibold" fontSize="12px">
            {count}
          </Text>
        </Flex>
      </Flex>
      <Divider />
      {loading ? (
        <SkeletonComment />
      ) : (
        <>
          {count === 0 ? (
            <>
              <Flex height="300px" my={5} justifyContent="center" alignItems={'center'} background="#F6F6F6">
                <p>No comments have been added to this company yet.</p>
              </Flex>
              {currentAction?.action === 'none' && (
                <CompanyNotesForm companyId={companyId} setCurrentAction={setCurrentAction} />
              )}
            </>
          ) : (
            <>
              <Box p="1" background="#F6F6F6" overflow="scroll" maxH="400px" my="5">
                {noteIdToDelete && (
                  <GenericModal
                    maxWidth="xs"
                    justifyActions="space-between"
                    onClose={() => setNoteIdToDelete(null)}
                    buttonActions={modalActions}
                  >
                    <Stack justifyContent="center">
                      <Box mt="10px">
                        <Text align="center">
                          {t(
                            noteIdToDelete.replies.length
                              ? 'Are you sure, you want to remove the current comment and all the nested comments?'
                              : 'Are you sure you want to delete this comment?'
                          )}
                        </Text>
                      </Box>
                      <Box mt="30px">
                        <Text mt="20px">{t('Once you press “Delete”, the information will be removed')}</Text>
                      </Box>
                    </Stack>
                  </GenericModal>
                )}
                {noteComponents}
              </Box>
              {currentAction?.action === 'none' && (
                <CompanyNotesForm companyId={companyId} setCurrentAction={setCurrentAction} />
              )}
            </>
          )}
        </>
      )}
    </Flex>
  );
};

const SkeletonComment = () => {
  return (
    <Flex direction="row" paddingY={5}>
      <Skeleton
        startColor="green.400"
        endColor="white.500"
        height="30px"
        width={'30px'}
        borderRadius={50}
        marginX={1}
      />
      <Skeleton startColor="green.400" endColor="white.500" height="80px" width={'250px'} borderRadius={'20px'} />
    </Flex>
  );
};

export default CompanyNotes;
