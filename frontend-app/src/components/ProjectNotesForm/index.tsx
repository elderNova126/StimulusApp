import { useMutation } from '@apollo/client';
import { Grid, TextField } from '@material-ui/core';
import * as R from 'ramda';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useStimulusToast, useUser } from '../../hooks';
import useStyles from './style';

const { PROJECT_NOTES_GQL } = ProjectQueries;
const { CREATE_PROJECT_NOTE_GQL } = ProjectMutations;

const ProjectNotesForm = (props: { projectId: number; parentNoteId?: number; onClose?: () => void }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { projectId, parentNoteId, onClose } = props;
  const { enqueueSnackbar } = useStimulusToast();
  const { register, handleSubmit, errors } = useForm();
  const [noteBody, setNoteBody] = useState('');
  const {
    user: { sub: userId },
  } = useUser();

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
      setNoteBody('');

      if (typeof onClose !== 'undefined') {
        onClose();
      }
    },
  });

  const handleSaveNote = () => {
    saveNote({
      variables: { projectId, body: noteBody, ...(parentNoteId && { parentNoteId }) },
      optimisticResponse: {
        createProjectNote: {
          __typename: 'ProjectNote',
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
    <Grid container spacing={0} className={classes.root} data-testid="projectNotesForm">
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(handleSaveNote)}>
          <TextField
            onKeyDown={(e) => onClose && ['Esc', 'Escape'].indexOf(e.key) > -1 && onClose()}
            inputProps={{
              ref: register({ required: t('Type something before submitting') as string }),
            }}
            placeholder={t('Comment')}
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

export default ProjectNotesForm;
