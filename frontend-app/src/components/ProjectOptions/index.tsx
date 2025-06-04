import { FC, useState } from 'react';
import {
  List,
  ListItem,
  Stack,
  Box,
  Popover,
  Button,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Icon } from '@chakra-ui/icons';
import CloneProjectModal from './CloneProjectModal';
import { PartialProject } from '../../graphql/dto.interface';
import CancelProjectModal from './CancelProjectModal';
import { navigate } from '@reach/router';
import ArchiveProjectModal from './ArchiveProjectModal';
import { ProjectStatus } from '../../graphql/enums';
import { CollaborationUser } from '../ProjectPeopleTab/index';
import UserQueries from '../../graphql/Queries/UserQueries';
import DeleteProjectModal from './DeleteProjectModal';

const BUTTON_STYLE =
  'linear-gradient(179.97deg, rgba(176, 226, 187, 0.375) 0.03%, rgba(146, 214, 193, 0.375) 99.97%), #FFFFFF';

interface Props {
  project: PartialProject;
  collaborators: CollaborationUser[];
}
const { USER_PROFILE_GQL } = UserQueries;
const ProjectOptions: FC<Props> = ({ project, collaborators }) => {
  const { t } = useTranslation();
  const { data } = useQuery(USER_PROFILE_GQL, { fetchPolicy: 'cache-first' });
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchivedModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const isArchiveDisabled =
    [ProjectStatus.CANCELED, ProjectStatus.COMPLETED].indexOf(project.status) === -1 || project.archived;
  const isEndState =
    [ProjectStatus.CANCELED, ProjectStatus.COMPLETED, ProjectStatus.INPROGRESS].indexOf(project.status) > -1 ||
    !project.ongoing;
  const isCanceledCompleted =
    [ProjectStatus.CANCELED, ProjectStatus.COMPLETED].indexOf(project.status) > -1 || !project.ongoing;
  const isOwner = collaborators.filter(
    (collaborator: any) => collaborator.id === data?.userProfile?.id && collaborator.userType === 'owner'
  );
  const isAbletoDelete =
    [ProjectStatus.NEW, ProjectStatus.OPEN, ProjectStatus.INREVIEW].indexOf(project.status) > -1 || !project.ongoing;
  return (
    <Box mt=".6rem">
      <Popover
        id="project-options-button-000"
        isOpen={isPopoverOpen}
        placement="bottom-start"
        onClose={() => setIsPopoverOpen(false)}
      >
        <PopoverTrigger>
          <Button
            onClick={() => setIsPopoverOpen(true)}
            variant={isPopoverOpen ? 'rounded' : 'simple'}
            _hover={{ bg: BUTTON_STYLE }}
            borderRadius="50%"
            maxW="20px"
            maxH="40px"
          >
            <Icon as={BsThreeDots} />
          </Button>
        </PopoverTrigger>
        <Box zIndex="100">
          <PopoverContent
            border="1px"
            borderStyle="solid"
            borderColor="#E4E4E4"
            borderRadius="0px"
            padding="0"
            margin="5px 0 0 10px"
            maxWidth="185px"
            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25) !important"
          >
            <PopoverBody p="0">
              <Stack>
                <List spacing={0} p="0">
                  <ListItem
                    p=".5rem"
                    _hover={{ bg: '#F6F6F6' }}
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCloneModalOpen(true);
                    }}
                  >
                    <Text as="h4" textStyle="h4">
                      {t('Clone Project')}
                    </Text>
                  </ListItem>
                  <ListItem
                    p=".5rem"
                    _hover={{ bg: '#F6F6F6' }}
                    cursor={isEndState ? 'not-allowed' : 'pointer'}
                    onClick={() => {
                      if (!isEndState) {
                        navigate(`/projects/edit/${project.id}`);
                      }
                    }}
                  >
                    <Text as="h4" textStyle="h4" color={isEndState ? 'grey' : ''}>
                      {t('Edit Project')}
                    </Text>
                  </ListItem>
                  <ListItem
                    p=".5rem"
                    _hover={{ bg: '#F6F6F6' }}
                    cursor={isArchiveDisabled ? 'not-allowed' : 'pointer'}
                    onClick={() => {
                      if (!isArchiveDisabled) {
                        setIsArchivedModalOpen(true);
                      }
                    }}
                  >
                    <Text as="h4" textStyle="h4" color={isArchiveDisabled ? 'grey' : ''}>
                      {t('Archive Project')}
                    </Text>
                  </ListItem>
                  <ListItem
                    p=".5rem"
                    _hover={{ bg: '#F6F6F6' }}
                    cursor={isCanceledCompleted ? 'not-allowed' : 'pointer'}
                    onClick={() => {
                      if (!isCanceledCompleted) {
                        setIsCancelModalOpen(true);
                      }
                    }}
                  >
                    <Text as="h4" textStyle="h4" color={isCanceledCompleted ? 'grey' : ''}>
                      {t('Cancel Project')}
                    </Text>
                  </ListItem>
                  <ListItem
                    p=".5rem"
                    _hover={{ bg: '#F6F6F6' }}
                    cursor={!!isOwner.length && isAbletoDelete ? 'pointer' : 'not-allowed'}
                    onClick={(e) => {
                      if (!!isOwner.length && isAbletoDelete) {
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                      }
                    }}
                  >
                    <Text as="h4" textStyle="h4" color={!!isOwner.length && isAbletoDelete ? '' : 'grey'}>
                      {t('Delete Project')}
                    </Text>
                  </ListItem>
                </List>
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Box>
      </Popover>
      <CloneProjectModal
        isOpen={isCloneModalOpen}
        setIsOpen={setIsCloneModalOpen}
        projectId={project.id}
        title={project.title}
        collaborators={collaborators}
        userId={data?.userProfile?.id}
        continuation={!!project?.isContinuedByProject}
      />
      <CancelProjectModal isOpen={isCancelModalOpen} setIsOpen={setIsCancelModalOpen} project={project} />
      <ArchiveProjectModal isOpen={isArchiveModalOpen} setIsOpen={setIsArchivedModalOpen} project={project} />
      <DeleteProjectModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} project={project} />
    </Box>
  );
};

export default ProjectOptions;
