import { useMutation } from '@apollo/client';
import { Input, Stack, Text } from '@chakra-ui/react';
import * as R from 'ramda';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useStimulusToast, useUser } from '../../hooks';
import useStyles from './style';
import StimButton from '../ReusableComponents/Button';
const { COMPANY_NOTES_GQL } = CompanyQueries;
const { CREATE_COMPANY_NOTE_GQL } = CompanyMutations;

const CompanyNotesForm = (props: {
  companyId: string;
  parentNoteId?: number;
  onClose?: () => void;
  setCurrentAction: (data: any) => void;
}) => {
  const { t } = useTranslation();
  const { companyId, parentNoteId, onClose, setCurrentAction } = props;
  const [noteBody, setNoteBody] = useState('');
  const { enqueueSnackbar } = useStimulusToast();
  const { register, handleSubmit, errors } = useForm();
  const {
    user: { sub: userId },
  } = useUser();
  const classes = useStyles();

  const [saveNote] = useMutation(CREATE_COMPANY_NOTE_GQL, {
    update: (cache, { data: { createCompanyNote: noteData } }) => {
      const { companyNotes } = R.clone(cache.readQuery({ query: COMPANY_NOTES_GQL(companyId) })) as any;

      companyNotes.results = [...(companyNotes?.results || []), noteData];
      companyNotes.count = (companyNotes?.count ?? 0) + 1;

      cache.writeQuery({
        query: COMPANY_NOTES_GQL(companyId),
        data: { companyNotes: { ...companyNotes } },
      });

      setNoteBody('');

      if (typeof onClose !== 'undefined') {
        onClose();
      }
    },
  });

  const handleSaveNote = () => {
    if (noteBody.length > 0) {
      saveNote({
        variables: { companyId, body: noteBody, ...(parentNoteId && { parentNoteId }) },
        optimisticResponse: {
          createCompanyNote: {
            __typename: 'CompanyNote',
            id: null,
            created: null,
            body: noteBody,
            createdBy: userId,
            parentNote: parentNoteId || null,
          },
        },
      })
        .then(() => enqueueSnackbar(`Note added`, { status: 'success' }))
        .catch(() => enqueueSnackbar(`Error adding note`, { status: 'error' }));
      setCurrentAction({ action: 'none', id: null });
    } else {
      enqueueSnackbar(`Empty field`, { status: 'error' });
    }
  };
  const closeOnEscape = (e: any) => {
    if (onClose && ['Escape'].indexOf(e.key) > -1) {
      onClose();
      setCurrentAction({ action: 'none', id: null });
    }
  };
  return (
    <Stack className={classes.formContainer} spacing={0} isInline>
      <form className={classes.form} onSubmit={handleSubmit(handleSaveNote)} data-testid="note-form">
        <Input
          autoFocus
          onKeyDown={closeOnEscape}
          ref={register({ required: t('Type something before submitting') as string })}
          placeholder={parentNoteId ? t('Reply here') : t('Type your comments about this company here')}
          name="noteBody"
          variant="outlined"
          isFullWidth
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
        />
        {errors.noteBody && (
          <Text color="red" role="alert">
            {errors.noteBody.message}
          </Text>
        )}
      </form>
      <StimButton
        onClick={handleSubmit(handleSaveNote)}
        size="stimSmall"
        isDisabled={noteBody.length === 0 ? true : false}
      >
        Send
      </StimButton>
    </Stack>
  );
};

export default CompanyNotesForm;
