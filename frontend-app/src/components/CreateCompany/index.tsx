import React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useStyles from './style';
import { useForm } from 'react-hook-form';

interface CreateCompanyProps {
  companyNameHook: [string, (name: string) => void];
  departmentHook?: [string, (department: string) => void];
  einHook: [string, (ein: string) => void];
  dunsHook: [number, (duns: number) => void];
  next: () => void;
}

const CreateCompany = (props: CreateCompanyProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForm();

  const {
    einHook: [ein, setEin],
    dunsHook: [duns, setDuns],
    companyNameHook: [companyName, setCompanyName],
    next,
  } = props;

  return (
    <div className={classes.body} data-testid="create-company-component">
      <div className={classes.formWrapper}>
        <Typography className={classes.title} data-testid="page-create-company-title">
          {t('Create Company')}
        </Typography>
        <Typography className={classes.subtitle}>
          {t('Please fill out all the required. Any prefixed with * are optional.')}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(next)}>
          <div className={classes.formItem}>
            <label>
              <Typography className={classes.label}>{t('Company Name *')}</Typography>
              <TextField
                inputProps={{
                  'data-testid': 'company-name-field',
                  ref: register({ required: t('This is required') as string }),
                }}
                name="companyName"
                className={classes.input}
                fullWidth
                variant="outlined"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {errors.companyName && (
                <span data-testid="company-name-field-error" role="alert" className={classes.errorMessage}>
                  {errors.companyName.message}
                </span>
              )}
            </label>
          </div>
          <div className={classes.formItem}>
            <label>
              <Typography className={classes.label}>{t('EIN *')}</Typography>
              <TextField
                inputProps={{
                  'data-testid': 'ein-field',
                  ref: register({ required: t('This is required') as string }),
                }}
                name="ein"
                variant="outlined"
                className={classes.input}
                fullWidth
                value={ein || ''}
                onChange={(e) => setEin(e.target.value as string)}
              />
              {errors.ein && (
                <span data-testid="ein-field-error" role="alert" className={classes.errorMessage}>
                  {errors.ein.message}
                </span>
              )}
            </label>
          </div>
          <div className={classes.formItem}>
            <label>
              <Typography className={classes.label}>{t('DUNS *')}</Typography>
              <TextField
                inputProps={{
                  'data-testid': 'duns-field',
                  ref: register({ required: t('This is required') as string }),
                }}
                name="duns"
                className={classes.input}
                variant="outlined"
                fullWidth
                value={duns || ''}
                onChange={(e) => setDuns(parseInt(e.target.value as string, 10))}
              />
              {errors.duns && (
                <span data-testid="duns-field-error" role="alert" className={classes.errorMessage}>
                  {errors.duns.message}
                </span>
              )}
            </label>
          </div>
          <div className={classes.formItem}>
            <Button
              data-testid="submit-button"
              className={classes.button}
              fullWidth
              disableElevation
              variant="contained"
              color="primary"
              type="submit"
            >
              {t('CONTINUE')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompany;
