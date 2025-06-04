import { useMutation } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Box,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Select } from '@chakra-ui/select';
import { navigate } from '@reach/router';
import * as R from 'ramda';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PartialProject } from '../../graphql/dto.interface';
import { ProjectStatus } from '../../graphql/enums';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import StimButton from '../ReusableComponents/Button';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  project: PartialProject;
}

const { CANCEL_PROJECT_GQL } = ProjectMutations;
const { AVAILABLE_PROJECTS_GQL } = ProjectQueries;

const CancelProjectModal: FC<Props> = ({ isOpen, setIsOpen, project }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const [reason, setReason] = useState<string>('other');
  const [explanation, setExplanation] = useState<string>('');

  const [cancelProject, { loading: isLoading }] = useMutation(CANCEL_PROJECT_GQL, {
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
        enqueueSnackbar(message ?? errTranslations[cancelProject.code], { status: 'error' });
      } else {
        const { searchProjects } = R.clone(cache.readQuery({ query: AVAILABLE_PROJECTS_GQL() })) as any;

        searchProjects.results = searchProjects?.results?.filter?.((project: any) => project.id !== cancelProject.id);

        cache.writeQuery({
          query: AVAILABLE_PROJECTS_GQL(),
          data: { searchProjects: { ...searchProjects } },
        });

        enqueueSnackbar(`Project ${project.title} canceled`, { status: 'success' });
        onClose();
        navigate(`/projects/1`);
      }
    },
  });

  const onClose = () => {
    setReason('other');
    setExplanation('');
    setIsOpen(false);
  };

  const handleCancelProject = () => {
    cancelProject({ variables: { id: project.id } });
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={() => onClose()}>
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor="#F6F6F6" padding="10px" height="auto" width="478px">
          <AlertDialogBody>
            <AlertDialogCloseButton />
            <Text as="h2" textStyle="h2">
              {t('Cancel Project')}
            </Text>
            <Text marginTop="1rem" textStyle="body">
              {t(
                'This is for Stimulus to better understand patterns that may affect company scores and recommendations in the future.'
              )}
            </Text>

            <Text mt="1rem" as="h4" textStyle="h4">
              {t('Reason for Canceling')}
            </Text>
            <Box w="70%" alignItems="center" marginTop=".2rem" marginBottom="1.2rem">
              <Select value={reason} onChange={(e) => setReason(e.target.value)} fontSize="13px">
                <option value="other">{t('Other')}</option>
              </Select>
            </Box>

            <Text mt="1.5rem" as="h4" textStyle="h4">
              {t('Please Explain')}
            </Text>
            <Textarea minHeight="105px" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </AlertDialogBody>
          <AlertDialogFooter paddingTop="0" justifyContent="flex-end">
            <StimButton isDisabled={isLoading} variant="stimOutline" onClick={onClose} size="stimSmall">
              {t('Cancel')}
            </StimButton>
            <StimButton onClick={() => handleCancelProject()} isDisabled={isLoading} size="stimSmall" ml="1rem">
              {t('Save')}
            </StimButton>
            {isLoading && <Spinner />}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CancelProjectModal;
