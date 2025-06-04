import { useMutation } from '@apollo/client';
import { Grid, TextField } from '@material-ui/core';
import * as R from 'ramda';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import CompanyQueries from '../../graphql/Queries/CompanyQueries';
import { useStimulusToast, useUser } from '../../hooks';
import useStyles from './style';

const { COMPANY_EVALUATION_NOTES_GQL } = CompanyQueries;
const { CREATE_COMPANY_EVALUATION_NOTE_GQL } = CompanyMutations;

const CompanyEvaluationNotesForm = (props: {
  companyEvaluationId: number;
  parentNoteId?: number;
  onClose?: () => void;
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { companyEvaluationId, parentNoteId, onClose } = props;
  const { enqueueSnackbar } = useStimulusToast();
  const { register, handleSubmit, errors } = useForm();
  const [noteBody, setNoteBody] = useState('');
  const {
    user: { sub: userId },
  } = useUser();

  const [saveNote] = useMutation(CREATE_COMPANY_EVALUATION_NOTE_GQL, {
    update: (cache, { data: { createCompanyEvaluationNote: noteData } }) => {
      const { companyEvaluationNotes } = R.clone(
        cache.readQuery({ query: COMPANY_EVALUATION_NOTES_GQL(companyEvaluationId) })
      ) as any;
      const oldNotes = companyEvaluationNotes?.results || [];
      companyEvaluationNotes.results = [...oldNotes, noteData];
      companyEvaluationNotes.count = (companyEvaluationNotes?.count ?? 0) + 1;

      cache.writeQuery({
        query: COMPANY_EVALUATION_NOTES_GQL(companyEvaluationId),
        data: { companyEvaluationNotes: { ...companyEvaluationNotes } },
      });
      setNoteBody('');

      if (typeof onClose !== 'undefined') {
        onClose();
      }
    },
  });

  const handleSaveNote = () => {
    saveNote({
      refetchQueries: [],
      variables: { companyEvaluationId, body: noteBody, ...(parentNoteId && { parentNoteId }) },
      optimisticResponse: {
        createCompanyEvaluationNote: {
          __typename: 'CompanyEvaluationNote',
          id: null,
          created: null,
          body: noteBody,
          createdBy: userId,
          parentNote: parentNoteId || null,
        },
      },
    }).then(() => enqueueSnackbar(`Note added`, { status: 'success' }));
  };

  return (
    <Grid container spacing={0} className={classes.root} data-testid="companyEvaluationNotesForm">
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(handleSaveNote)}>
          <TextField
            onKeyDown={(e) => onClose && ['Esc', 'Escape'].indexOf(e.key) > -1 && onClose()}
            inputProps={{
              ref: register({ required: t('Type something before submitting') as string }),
            }}
            placeholder={t('Add a note')}
            name="noteBody"
            className={classes.input}
            variant="outlined"
            fullWidth
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
          />
          {errors.noteBody && (
            <span role="alert" className={classes.errorMessage}>
              {errors.noteBody.message}
            </span>
          )}
        </form>
      </Grid>
    </Grid>
  );
};

export default CompanyEvaluationNotesForm;
