import { useMutation, useQuery } from '@apollo/client';
import * as R from 'ramda';
import { useCompanyAttachmentUri, useErrorTranslation, useStimulusToast } from '../../../hooks';
import { Company } from '../company.types';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import CompanyMutations from '../../../graphql/Mutations/CompanyMutations';
import Attachments from '../../Attachment';

export enum CompanyAttachmentTypes {
  RELATIONSHIP = 'Relationship',
  CERTIFICATION = 'Certification',
  INSURANCE = 'Insurance',
  PROJECT = 'Project',
  PRODUCTS = 'Products',
  FINANCIALS = 'Financials',
  DIVERSITY = 'Diversity',
  CONTACTS = 'Contacts',
}

const { UPLOAD_COMPANY_ATTACHMENT_GQL, DELETE_COMPANY_ATTACHMENT_GQL } = CompanyMutations;
const { COMPANY_ATTACHMENT_DETAILS_GQL } = CompanyQueries;

const CompanyAttachments = (props: { company: Company; type?: CompanyAttachmentTypes }) => {
  const errTranslations = useErrorTranslation();
  const { company } = props;
  const type = props.type ?? null;
  const companyId = company?.id;
  const { enqueueSnackbar } = useStimulusToast();
  const { data } = useQuery(COMPANY_ATTACHMENT_DETAILS_GQL, {
    variables: { companyId, type },
    fetchPolicy: 'cache-first',
  });
  const attachments = data?.companyAttachmentsDetails?.results || [];
  const [saveAttachment, { loading }] = useMutation(UPLOAD_COMPANY_ATTACHMENT_GQL);
  const [deleteAttachment, { loading: isDeleting }] = useMutation(DELETE_COMPANY_ATTACHMENT_GQL);

  const handleAttachmentUpload = async (files: File[], isPrivate: boolean) => {
    try {
      await saveAttachment({
        variables: {
          files: files,
          companyId,
          isPrivate,
          type,
        },
        update: (cache, { data: { uploadCompanyAttachment } }) => {
          const { companyAttachmentsDetails } = R.clone(
            cache.readQuery({ query: COMPANY_ATTACHMENT_DETAILS_GQL, variables: { companyId, type } })
          ) as any;
          console.log(uploadCompanyAttachment);
          companyAttachmentsDetails.results = [
            ...(companyAttachmentsDetails?.results || []),
            ...uploadCompanyAttachment.results,
          ];

          cache.writeQuery({
            query: COMPANY_ATTACHMENT_DETAILS_GQL,
            variables: { companyId, type },
            data: { companyAttachmentsDetails: { ...companyAttachmentsDetails } },
          });
        },
      });

      enqueueSnackbar(`Attachment uploaded`, { status: 'success' });
    } catch (err) {
      const error = err as { code: string };
      enqueueSnackbar(errTranslations[error.code], { status: 'error' });
      return false;
    }

    return true;
  };

  const handleAttachmentDelete = async (id: number) => {
    try {
      const {
        data: { deleteCompanyAttachment },
      } = await deleteAttachment({
        variables: {
          id,
        },
        update: (cache, { data: { deleteCompanyAttachment } }) => {
          if (deleteCompanyAttachment?.done) {
            const { companyAttachmentsDetails } = R.clone(
              cache.readQuery({ query: COMPANY_ATTACHMENT_DETAILS_GQL, variables: { companyId, type } })
            ) as any;
            companyAttachmentsDetails.results = companyAttachmentsDetails.results.filter(
              (attachment: any) => attachment.id !== id
            );

            cache.writeQuery({
              query: COMPANY_ATTACHMENT_DETAILS_GQL,
              variables: { companyId, type },
              data: { companyAttachmentsDetails: { ...companyAttachmentsDetails } },
            });
          }
        },
      });

      if (deleteCompanyAttachment?.error) {
        enqueueSnackbar(errTranslations[deleteCompanyAttachment.code], { status: 'error' });
        return false;
      }
    } catch (err) {
      enqueueSnackbar(`Couldn't remove the attachment: ${err}`, { status: 'error' });
      return false;
    }

    enqueueSnackbar(`Attachment deleted`, { status: 'success' });
    return true;
  };

  return (
    <Attachments
      handleAttachmentUpload={handleAttachmentUpload}
      handleAttachmentDelete={handleAttachmentDelete}
      attachments={attachments}
      isDeleting={isDeleting}
      loading={loading}
      useAttachmentURI={useCompanyAttachmentUri}
    ></Attachments>
  );
};

export default CompanyAttachments;
