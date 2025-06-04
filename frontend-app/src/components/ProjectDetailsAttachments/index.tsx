import { useMutation, useQuery } from '@apollo/client';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import * as R from 'ramda';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectMutations from '../../graphql/Mutations/ProjectMutations';
import ProjectQueries from '../../graphql/Queries/ProjectQueries';
import { useErrorTranslation, useStimulusToast } from '../../hooks';
import ProjectAttachment from './Attachment';
import Attachment from './Attachment.interface';
import StimButton from '../ReusableComponents/Button';

const { UPLOAD_PROJECT_ATTACHMENT_GQL, DELETE_PROJECT_ATTACHMENT_GQL } = ProjectMutations;
const { PROJECT_ATTACHMENT_DETAILS_GQL } = ProjectQueries;

const ProjectDetailsAttachments = (props: { projectId: number }) => {
  const { t } = useTranslation();
  const errTranslations = useErrorTranslation();
  const { projectId } = props;
  const [fileToUpload, setFileToUpload] = useState<File>();
  const { enqueueSnackbar } = useStimulusToast();
  const { data } = useQuery(PROJECT_ATTACHMENT_DETAILS_GQL, {
    variables: { projectId },
    fetchPolicy: 'cache-first',
  });
  const attachments = data?.projectAttachmentsDetails?.results || [];
  const [saveAttachment, { loading }] = useMutation(UPLOAD_PROJECT_ATTACHMENT_GQL);
  const [deleteAttachment] = useMutation(DELETE_PROJECT_ATTACHMENT_GQL);

  const handleFileCapture = ({ target }: any) => {
    const file = target.files;
    if (file) {
      setFileToUpload(target.files[0]);
    }
  };

  const handleAttachmentUpload = () => {
    saveAttachment({
      variables: {
        file: fileToUpload,
        projectId,
      },
      update: (cache, { data: { uploadProjectAttachment } }) => {
        const { projectAttachmentsDetails } = R.clone(
          cache.readQuery({ query: PROJECT_ATTACHMENT_DETAILS_GQL, variables: { projectId } })
        ) as any;
        projectAttachmentsDetails.results = [...(projectAttachmentsDetails?.results || []), uploadProjectAttachment];

        cache.writeQuery({
          query: PROJECT_ATTACHMENT_DETAILS_GQL,
          variables: { projectId },
          data: { projectAttachmentsDetails: { ...projectAttachmentsDetails } },
        });
      },
    }).then(() => {
      enqueueSnackbar(`Attachment uploaded`, { status: 'success' });
      setFileToUpload(undefined);
    });
  };

  const handleAttachmentDelete = (id: number) => {
    deleteAttachment({
      variables: {
        id,
      },
      update: (cache, { data: { deleteProjectAttachment } }) => {
        if (deleteProjectAttachment?.done) {
          const { projectAttachmentsDetails } = R.clone(
            cache.readQuery({ query: PROJECT_ATTACHMENT_DETAILS_GQL, variables: { projectId } })
          ) as any;
          projectAttachmentsDetails.results = projectAttachmentsDetails.results.filter(
            (attachment: any) => attachment.id !== id
          );

          cache.writeQuery({
            query: PROJECT_ATTACHMENT_DETAILS_GQL,
            variables: { projectId },
            data: { projectAttachmentsDetails: { ...projectAttachmentsDetails } },
          });
        }
      },
    }).then(({ data: { deleteProjectAttachment } }) => {
      if (deleteProjectAttachment?.error) {
        return enqueueSnackbar(errTranslations[deleteProjectAttachment.code], { status: 'error' });
      }
      enqueueSnackbar(`Attachment deleted`, { status: 'success' });
    });
  };

  return (
    <Stack>
      <Text mt="2rem" mb="1rem" as="h5" textStyle="h5" color="#000000">
        {t('Attachments')}
      </Text>
      <Stack spacing={1}>
        {attachments.map((projectAttachmentItem: Attachment) => (
          <ProjectAttachment
            key={projectAttachmentItem.id}
            data={projectAttachmentItem}
            onDelete={(id: number) => handleAttachmentDelete(id)}
          />
        ))}
      </Stack>
      <Box mt="1rem">
        <Input
          display="none"
          data-cy="choose-doc-input"
          accept=".pdf, .csv, .doc, .xls, .ppt, .jpeg, .jpg, .zip, .docx, .png, .svg, .xlsx"
          type="file"
          id="upload-file"
          onChange={handleFileCapture}
        />
        <label htmlFor="upload-file">
          <StimButton data-cy="choose-doc" size="stimSmall" variant="stimOutline" as="span">
            {t('Choose Doc')}
          </StimButton>
        </label>
        {fileToUpload && (
          <>
            <StimButton
              isLoading={loading}
              ml="10px"
              data-cy="upload-doc"
              variant="stimOutline"
              size="stimSmall"
              disabled={loading}
              onClick={handleAttachmentUpload}
            >
              {t('Upload Doc')}
            </StimButton>
            <Text as="h5" textStyle="h5" pt="5px">
              {t('Chosen doc')}: <b>{fileToUpload?.name || ''}</b>
            </Text>
          </>
        )}
        <Text data-testid="project-attachments" as="h6" textStyle="h6" pt="5px">
          {t('Acceptable document file types include doc, docx, pdf, excel, CSV, 50MB limit.')}
        </Text>
      </Box>
    </Stack>
  );
};

export default ProjectDetailsAttachments;
