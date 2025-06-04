import { useMutation } from '@apollo/client';
import { CheckCircleIcon, Icon } from '@chakra-ui/icons';
import { Box, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger, Spinner, Text } from '@chakra-ui/react';
import * as R from 'ramda';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePauseCircle } from 'react-icons/ai';
import { BiCalendarEvent } from 'react-icons/bi';
import { MdPlayCircleOutline } from 'react-icons/md';
import { PartialProject } from '../../graphql/dto.interface';
import { ProjectStatus, ProjectType } from '../../graphql/enums';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import { CustomDatePicker, Dialog } from '../GenericComponents';
import ArchiveProjectModal from '../ProjectOptions/ArchiveProjectModal';
import { projectStatusMapper } from './ProjectStepper';
import StimButton from '../ReusableComponents/Button';

const BUTTON_STYLE = 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.375) 0.03%, rgba(146, 214, 193, 0.375) 99.97%)';

interface Props {
  project: PartialProject;
  evaluations: boolean;
}

const { UPDATE_PROJECT_STATUS, CANCEL_PROJECT_GQL, UPDATE_PROJECT_ONGOING } = ProjectMutations;
const { AVAILABLE_PROJECTS_GQL } = ProjectQueries;

const ActiveStep: FC<Props> = ({ project, evaluations }) => {
  const { t } = useTranslation();
  const errTranslation = useErrorTranslation();
  const { enqueueSnackbar } = useStimulusToast();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const statuses = Object.keys(ProjectStatus);
  const currentStatusIndex = statuses.indexOf(project.status);
  const nextStatus = statuses[currentStatusIndex + 1];
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchivedModalOpen] = useState<boolean>(false);
  const defaultStatusDate =
    nextStatus === ProjectStatus.INPROGRESS ? project.expectedStartDate : project.expectedEndDate;
  const [statusDate, setStatusDate] = useState<Date | undefined>(
    defaultStatusDate ? new Date(defaultStatusDate) : undefined
  );
  const [cancelProjectModalOpen, setCancelProjectModalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const handleChangeStatusOnClick = () => {
    if (nextStatus === ProjectStatus.INREVIEW && project?.projectCompany?.length < 2) {
      // when only the client company is linked to this project (without collaboration)
      // validation for starting project
      const message = t(`You need to have at least one company linked to this project to move to the next stage`);
      return enqueueSnackbar(message, { status: 'warning' }); // return and stop the action
    } else if (
      nextStatus === ProjectStatus.INPROGRESS &&
      !project.projectCompany.filter((relation: any) => relation.type === 'AWARDED').length
    ) {
      const message = t(`You need to have at least one company awarded to this project to move to the next stage`);
      return enqueueSnackbar(message, { status: 'warning' }); // return and stop the action
    } else if (nextStatus === ProjectStatus.COMPLETED && evaluations === false) {
      const message = t(`You need to complete the evaluation to move to the next stage`);
      return enqueueSnackbar(message, { status: 'warning' });
    }
    setStatusModalOpen(true);
  };

  const [updateProjectStatus, { loading: updatingStatus, client }] = useMutation(UPDATE_PROJECT_STATUS, {
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

      enqueueSnackbar(t('Status updated'), { status: 'success' });

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

  const [cancelProject, { loading: loadingCancelProject }] = useMutation(CANCEL_PROJECT_GQL, {
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

  const [updateProjectOngoing, { loading: loadingUpdateProjectOngoing }] = useMutation(UPDATE_PROJECT_ONGOING, {
    update: (_, { data: { updateProject } }) => {
      if (!updateProject.error) {
        enqueueSnackbar(t(`Project ${project.title} is ${updateProject.ongoing ? 'on going' : 'on hold'}`), {
          status: 'success',
        });
      }
    },
  });

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

  const handleChangeOnGoing = () => {
    setIsPopoverOpen(false);
    updateProjectOngoing({ variables: { id: project.id, ongoing: !project.ongoing } });
  };

  const modalActions = (
    <>
      <StimButton size="stimSmall" variant="stimOutline" onClick={() => setStatusModalOpen(false)}>
        {t('Cancel')}
      </StimButton>
      <StimButton size="stimSmall" variant="stimDestructive" onClick={handleChangeStatus} ml={3}>
        {t('Confirm')}
      </StimButton>
    </>
  );

  const cancelProjectModalActions = (
    <>
      <StimButton size="stimSmall" variant="stimOutline" onClick={() => setCancelProjectModalOpen(false)}>
        {t('Go Back')}
      </StimButton>
      <StimButton
        size="stimSmall"
        variant="stimDestructive"
        onClick={() => {
          setCancelProjectModalOpen(false);
          cancelProject({ variables: { id: project.id } });
        }}
        ml={3}
      >
        {t('Cancel Project')}
      </StimButton>
    </>
  );

  let changeStatusModalContent = null;
  switch (nextStatus) {
    case ProjectStatus.OPEN:
      changeStatusModalContent = (
        <Box>
          {t('You are about to change status to ')}
          <span>{t('Open')}</span>
          {t('. This operation cannot be reverted. Are you sure?')}
        </Box>
      );
      break;
    case ProjectStatus.INREVIEW:
      changeStatusModalContent = (
        <Box>
          {t('You are about to change status to ')}
          <span>{t('Review')}</span>
          {t('. This operation cannot be reverted. Are you sure?')}
        </Box>
      );
      break;
    case ProjectStatus.INPROGRESS:
    case ProjectStatus.COMPLETED:
      changeStatusModalContent = (
        <Flex flexDirection="column">
          <Text marginBottom="1rem">
            {t('Set ')}
            {nextStatus === ProjectStatus.INPROGRESS ? t('start date') : t('end date')}
          </Text>
          {nextStatus === ProjectStatus.COMPLETED && (
            <Text marginBottom="1rem">
              {t(
                'Are you sure you want to move the status to ‘Completed’? Once it is completed, the project cannot be edited'
              )}
            </Text>
          )}
          <Box>
            <Text>{nextStatus === ProjectStatus.INPROGRESS ? t('Start date') : t('End date')}</Text>
            <Flex
              _focus={{ border: '1px solid blue', borderRadius: '4px' }}
              position="relative"
              onClick={() => (datePickerOpen ? null : setDatePickerOpen(!datePickerOpen))}
              flexDirection="row"
            >
              <CustomDatePicker
                setDate={(date: Date | undefined) => {
                  setDatePickerOpen(false);
                  setStatusDate(date);
                }}
                open={datePickerOpen}
                date={statusDate}
                placeholder="MM/DD/YYY"
              />
              <Icon
                position="absolute"
                right={3}
                top={1}
                boxSize="1.5rem"
                as={BiCalendarEvent}
                cursor="pointer"
                color="gray"
              />
            </Flex>
          </Box>
        </Flex>
      );
      break;
    default:
      break;
  }
  const isCompleted = project.status === ProjectStatus.COMPLETED;
  return (
    <>
      <Popover
        placement="bottom-start"
        isOpen={isPopoverOpen}
        onClose={() => {
          setDatePickerOpen(false);
          setIsPopoverOpen(false);
        }}
      >
        <PopoverTrigger>
          <Box
            marginTop="-2px"
            padding={0}
            height="20px"
            width="20px"
            justifyContent="flexStart"
            textAlign="center"
            verticalAlign="middle"
            lineHeight="20px"
            onClick={() => setIsPopoverOpen(true)}
            _hover={{ bg: BUTTON_STYLE }}
            background={isPopoverOpen ? BUTTON_STYLE : ''}
            borderRadius="28px"
            minWidth="0px"
          >
            {updatingStatus || loadingCancelProject || loadingUpdateProjectOngoing ? (
              <Spinner height="18px" width="20px" />
            ) : (
              <Icon
                marginTop="-2px"
                height="16px"
                width="16px"
                as={isCompleted ? CheckCircleIcon : project.ongoing ? MdPlayCircleOutline : AiOutlinePauseCircle}
              />
            )}
          </Box>
        </PopoverTrigger>
        <Box zIndex="100">
          <PopoverContent
            marginLeft="10px"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
            border="1px"
            borderRadius="0xp"
            borderStyle="solid"
            borderColor="#E4E4E4"
            padding="0"
            marginRight="5"
            width="190px"
          >
            <PopoverBody p="0">
              <Flex flexDirection="column">
                {isCompleted ? (
                  <Text
                    onClick={() => setIsArchivedModalOpen(true)}
                    padding="1rem"
                    as="h4"
                    textStyle="h4"
                    cursor="pointer"
                    color="red"
                  >
                    {t('Archive')}
                  </Text>
                ) : (
                  <>
                    <Flex flexDirection="column" padding="15px">
                      <Text as="h4" textStyle="h4">
                        {t('Move to Next Stage') + ':'}
                      </Text>
                      <Text
                        onClick={handleChangeStatusOnClick}
                        cursor="pointer"
                        margin="1rem 0 .3rem 1rem"
                        as="h4"
                        textStyle="h4"
                        color="green"
                      >
                        {projectStatusMapper[nextStatus]}
                      </Text>
                    </Flex>
                    <Box borderTop="1px solid #E9E9E9" width="100%" />
                    <Flex flexDirection="column" padding="15px">
                      <Text
                        onClick={handleChangeOnGoing}
                        cursor="pointer"
                        margin=".3rem 0 0 1rem"
                        as="h4"
                        textStyle="h4"
                        color="#636363"
                      >
                        {project.ongoing ? t('Pause') : t('Resume')}
                      </Text>
                      <Text
                        onClick={() => setCancelProjectModalOpen(true)}
                        margin="1rem 0 0 1rem"
                        as="h4"
                        textStyle="h4"
                        cursor="pointer"
                        color="red"
                      >
                        {t('Cancel')}
                      </Text>
                    </Flex>
                  </>
                )}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Popover>
      {statusModalOpen && (
        <Dialog isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} actions={modalActions}>
          {changeStatusModalContent}
        </Dialog>
      )}
      {cancelProjectModalOpen && (
        <Dialog
          isOpen={cancelProjectModalOpen}
          onClose={() => setCancelProjectModalOpen(false)}
          actions={cancelProjectModalActions}
          title={t('Are You Sure You Wish to Cancel?')}
        >
          <Box>
            <Text>{t('Once you press "Cancel Project", you cannot change the project anymore.')}</Text>
          </Box>
        </Dialog>
      )}
      <ArchiveProjectModal isOpen={isArchiveModalOpen} setIsOpen={setIsArchivedModalOpen} project={project} />
    </>
  );
};

export default ActiveStep;
