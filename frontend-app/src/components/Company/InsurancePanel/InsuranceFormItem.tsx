import { useMutation } from '@apollo/client';
import { Stack, Text } from '@chakra-ui/layout';
import * as R from 'ramda';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InsuranceMutations from '../../../graphql/Mutations/InsuranceMutations';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { Insurance } from '../company.types';
import { CompanyDateEditField, EditCompanyRowAccordion, EditCompanyTextField } from '../shared';
const { UPDATE_INSURANCE_GQL, CREATE_INSURANCE_GQL } = InsuranceMutations;
const { COMPANY_DETAILS_GQL } = CompanyQueries;

const InsuranceFormItem = forwardRef(
  (props: { insurance?: Insurance; hideTopBorder: boolean; companyId: string }, ref) => {
    const { insurance, hideTopBorder, companyId } = props;
    const { t } = useTranslation();
    const [name, setName] = useState(insurance?.name ?? '');
    const [type, setType] = useState(insurance?.type ?? '');
    const [description, setDescription] = useState(insurance?.description ?? '');
    const [coverageLimit, setCoverageLimit] = useState(insurance?.coverageLimit ?? 0);
    const [coverageStart, setCoverageStart] = useState(
      !insurance?.coverageStart ? null : new Date(insurance.coverageStart)
    );
    const [coverageEnd, setCoverageEnd] = useState(!insurance?.coverageEnd ? null : new Date(insurance.coverageEnd));
    const coverageStartDateTyped = useMemo(() => (!!coverageStart && new Date(coverageStart)) as any, [coverageStart]);
    const coverageEndDateTyped = useMemo(() => (!!coverageEnd && new Date(coverageEnd)) as any, [coverageEnd]);
    const [showError, setShowError] = useState(false);

    const [updateInsurance] = useMutation(UPDATE_INSURANCE_GQL);

    const [createInsurance] = useMutation(CREATE_INSURANCE_GQL, {
      update: async (cache, data) => {
        const clonedList = (await R.clone(
          cache.readQuery({ query: COMPANY_DETAILS_GQL, variables: { id: companyId } })
        )) as any;

        const insurance = data.data.createInsurance;

        if (clonedList.searchCompanyById.results[0].insuranceCoverage.results) {
          const companyUpdated = [...clonedList.searchCompanyById.results[0].insuranceCoverage.results, insurance];
          clonedList.searchCompanyById.results[0].insuranceCoverage.results = companyUpdated;

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        } else {
          clonedList.searchCompanyById.results[0].insuranceCoverage.results = [insurance];

          cache.writeQuery({
            query: COMPANY_DETAILS_GQL,
            variables: { id: companyId },
            data: { ...clonedList },
          });
        }
      },
    });

    const save = () => {
      const coverageStartDateIso = coverageStartDateTyped?.toISOString?.();
      const coverageEndDateIso = coverageEndDateTyped?.toISOString?.();

      if (!name || !coverageStartDateIso || !coverageEndDateIso) {
        setShowError(true);
      }

      if (!insurance?.id) {
        return createInsurance({
          variables: {
            companyId,
            name,
            type,
            description,
            coverageLimit,
            coverageStart: coverageStartDateIso,
            coverageEnd: coverageEndDateIso,
          },
        });
      } else {
        const updates = {
          ...(!!name && name !== insurance.name && { name }),
          ...(!!type && type !== insurance.type && { type }),
          ...(!!description && description !== insurance.description && { description }),
          ...(coverageStartDateIso !== new Date(insurance.coverageStart).toISOString() && {
            coverageStart: coverageStartDateIso,
          }),
          ...(coverageEndDateIso !== new Date(insurance.coverageEnd).toISOString() && {
            coverageEnd: coverageEndDateIso,
          }),
          ...(coverageLimit !== insurance.coverageLimit && { coverageLimit }),
        };

        if (Object.keys(updates).length) {
          return updateInsurance({ variables: { ...updates, id: insurance?.id } });
        }
      }
    };

    useImperativeHandle(ref, () => ({
      save,
    }));

    return (
      <EditCompanyRowAccordion
        name={insurance?.name ?? t('New Insurance')}
        {...(hideTopBorder && { borderTopWidth: '0' })}
      >
        <Stack>
          <EditCompanyTextField
            required={true}
            type="text"
            label={t('Name')}
            locked={false}
            value={name}
            onChange={(val) => setName(val as string)}
          />
          {showError && !name && (
            <Text textStyle="h6" color="secondary">
              {t('This is required')}
            </Text>
          )}
        </Stack>
        <EditCompanyTextField
          type="text"
          label={t('Type')}
          locked={false}
          value={type}
          onChange={(val) => setType(val as string)}
        />
        <EditCompanyTextField
          type="textarea"
          label={t('Description')}
          locked={false}
          value={description}
          onChange={(val) => setDescription(val as string)}
        />
        <EditCompanyTextField
          type="number"
          label={t('Coverage Limit')}
          locked={false}
          min={1}
          max={99999999999}
          value={coverageLimit}
          onChange={(val) => {
            if (!isNaN(Number(val))) {
              setCoverageLimit(val as number);
            } else {
              setCoverageLimit(0);
            }
          }}
        />
        <Stack spacing="1">
          <Text textStyle="filterFieldHeading">{t('Coverage Start')}</Text>
          <CompanyDateEditField date={coverageStartDateTyped} setDate={setCoverageStart} required={true} />
          {showError && !coverageStartDateTyped && (
            <Text textStyle="h6" color="secondary">
              {t('This is required')}
            </Text>
          )}
        </Stack>
        <Stack spacing="1">
          <Text textStyle="filterFieldHeading">{t('Coverage End')}</Text>
          <CompanyDateEditField date={coverageEndDateTyped} setDate={setCoverageEnd} required={true} />
          {showError && !coverageEndDateTyped && (
            <Text textStyle="h6" color="secondary">
              {t('This is required')}
            </Text>
          )}
        </Stack>
      </EditCompanyRowAccordion>
    );
  }
);

export default InsuranceFormItem;
