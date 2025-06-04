import { useMutation } from '@apollo/client';
import * as R from 'ramda';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContingencyMutations from '../../../graphql/Mutations/ContingencyMutations';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { Contingency } from '../company.types';
import { EditCompanyRowAccordion, EditCompanyTextField } from '../shared';
const { UPDATE_CONTINGENCY_GQL, CREATE_CONTINGENCY_GQL } = ContingencyMutations;
const { COMPANY_DETAILS_GQL } = CompanyQueries;

const ContingencyFormItem = forwardRef(
  (props: { contingency?: Contingency; hideTopBorder: boolean; companyId: string }, ref) => {
    const { contingency, hideTopBorder, companyId } = props;
    const { t } = useTranslation();
    const [name, setName] = useState(contingency?.name ?? '');
    const [type, setType] = useState(contingency?.type ?? '');
    const [description, setDescription] = useState(contingency?.description ?? '');
    const [updateContingency] = useMutation(UPDATE_CONTINGENCY_GQL);

    const [createContingency] = useMutation(CREATE_CONTINGENCY_GQL, {
      update: async (cache, data) => {
        const clonedList = (await R.clone(
          cache.readQuery({ query: COMPANY_DETAILS_GQL, variables: { id: companyId } })
        )) as any;

        const created = new Date().toString();
        const updated = new Date().toString();

        let contigency = data.data.createContingency;
        contigency = { ...contigency, created, updated };

        if (clonedList.searchCompanyById.results[0].contingencies.results) {
          const companyUpdated = [...clonedList.searchCompanyById.results[0].contingencies.results, contigency];
          clonedList.searchCompanyById.results[0].contingencies.results = companyUpdated;

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        } else {
          clonedList.searchCompanyById.results[0].contingencies.results = [contigency];

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        }
      },
    });

    const save = () => {
      if (!contingency?.id) {
        return createContingency({ variables: { companyId, name, type, description } });
      } else {
        const updates = {
          ...(!!name && name !== contingency.name && { name }),
          ...(!!type && type !== contingency.type && { type }),
          ...(!!description && description !== contingency.description && { description }),
        };

        if (Object.keys(updates).length) {
          return updateContingency({ variables: { ...updates, id: contingency?.id } });
        }
      }
    };

    useImperativeHandle(ref, () => ({
      save,
    }));

    return (
      <EditCompanyRowAccordion
        name={contingency?.name ?? 'New Contingency'}
        {...(hideTopBorder && { borderTopWidth: '0' })}
      >
        <EditCompanyTextField
          type="text"
          label={t('Name')}
          locked={false}
          value={name}
          onChange={(val) => setName(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Type')}
          locked={false}
          value={type}
          onChange={(val) => setType(val as string)}
        />
        <EditCompanyTextField
          type="text"
          label={t('Description')}
          locked={false}
          value={description}
          onChange={(val) => setDescription(val as string)}
        />
      </EditCompanyRowAccordion>
    );
  }
);

export default ContingencyFormItem;
