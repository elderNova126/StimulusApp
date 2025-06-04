import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyUpdateState, setInternalId, setInternalName } from '../../../stores/features/company';
import { CompanyAccordion, EditCompanyRowAccordion, EditCompanyTextField } from '../shared';
import { boxInput } from './styles';
import { useContext, forwardRef } from 'react';
import { FormCompanyContext } from '../../../hooks/companyForms/companyForm.provider';
import { CompanyFormFields } from '../../../hooks/companyForms/FormValidations';
import BadgeUpdate from './Badges/BadgeUpdate';
import { Badge } from '../../CompanyAccount/Badges/badge.types';
import { Company } from '../company.types';
import FormErrorsMessage from '../../GenericComponents/FormErrorsMessage';
const UpdateView = forwardRef((props: { company: Company; badges: Badge[] }, ref) => {
  const { badges, company } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const companyInternalName = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.tenantCompanyRelation?.internalName
  );
  const companyInternalId = useSelector(
    (state: { company: CompanyUpdateState }) => state.company?.tenantCompanyRelation?.internalId
  );

  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue } = formMethods;

  return (
    <CompanyAccordion>
      <EditCompanyRowAccordion name={t(CompanyFormFields.INTERNAL_NAME)} borderTopWidth="0px">
        <Box sx={boxInput}>
          <EditCompanyTextField
            id={'internalNameInput'}
            {...register(CompanyFormFields.INTERNAL_NAME)}
            type="text"
            label={''}
            locked={false}
            value={companyInternalName ? (companyInternalName as string) : ''}
            error={companyInternalName && errors?.[CompanyFormFields.INTERNAL_NAME]}
            onChange={(e) => {
              setValue(CompanyFormFields.INTERNAL_NAME, e, { shouldValidate: true });
              return dispatch(setInternalName(e as string));
            }}
          />
          <FormErrorsMessage errorMessage={errors?.[CompanyFormFields.INTERNAL_NAME]?.message} />
        </Box>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion name={t(CompanyFormFields.INTERNAL_ID)}>
        <Box sx={boxInput}>
          <EditCompanyTextField
            id={'internalIdInput'}
            {...register(CompanyFormFields.INTERNAL_ID)}
            type="text"
            label={''}
            locked={false}
            value={companyInternalId ? (companyInternalId as string) : companyInternalId}
            error={companyInternalId && errors?.[CompanyFormFields.INTERNAL_ID]}
            onChange={(e) => {
              setValue(CompanyFormFields.INTERNAL_ID, e, { shouldValidate: true });
              return dispatch(setInternalId(e as string));
            }}
          />
          <FormErrorsMessage errorMessage={errors?.[CompanyFormFields.INTERNAL_ID]?.message} />
        </Box>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion isDisabled locked={true} name={t('General')} />
      <EditCompanyRowAccordion isDisabled locked={true} name={t('Projects')} />
      <EditCompanyRowAccordion isDisabled locked={true} name={t('Internal Selection Status')} />
      <BadgeUpdate ref={ref} badges={badges} tenantCompanyRelationshipId={company?.tenantCompanyRelation?.id} />
    </CompanyAccordion>
  );
});

export default UpdateView;
