import { useMutation } from '@apollo/client';
import * as R from 'ramda';
import CertificationMutations from '../../../../graphql/Mutations/CertificationMutations';
import CompanyQueries from '../../../../graphql/Queries/CompanyQueries';
const { UPDATE_CERTIFICATION_GQL, CREATE_CERTIFICATION_GQL } = CertificationMutations;
const { COMPANY_DETAILS_GQL } = CompanyQueries;

const useCreateCertification = () => {
  const [createCertification] = useMutation(CREATE_CERTIFICATION_GQL);

  const createCertificate = (certificate: any, companyId: string) => {
    createCertification({
      variables: certificate,
      update: async (cache, data) => {
        const clonedList = (await R.clone(
          cache.readQuery({ query: COMPANY_DETAILS_GQL, variables: { id: companyId } })
        )) as any;

        const certification = data.data.createCertification;

        if (clonedList.searchCompanyById.results[0].certifications.results) {
          const companyUpdated = [...clonedList.searchCompanyById.results[0].certifications.results, certification];
          clonedList.searchCompanyById.results[0].certifications.results = companyUpdated;

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        } else {
          clonedList.searchCompanyById.results[0].certifications.results = [certification];

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        }
      },
    });
  };
  return { createCertificate };
};

const useUpdateCertification = () => {
  const [updateCertification] = useMutation(UPDATE_CERTIFICATION_GQL);

  const updateCertificate = (certificate: any) => {
    updateCertification({ variables: certificate });
  };
  return { updateCertificate };
};

export { useCreateCertification, useUpdateCertification };
