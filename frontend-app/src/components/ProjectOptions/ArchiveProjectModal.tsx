import { useMutation } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PartialProject } from '../../graphql/dto.interface';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  project: PartialProject;
}

const { ARCHIVE_PROJECT } = ProjectMutations;

const ArchiveProjectModal: FC<Props> = ({ isOpen, setIsOpen, project }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();

  const [archiveProject, { loading: isLoading }] = useMutation(ARCHIVE_PROJECT, {
    update: (_, { data: { updateProject } }) => {
      if (updateProject.error) {
        enqueueSnackbar(errTranslations[updateProject.code], { status: 'error' });
        setIsOpen(false);
      }
      enqueueSnackbar(`Project '${project.title}' was archived`, { status: 'success' });
      navigate('/projects/1');
    },
  });

  const onArchiveProject = () => {
    archiveProject({ variables: { id: project.id } });
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={() => setIsOpen(false)}>
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor="#F6F6F6" padding="10px" height="auto" width="478px">
          <AlertDialogBody>
            <AlertDialogCloseButton />
            <Text as="h2" textStyle="h2">
              {t('Are you sure you wish to archive?')}
            </Text>
            <Text marginTop="1rem" textStyle="body">
              {t('Once you press "Archive Project", you cannot see the project anymore in active list.')}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter paddingTop="0" justifyContent="flex-end">
            <StimButton isDisabled={isLoading} variant="stimOutline" onClick={() => setIsOpen(false)} size="stimSmall">
              {t('Cancel')}
            </StimButton>
            <StimButton onClick={onArchiveProject} isDisabled={isLoading} size="stimSmall" ml="1rem">
              {t('Save')}
            </StimButton>
            {isLoading && <Spinner />}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ArchiveProjectModal;
