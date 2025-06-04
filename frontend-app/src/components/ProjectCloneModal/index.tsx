import { useMutation } from '@apollo/client';
import { Checkbox, Divider, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@material-ui/core';
import { navigate } from '@reach/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import GenericModal from '../GenericModal/index';
import useStyles from './style';

export enum CloneType {
  REGULAR = 'REGULAR',
  SUBPROJECT = 'SUBPROJECT',
  CONTINUATION = 'CONTINUATION',
}

const { CLONE_PROJECT } = ProjectMutations;

export default function ProjectCloneModal(props: { project: any; onClose: () => void }) {
  const [includeDescription, setIncludeDescription] = useState(true);
  const [includeSuppliers, setIncludeSuppliers] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const { onClose, project } = props;
  const [title, setTitle] = useState(project.title);
  const { register, handleSubmit, errors } = useForm();
  const errTranslations = useErrorTranslation();
  const { t } = useTranslation();
  const classes = useStyles();
  const [relation, setRelation] = useState(CloneType.REGULAR);
  const { enqueueSnackbar } = useStimulusToast();

  const [cloneProject] = useMutation(CLONE_PROJECT, {
    update: (cache, { data: { cloneProject: projectData } }) => {
      if (projectData?.error) {
        return enqueueSnackbar(errTranslations[projectData.code], { status: 'error' });
      }

      navigate(`/project/${projectData.id}`);
      onClose();
    },
  });

  const handleCloneProject = () => {
    cloneProject({
      variables: {
        id: project.id,
        title,
        relation,
        includeDescription,
        includeSuppliers,
        includeNotes,
      },
    });
  };

  const modalActions = [
    { label: t('Cancel'), onClick: onClose, className: classes.cancelBtn },
    { label: t('Save'), onClick: handleSubmit(handleCloneProject), className: classes.saveBtn, variant: 'contained' },
  ];

  return (
    <div>
      <GenericModal maxWidth="xs" justifyActions="space-between" onClose={onClose} buttonActions={modalActions}>
        <Grid style={{ maxWidth: '35vw' }} data-testid="projectCloneModal">
          <form onSubmit={handleSubmit(handleCloneProject)}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" className={classes.title}>
                  {t('Clone Project')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <label>
                  <Typography className={classes.label}>{t('Name *')}</Typography>
                  <TextField
                    inputProps={{
                      'data-testid': 'title-field',
                      ref: register({ required: t('This is required') as string }),
                    }}
                    className={classes.input}
                    variant="outlined"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                  />
                  {errors.title && (
                    <span data-testid="title-field-errors" role="alert" className={classes.errorMessage}>
                      {errors.title.message}
                    </span>
                  )}
                </label>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.label}>{t('Include')}</Typography>

                <FormGroup className={classes.formGroup}>
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox
                        checked={includeDescription}
                        onChange={(e) => setIncludeDescription(e.target.checked)}
                      />
                    }
                    label="Description"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={
                      <Checkbox checked={includeSuppliers} onChange={(e) => setIncludeSuppliers(e.target.checked)} />
                    }
                    label="Suppliers"
                  />
                  <FormControlLabel
                    className={classes.formControlLabel}
                    control={<Checkbox checked={includeNotes} onChange={(e) => setIncludeNotes(e.target.checked)} />}
                    label="Notes"
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <FormGroup className={classes.formGroup}>
                  {!project.isContinuedByProject && (
                    <FormControlLabel
                      className={classes.formControlLabel}
                      control={
                        <Checkbox
                          checked={relation === CloneType.CONTINUATION}
                          onChange={(e) => setRelation(e.target.checked ? CloneType.CONTINUATION : CloneType.REGULAR)}
                        />
                      }
                      label={t('As a continuation')}
                    />
                  )}
                </FormGroup>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </GenericModal>
    </div>
  );
}
