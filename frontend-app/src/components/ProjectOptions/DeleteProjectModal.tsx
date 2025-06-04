import { useMutation } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
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
const { DELETE_PROJECT } = ProjectMutations;
const DeleteProjectModal: FC<Props> = ({ isOpen, setIsOpen, project }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const [deleteProject, { loading: isLoading }] = useMutation(DELETE_PROJECT, {
    update: (_, { data: { updateProject } }) => {
      if (updateProject?.error) {
        enqueueSnackbar(errTranslations[updateProject.code], { status: 'error' });
        setIsOpen(false);
      }
      enqueueSnackbar(`Project '${project.title}' was deleted`, { status: 'success' });
      navigate('/projects/1');
    },
  });
  const onDeleteProject = () => {
    deleteProject({ variables: { id: project.id } });
  };
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={() => setIsOpen(false)}>
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor="#F6F6F6" padding="10px" height="220px" width="478px">
          <AlertDialogBody>
            <AlertDialogCloseButton />
            <Text as="h2" textStyle="h2" fontWeight="600">
              {t('Are you sure you wish to delete?')}
            </Text>
            <Text marginTop="1rem" textStyle="body" mt="30px">
              {t('On confirming, the project will be deleted and this action cannot be reverted')}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter paddingTop="0" justifyContent="flex-end">
            <StimButton isDisabled={isLoading} variant="stimOutline" size="stimSmall" onClick={() => setIsOpen(false)}>
              {t('Cancel')}
            </StimButton>
            <StimButton
              onClick={onDeleteProject}
              isDisabled={isLoading}
              isLoading={isLoading}
              ml="1rem"
              size="stimSmall"
            >
              {t('Confirm')}
            </StimButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
export default DeleteProjectModal;
