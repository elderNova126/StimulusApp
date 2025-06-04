import { Stack } from '@chakra-ui/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setDescription } from '../../../stores/features/company';
import { EditCompanyTextField, EditCompanyRowAccordion } from '../shared';
import { FormCompanyContext } from '../../../hooks/companyForms/companyForm.provider';
import { CompanyFormFields } from '../../../hooks/companyForms/FormValidations';
import { stackHighlights } from './Styles';

const EditDescription = (props: { description?: string }) => {
  const { description } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue } = formMethods;

  const handleDescription = (description: string) => {
    dispatch(setDescription(description));
    setValue(CompanyFormFields.COMPANY_DESCRIPTION, description, { shouldValidate: true });
  };

  return (
    <>
      <EditCompanyRowAccordion name={t('Description')} setLowerName={true}>
        <Stack sx={stackHighlights}>
          <EditCompanyTextField
            id={'Edit-Description'}
            data-testid="Edit-Description"
            type="textarea"
            label={t('Description')}
            locked={false}
            value={description ?? ''}
            max={5000}
            {...register(CompanyFormFields.COMPANY_DESCRIPTION)}
            error={errors?.[CompanyFormFields.COMPANY_DESCRIPTION]?.message}
            onChange={(e: any) => {
              handleDescription(e);
            }}
          />
        </Stack>
      </EditCompanyRowAccordion>
    </>
  );
};

export default EditDescription;
