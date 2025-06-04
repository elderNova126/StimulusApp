import { useMutation } from '@apollo/client';
import DateFnsUtils from '@date-io/date-fns';
import { Box, Grid, Paper, Popper, Typography } from '@material-ui/core';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import FastForwardIcon from '@material-ui/icons/FastForward';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import moment from 'moment';
import * as R from 'ramda';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectStatus, ProjectType } from '../../graphql/enums';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import { projectStatusMapper } from '../../utils/dataMapper';
import { getLocaleDateFormat } from '../../utils/date';
import { ProjectLink } from '../EntityLink/index';
import GenericModal from '../GenericModal';
import useStyles from './style';

const { AVAILABLE_PROJECTS_GQL } = ProjectQueries;
const { UPDATE_PROJECT_STATUS, UPDATE_PROJECT_ONGOING, CANCEL_PROJECT_GQL } = ProjectMutations;

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 7.5,
  },
  line: {
    height: 1,
    border: 0,
    backgroundColor: '#96C195',
    borderRadius: 1,
    width: '100%',
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      zIndex: 1,
      color: '#fff',
      minWidth: 15,
      minHeight: 15,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      backgroundColor: '#50B1BB',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      width: 19,
      height: 19,
    },
    completed: {
      backgroundColor: '#52AE6A',
      borderRadius: '50%',
      width: 19,
      height: 19,
    },
    circle: {
      backgroundColor: 'transparent',
      borderRadius: '50%',
      border: '1px solid #96C195',
    },
  })
);

const ActiveStepIcon = (props: { project: any }) => {
  const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [blockedPopover, setBlockedPopover] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { project } = props;
  const statuses = Object.keys(ProjectStatus);
  const currentStatusIndex = statuses.indexOf(project.status);
  const nextStatus = statuses[currentStatusIndex + 1];
  const defaultStatusDate =
    nextStatus === ProjectStatus.INPROGRESS ? project.expectedStartDate : project.expectedEndDate;
  const [statusDate, setStatusDate] = useState(defaultStatusDate ?? moment.utc().toString());
  const [cancelProjectModalOpen, setCancelProjectModalOpen] = useState(false);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslation = useErrorTranslation();
  const { t } = useTranslation();
  const classes = useStyles();

  const [updateProjectOngoing] = useMutation(UPDATE_PROJECT_ONGOING, {
    update: (_, { data: { updateProject } }) => {
      if (!updateProject.error) {
        const message = (
          <span>
            <ProjectLink id={project.id} name={project.title} />
            {t(' is ')}
            {updateProject.ongoing ? t('on going') : t('on hold')}
          </span>
        );
        enqueueSnackbar(message, { status: 'success' });
      }
      setAnchorEl(null);
    },
  });
  const [updateProjectStatus, { client }] = useMutation(UPDATE_PROJECT_STATUS, {
    update: (cache: any, { data: { updateProject } }: any) => {
      if (updateProject.error) {
        let message = t(`There was an error. Please try again`);
        if (updateProject.code === 14) {
          if (!project.ongoing) {
            message = t(`Project is on hold! You need to resume project to make any change!`);
          } else if (project.status === ProjectStatus.CANCELED) {
            message = t(`Project is canceled! You cannot change a canceled project`);
          } else if (project.type !== ProjectType.OFFICIAL) {
            message = t(`Unofficial projects cannot be completed. Make this project official before continue!`);
          }
        }
        return enqueueSnackbar(message, { status: 'error' });
      }

      if (updateProject.status === ProjectStatus.COMPLETED) {
        client.resetStore(); // reset the store for updating no of projects on awarded company profiles
      }

      const message = (
        <span>
          {t('Status updated for ')}
          <ProjectLink id={project.id} name={project.title} />
          {t(' to ')}
          {projectStatusMapper[nextStatus]}
        </span>
      );
      enqueueSnackbar(message, { status: 'success' });

      if (ProjectStatus.INPROGRESS === updateProject.status) {
        const { searchProjects } = R.clone(cache.readQuery({ query: AVAILABLE_PROJECTS_GQL() })) as any;

        searchProjects.results = searchProjects?.results?.filter?.((project: any) => project.id !== updateProject.id);

        cache.writeQuery({
          query: AVAILABLE_PROJECTS_GQL(),
          data: { searchProjects: { ...searchProjects } },
        });
      }
    },
  });

  const [cancelProject] = useMutation(CANCEL_PROJECT_GQL, {
    update: (cache, { data: { cancelProject } }) => {
      if (cancelProject.error) {
        let message;
        if (cancelProject.code === 14) {
          if (!project.ongoing) {
            message = `Project is on hold! You need to resume project to make any change!`;
          } else if (project.status === ProjectStatus.CANCELED) {
            message = `Project is canceled! You cannot change a canceled project`;
          }
        }
        enqueueSnackbar(message ?? errTranslation[cancelProject.code], { status: 'error' });
      } else {
        const { searchProjects } = R.clone(cache.readQuery({ query: AVAILABLE_PROJECTS_GQL() })) as any;

        searchProjects.results = searchProjects?.results?.filter?.((project: any) => project.id !== cancelProject.id);

        cache.writeQuery({
          query: AVAILABLE_PROJECTS_GQL(),
          data: { searchProjects: { ...searchProjects } },
        });

        enqueueSnackbar(`Project canceled`, { status: 'success' });
      }
    },
  });

  useEffect(() => {
    if (!blockedPopover) {
      setAnchorEl(null);
    }
  }, [blockedPopover, setAnchorEl]);

  const handleClosePopover = (force: boolean) => {
    if (!blockedPopover) {
      setAnchorEl(null);
    } else if (force) {
      setBlockedPopover(false);
      setAnchorEl(null);
    }
  };

  const handleOpenPopover = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const profileOptionsOpen = Boolean(anchorEl);

  const handleChangeStatus = () => {
    let dateKey = null;

    if (nextStatus === ProjectStatus.INPROGRESS) {
      dateKey = 'startDate';
    } else if (nextStatus === ProjectStatus.COMPLETED) {
      dateKey = 'endDate';
    }

    setStatusModalOpen(false);

    updateProjectStatus({
      variables: { id: project.id, status: nextStatus, ...(dateKey && { [dateKey]: statusDate }) },
    });
  };

  const modalActions = [
    { label: t('Cancel'), onClick: () => setStatusModalOpen(false), color: 'primary', testid: 'cancel-button' },
    {
      label: t('Confirm'),
      variant: 'contained',
      onClick: handleChangeStatus,
      color: 'secondary',
      testid: 'confirm-button',
    },
  ];

  let changeStatusModalContent = null;
  switch (nextStatus) {
    case ProjectStatus.OPEN:
      changeStatusModalContent = (
        <Typography className={classes.warningText}>
          {t('You are about to change status to ')}
          <span className={classes.secondary}>{t('Open')}</span>
          {t('. This operation cannot be reverted. Are you sure?')}
        </Typography>
      );
      break;
    case ProjectStatus.INREVIEW:
      changeStatusModalContent = (
        <Typography className={classes.warningText}>
          {t('You are about to change status to ')}
          <span className={classes.secondary}>{t('Review')}</span>
          {t('. This operation cannot be reverted. Are you sure?')}
        </Typography>
      );
      break;
    case ProjectStatus.INPROGRESS:
    case ProjectStatus.COMPLETED:
      changeStatusModalContent = (
        <Paper elevation={0}>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography className={classes.modalText}>
                {t('Set ')}
                {nextStatus === ProjectStatus.INPROGRESS ? t('start date') : t('end date')}
              </Typography>
            </Grid>
            {nextStatus === ProjectStatus.COMPLETED && (
              <Grid item xs={12}>
                <Typography color="secondary" className={classes.warningText}>
                  {t(
                    'Are you sure you want to move the status to ‘Completed’? Once it is completed, the project cannot be edited'
                  )}
                </Typography>
              </Grid>
            )}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk
                margin="normal"
                label={nextStatus === ProjectStatus.INPROGRESS ? t('Start date') : t('End date')}
                format={getLocaleDateFormat()}
                value={statusDate}
                required
                onChange={(date: Date | null) => {
                  setStatusDate(moment(date));
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Paper>
      );
      break;
    default:
      break;
  }

  const handleChangeStatusOnClick = () => {
    if (
      nextStatus === ProjectStatus.INREVIEW &&
      project?.projectCompany?.length < 2 // when only the client company is linked to this project (without collaboration)
    ) {
      // validation for starting project
      const message = t(`You need to have at least one company linked to this project to move to the next stage`);
      return enqueueSnackbar(message, { status: 'warning' }); // return and stop the action
    } else if (
      nextStatus === ProjectStatus.INPROGRESS &&
      !project.projectCompany.filter((relation: any) => relation.type === 'AWARDED').length
    ) {
      const message = t(`You need to have at least one company awarded to this project to move to the next stage`);
      return enqueueSnackbar(message, { status: 'warning' }); // return and stop the action
    }
    setStatusModalOpen(true);
  };

  const handleChangeOnGoing = () => {
    updateProjectOngoing({ variables: { id: project.id, ongoing: !project.ongoing } });
  };
  const ActiveIcon = project.ongoing ? PlayArrowIcon : PauseIcon;

  const cancelModalActions = [
    {
      label: 'Go  Back',
      className: clsx(classes.backAction, classes.modalAction),
      onClick: () => setCancelProjectModalOpen(false),
      color: 'primary',
    },
    {
      label: 'Cancel Project',
      className: clsx(classes.modalAction, classes.cancelAction),
      variant: 'contained',
      color: 'secondary',
      onClick: () => {
        setCancelProjectModalOpen(false);
        cancelProject({ variables: { id: project.id } });
      },
    },
  ];

  return (
    <div>
      <ActiveIcon
        onClick={() => setBlockedPopover(!blockedPopover)}
        onMouseEnter={handleOpenPopover}
        onMouseLeave={() => handleClosePopover(false)}
        className={classes.activeStepIcon}
      />
      {project.status !== ProjectStatus.COMPLETED && (
        <Popper
          placement="bottom"
          open={profileOptionsOpen}
          anchorEl={anchorEl}
          className={classes.popper}
          modifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: 'window',
            },
            arrow: {
              enabled: true,
              element: arrowRef,
            },
          }}
        >
          <Paper className={classes.popoverRoot}>
            <span className={classes.arrow} ref={setArrowRef} />
            <Box>
              {nextStatus && (
                <div className={classes.popupItem}>
                  <div className={classes.popupItemHeader}>
                    <Typography color="textSecondary" className={classes.changeStatusLabel} variant="body1">
                      {t('move to next stage')}
                    </Typography>
                  </div>
                  <div
                    className={clsx(classes.popupItemHeader, classes.actionItem)}
                    onClick={handleChangeStatusOnClick}
                  >
                    <FastForwardIcon className={clsx(classes.icon, classes.forwardIcon)} />
                    <Typography
                      color="primary"
                      className={classes.popupItemHeaderName}
                      data-testid="change-to-next-status"
                    >
                      {projectStatusMapper[nextStatus]}
                    </Typography>
                  </div>
                </div>
              )}
              <div className={classes.popupItem}>
                <div className={clsx(classes.popupItemHeader, classes.actionItem)} onClick={handleChangeOnGoing}>
                  {project.ongoing ? (
                    <>
                      <PauseIcon className={classes.icon} />
                      <Typography className={classes.popupItemHeaderName}>{t('Pause')}</Typography>
                    </>
                  ) : (
                    <>
                      <PlayArrowIcon className={clsx(classes.icon, classes.playIcon)} />
                      <Typography className={classes.popupItemHeaderName}>{t('Resume')}</Typography>
                    </>
                  )}
                </div>
                <div
                  className={clsx(classes.popupItemHeader, classes.actionItem)}
                  onClick={() => setCancelProjectModalOpen(true)}
                >
                  <StopIcon color="secondary" className={classes.icon} />
                  <Typography color="secondary" className={classes.popupItemHeaderName}>
                    {t('Cancel')}
                  </Typography>
                </div>
              </div>
            </Box>
          </Paper>
        </Popper>
      )}
      {statusModalOpen && (
        <GenericModal
          maxWidth="xs"
          onClose={() => setStatusModalOpen(false)}
          buttonActions={modalActions}
          justifyActions="space-between"
        >
          {changeStatusModalContent}
        </GenericModal>
      )}
      {cancelProjectModalOpen && (
        <GenericModal
          maxWidth="xs"
          onClose={() => setCancelProjectModalOpen(false)}
          buttonActions={cancelModalActions}
          justifyActions="space-between"
        >
          <div>
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <Typography align="center" className={classes.modalTitle}>
                  {t('Are You Sure You Wish to Cancel?')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.modalSubtitle}>
                  {t('Once you press “Cancel Project”, you cannot change the project anymore.')}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </GenericModal>
      )}
    </div>
  );
};

function ColorlibStepIcon(props: any) {
  const classes = useColorlibStepIconStyles();
  const { active, completed, project } = props;

  const icon = completed ? (
    <Check className={classes.completed} />
  ) : active ? (
    <ActiveStepIcon project={project} />
  ) : null;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.circle]: !active && !completed,
      })}
    >
      {icon}
    </div>
  );
}

export default function ProjectStepper(props: { project: any; steps: any[]; activeStep: number }) {
  const { steps, activeStep, project } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stepper className={classes.stepper} alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              StepIconProps={{ project } as any}
              data-testid={`project-step-${index}`}
            >
              <Typography color={index <= activeStep ? 'primary' : 'inherit'}>{projectStatusMapper[label]}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
