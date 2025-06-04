import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Checkbox, Input, Stack, Text } from '@chakra-ui/react';
import * as R from 'ramda';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorTranslation, useStimulusToast } from '../../../hooks';
import CompanyAttachment from './CompanyAttachment';
import Attachment from './Attachment.interface';
import { CompanyProfileDivider } from '../shared';
import { Company } from '../company.types';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import CompanyMutations from '../../../graphql/Mutations/CompanyMutations';
import useStyles from './style';

const { UPLOAD_COMPANY_ATTACHMENT_GQL, DELETE_COMPANY_ATTACHMENT_GQL } = CompanyMutations;
const { COMPANY_ATTACHMENT_DETAILS_GQL } = CompanyQueries;

const CompanyAttachments = (props: { company: Company }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const errTranslations = useErrorTranslation();
  const { company } = props;
  const companyId = company?.id;
  const [fileToUpload, setFileToUpload] = useState<File>();
  const { enqueueSnackbar } = useStimulusToast();
  const { data } = useQuery(COMPANY_ATTACHMENT_DETAILS_GQL, {
    variables: { companyId },
    fetchPolicy: 'cache-first',
  });
  const [isPrivate, setIsPrivate] = useState(false);
  const attachments = data?.companyAttachmentsDetails?.results || [];
  const [saveAttachment, { loading }] = useMutation(UPLOAD_COMPANY_ATTACHMENT_GQL);
  const [deleteAttachment, { loading: isDeleting }] = useMutation(DELETE_COMPANY_ATTACHMENT_GQL);

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
        companyId,
        isPrivate,
      },
      update: (cache, { data: { uploadCompanyAttachment } }) => {
        const { companyAttachmentsDetails } = R.clone(
          cache.readQuery({ query: COMPANY_ATTACHMENT_DETAILS_GQL, variables: { companyId } })
        ) as any;
        companyAttachmentsDetails.results = [...(companyAttachmentsDetails?.results || []), uploadCompanyAttachment];

        cache.writeQuery({
          query: COMPANY_ATTACHMENT_DETAILS_GQL,
          variables: { companyId },
          data: { companyAttachmentsDetails: { ...companyAttachmentsDetails } },
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
      update: (cache, { data: { deleteCompanyAttachment } }) => {
        if (deleteCompanyAttachment?.done) {
          const { companyAttachmentsDetails } = R.clone(
            cache.readQuery({ query: COMPANY_ATTACHMENT_DETAILS_GQL, variables: { companyId } })
          ) as any;
          companyAttachmentsDetails.results = companyAttachmentsDetails.results.filter(
            (attachment: any) => attachment.id !== id
          );

          cache.writeQuery({
            query: COMPANY_ATTACHMENT_DETAILS_GQL,
            variables: { companyId },
            data: { companyAttachmentsDetails: { ...companyAttachmentsDetails } },
          });
        }
      },
    }).then(({ data: { deleteCompanyAttachment } }) => {
      if (deleteCompanyAttachment?.error) {
        return enqueueSnackbar(errTranslations[deleteCompanyAttachment.code], { status: 'error' });
      }
      enqueueSnackbar(`Attachment deleted`, { status: 'success' });
    });
  };

  return (
    // @ts-ignore: Expression produces a union type that is too complex to represent.
    <Stack id="attachment">
      <Text as="h5" textStyle="h5" className={classes.infoHead}>
        {t('Attachments')}
      </Text>
      <CompanyProfileDivider />
      <Stack spacing={1}>
        {attachments.map((attachmentItem: Attachment) => (
          <CompanyAttachment
            key={attachmentItem.id}
            data={attachmentItem}
            isDeleting={isDeleting}
            onDelete={(id: number) => handleAttachmentDelete(id)}
          />
        ))}
      </Stack>
      <Box mt="1rem">
        <Input
          display="none"
          data-cy="choose-doc-input"
          accept=".pdf, .csv, .doc, .xls, .docx, .xlsx"
          type="file"
          id="upload-file"
          onChange={handleFileCapture}
        />
        <label htmlFor="upload-file">
          <Button data-cy="choose-doc" size="sm" variant="outline" as="span" cursor="pointer">
            {t('Choose Doc')}
          </Button>
        </label>
        {fileToUpload && (
          <>
            <Button
              isLoading={loading}
              data-cy="upload-doc"
              className={classes.uploadFileButton}
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={handleAttachmentUpload}
            >
              {t('Upload Doc')}
            </Button>
            <Checkbox
              className={classes.checkBox}
              isChecked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            >
              {t('Private')}
            </Checkbox>
            <Text as="h5" textStyle="h6" pt="5px">
              {t('Chosen doc')}: <b>{fileToUpload?.name || ''}</b>
            </Text>
          </>
        )}
        <Text data-testid="company-attachments" as="h6" textStyle="h6" pt="5px">
          {t('Acceptable document file types include doc, docx, pdf, excel, CSV, 50MB limit.')}
        </Text>
      </Box>
    </Stack>
  );
};

export default CompanyAttachments;
