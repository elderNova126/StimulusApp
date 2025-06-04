import { useMutation } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Box,
  Divider,
  Flex,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import { Checkbox } from '../GenericComponents';
import { CloneType } from '../ProjectCloneModal';
import StimButton from '../ReusableComponents/Button';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  projectId: number;
  title: string;
  collaborators: any;
  userId: string;
  continuation?: boolean;
}

const { CLONE_PROJECT } = ProjectMutations;

const CloneProjectModal: FC<Props> = ({ isOpen, setIsOpen, projectId, title, collaborators, userId, continuation }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [projectName, setProjectName] = useState<string>('');
  const [withDescription, setWithDescription] = useState<boolean>(false);
  const [withNotes, setWithNotes] = useState<boolean>(false);
  const [withSuppliers, setWithSuppliers] = useState<boolean>(false);
  const [withSelectionCriteria, setWithSelectionCriteria] = useState<boolean>(false);
  const [withPeople, setWithPeople] = useState<boolean>(false);
  const [withBudget, setWithBudget] = useState<boolean>(false);
  const [withAttachment, setWithAttachment] = useState<boolean>(false);
  const [withKeywords, setWithKeywords] = useState<boolean>(false);
  const [isContinuation, setIsContinuation] = useState<boolean>(false);
  const { enqueueSnackbar } = useStimulusToast();
  const errTranslations = useErrorTranslation();
  const collabFiltered = collaborators
    .filter((collaborators: any) => collaborators.userType === 'collaborator')
    .map((collab: any) => {
      return collab.id;
    });

  useEffect(() => {
    setProjectName(title);
  }, [title, isOpen]);

  const [cloneProject, { loading: cloningLoading }] = useMutation(CLONE_PROJECT, {
    update: (cache, { data: { cloneProject: projectData } }) => {
      if (projectData?.error) {
        return enqueueSnackbar(errTranslations[projectData.code], { status: 'error' });
      }

      enqueueSnackbar(t(`Project '${title}' was cloned`), { status: 'success' });
      onClose();
      navigate(`/project/${projectData.id}`);
    },
  });

  const onClose = () => {
    setProjectName('');
    setWithDescription(false);
    setWithNotes(false);
    setWithSuppliers(false);
    setIsContinuation(false);
    setWithPeople(false);
    setWithSelectionCriteria(false);
    setWithBudget(false);
    setWithAttachment(false);
    setWithKeywords(false);
    setIsOpen(false);
  };

  const handleCloneProject = () => {
    if (continuation && isContinuation) {
      enqueueSnackbar(t(`A linked clone project already exists`), { status: 'error' });
    } else {
      cloneProject({
        variables: {
          id: projectId,
          title: projectName,
          relation: isContinuation ? CloneType.CONTINUATION : CloneType.REGULAR,
          includeDescription: withDescription,
          includeSuppliers: withSuppliers,
          includeNotes: withNotes,
          includeCriteria: withSelectionCriteria,
          includePeople: withPeople,
          includeKeywords: withKeywords,
          includeAttatchment: withAttachment,
          includeBudget: withBudget,
          people: collabFiltered,
          userId,
        },
      });
    }
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={() => onClose()}>
      <AlertDialogOverlay>
        <AlertDialogContent backgroundColor="#F6F6F6" padding="10px" height="430px" width="478px">
          <AlertDialogBody>
            <AlertDialogCloseButton />
            <Text as="h2" textStyle="h2">
              {t('Clone Project')}
            </Text>

            <Text mt="1.5rem" as="h4" textStyle="h4">
              {`${t('Name')}*`}
            </Text>
            <Input
              backgroundColor="#FDFDFD"
              type={'text'}
              size={'sm'}
              width="240px"
              borderRadius="4px"
              border={'1px solid #848484'}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <Text mt="1.5rem" as="h4" textStyle="h4">
              {`${t('Include')}*`}
            </Text>
            <Box>
              <Flex>
                <Flex
                  onClick={() => setWithDescription(!withDescription)}
                  margin="1rem 0 0 .2rem"
                  flexDir="row"
                  cursor="pointer"
                >
                  <Box margin="4px .4rem 0 0">
                    <Checkbox width="14px" height="14px" checked={withDescription} />
                  </Box>
                  <Text textStyle="body">{t('Description')}</Text>
                </Flex>
                <Flex
                  onClick={() => setWithSuppliers(!withSuppliers)}
                  margin="1rem 0 0 2rem"
                  flexDir="row"
                  cursor="pointer"
                >
                  <Box margin="4px .4rem 0 0">
                    <Checkbox width="14px" height="14px" checked={withSuppliers} />
                  </Box>
                  <Text textStyle="body">{t('Suppliers')}</Text>
                </Flex>
                <Flex onClick={() => setWithPeople(!withPeople)} margin="1rem 0 0 2rem" flexDir="row" cursor="pointer">
                  <Box margin="4px .4rem 0 0">
                    <Checkbox width="14px" height="14px" checked={withPeople} />
                  </Box>
                  <Text textStyle="body">{t('People')}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex
                  onClick={() => setWithNotes(!withNotes)}
                  margin="1rem 2.4rem 0 .2rem"
                  flexDir="row"
                  cursor="pointer"
                >
                  <Box margin="4px .4rem 0 0">
                    <Checkbox width="14px" height="14px" checked={withNotes} />
                  </Box>
                  <Text textStyle="body">{t('Notes')}</Text>
                </Flex>
                <Flex
                  onClick={() => setWithSelectionCriteria(!withSelectionCriteria)}
                  margin="1rem 0 0 2rem"
                  flexDir="row"
                  cursor="pointer"
                >
                  <Box margin="4px .4rem 0 1px">
                    <Checkbox width="14px" height="14px" checked={withSelectionCriteria} />
                  </Box>
                  <Text textStyle="body">{t('Criteria')}</Text>
                </Flex>
                <Flex onClick={() => setWithBudget(!withBudget)} margin="1rem 0 0 2rem" flexDir="row" cursor="pointer">
                  <Box margin="4px .4rem 0 12px">
                    <Checkbox width="14px" height="14px" checked={withBudget} />
                  </Box>
                  <Text textStyle="body">{t('Budget')}</Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex
                  onClick={() => setWithAttachment(!withAttachment)}
                  margin="1rem -4px 0 .2rem"
                  flexDir="row"
                  cursor="pointer"
                >
                  <Box margin="4px .4rem 0 0">
                    <Checkbox width="14px" height="14px" checked={withAttachment} />
                  </Box>
                  <Text textStyle="body">{t('Attachment')}</Text>
                </Flex>
                <Flex
                  onClick={() => setWithKeywords(!withKeywords)}
                  margin="1rem 0 0 2rem"
                  flexDir="row"
                  cursor="pointer"
                >
                  <Box margin="4px .4rem 0 0">
                    <Checkbox width="14px" height="14px" checked={withKeywords} />
                  </Box>
                  <Text textStyle="body">{t('Keywords')}</Text>
                </Flex>
              </Flex>
            </Box>
            <Divider margin="1.2rem 0 1.2rem 0" />
            <Flex
              onClick={() => setIsContinuation(!isContinuation)}
              margin="1rem 0 0 .2rem"
              flexDir="row"
              cursor="pointer"
            >
              <Box margin="4px .4rem 0 0">
                <Checkbox width="14px" height="14px" checked={isContinuation} />
              </Box>
              <Text textStyle="body" lineHeight="23px">
                {t('As a Continuation')}
              </Text>
            </Flex>
          </AlertDialogBody>
          <AlertDialogFooter paddingTop="0" justifyContent="flex-end">
            <StimButton isDisabled={cloningLoading} variant="stimOutline" onClick={() => onClose()} size="stimSmall">
              {t('Cancel')}
            </StimButton>
            <StimButton onClick={() => handleCloneProject()} ml="1rem" size="stimSmall" isDisabled={cloningLoading}>
              {t('Save')}
            </StimButton>
            {cloningLoading && <Spinner />}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CloneProjectModal;
