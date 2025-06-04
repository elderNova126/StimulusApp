import { ModalFooter, ModalBody, Button, Text, Input, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import CompanyMutations from '../../graphql/Mutations/CompanyMutations';
import { navigate } from '@reach/router';
import { useStimulusToast } from '../../hooks';
import { setCompanyEdit } from '../../stores/features/company';
import { useDispatch } from 'react-redux';
import { isValid as validateCountry } from 'i18n-iso-countries';
// @ts-ignore
import { isValid } from 'ein-validator';
import { CreateSupplierFields } from '../../hooks/companyForms/FormValidations';
import { FormCompanyContext } from '../../hooks/companyForms/companyForm.provider';
import FormErrorsMessage from '../GenericComponents/FormErrorsMessage';

const { CREATE_COMPANY } = CompanyMutations;
const CreateSupplier = (props: { legalBusinessName?: string; taxId?: string }) => {
  const { legalBusinessName, taxId } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState('');
  const [taxIdNo, setTaxIdNo] = useState('');
  const [createSupplier, { loading }] = useMutation(CREATE_COMPANY);
  const { enqueueSnackbar } = useStimulusToast();

  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue } = formMethods;

  useEffect(() => {
    if (legalBusinessName) {
      setCompanyName(legalBusinessName);
      setValue(CreateSupplierFields.LEGAL_NAME, legalBusinessName, { shouldValidate: true });
    } else if (taxId) {
      setTaxIdNo(taxId);
      setValue(CreateSupplierFields.TAX_ID, taxId, { shouldValidate: true });
    }
  }, [legalBusinessName, taxId]);

  const createCompanyOnClick = () => {
    const [firstPart, secondPart] = taxIdNo.split(':');
    const countryCode = firstPart.toUpperCase();

    if (isValid(secondPart) && validateCountry(countryCode) && taxIdNo.includes('-', 5)) {
      createSupplier({
        variables: { taxIdNo, legalBusinessName: companyName },
        update: (cache, { data }) => {
          if (data?.createCompany?.id) {
            dispatch(setCompanyEdit(true));
            navigate(`/company/${data.createCompany.id}`);
          }
        },
      });
    } else {
      return enqueueSnackbar('Invalid Tax ID', {
        status: 'error',
      });
    }
  };

  const handleLegalName = (e: any) => {
    setCompanyName(e.target.value);
    setValue(CreateSupplierFields.LEGAL_NAME, e.target.value, { shouldValidate: true });
  };

  const handleTaxId = (e: any) => {
    setTaxIdNo(e.target.value);
    setValue(CreateSupplierFields.TAX_ID, e.target.value, { shouldValidate: true });
  };

  return (
    <>
      <ModalBody>
        <Stack mb="15px" mt="10px">
          <Text fontSize="12px" fontWeight={600} mb="-5px">
            {t('*Company Name')}
          </Text>
          <Input
            placeholder="Stimulus Inc."
            _placeholder={{ opacity: 0.6 }}
            w="360px"
            required
            value={companyName}
            {...register(CreateSupplierFields.LEGAL_NAME)}
            onChange={handleLegalName}
            bg="#FFFFFF"
            border={'1px solid #848484'}
            borderRadius="4px"
            h="30px"
            errorBorderColor="alert.red"
            isInvalid={errors[CreateSupplierFields.LEGAL_NAME]?.message ? true : false}
            type="text"
          />
          <FormErrorsMessage errorMessage={errors?.[CreateSupplierFields.LEGAL_NAME]?.message} />
        </Stack>
        <Text fontSize="12px" fontWeight={600}>
          {t('*Tax ID')}
        </Text>
        <Input
          placeholder="US:00-0000000"
          _placeholder={{ opacity: 0.6 }}
          w="156px"
          required
          value={taxIdNo}
          {...register(CreateSupplierFields.TAX_ID)}
          onChange={handleTaxId}
          bg="#FFFFFF"
          border={'1px solid #848484'}
          borderRadius="4px"
          errorBorderColor="alert.red"
          isInvalid={errors[CreateSupplierFields.TAX_ID]?.message ? true : false}
          h="30px"
          type="text"
        />
        <FormErrorsMessage errorMessage={errors?.[CreateSupplierFields.TAX_ID]?.message} />
      </ModalBody>
      <ModalFooter border="0" justifyContent="start">
        <Button
          isLoading={loading}
          bg="#12814B"
          onClick={() => createCompanyOnClick()}
          color="white"
          mt="25px"
          fontSize="13px"
          h="30px"
          w="140px"
          mr={3}
          disabled={!companyName || !taxIdNo ? true : false || !!Object.keys(errors).length}
        >
          {t('Create Company')}
        </Button>
      </ModalFooter>
    </>
  );
};
export default CreateSupplier;
