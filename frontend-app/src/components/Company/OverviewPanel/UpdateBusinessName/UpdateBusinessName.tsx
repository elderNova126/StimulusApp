import { Stack, Box, Text } from '@chakra-ui/react';
import { EditCompanyTextField } from '../../shared';
import { useTranslation } from 'react-i18next';
import { stackHighlights } from '../Styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  CompanyUpdateState,
  setOtherBusinessNames,
  setPreviusBusinessName,
  setLegalBusinessName,
  setDoingBusinessAs,
} from '../../../../stores/features/company';
import { useState, useContext, useEffect } from 'react';
import { FormCompanyContext } from '../../../../hooks/companyForms/companyForm.provider';
import { CompanyFormFields } from '../../../../hooks/companyForms/FormValidations';
import { nameTypes } from '../../company.types';
import { cleanAndFormatString } from '../../../../hooks';
import FormErrorsMessage from '../../../GenericComponents/FormErrorsMessage';
export const UpdateBusinessNamas = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const legalBusinessName = useSelector((state: { company: CompanyUpdateState }) => state.company.legalBusinessName);
  const doingBusinessAs = useSelector((state: { company: CompanyUpdateState }) => state.company.doingBusinessAs);
  const CompanyNames = useSelector((state: { company: CompanyUpdateState }) => state.company.names);

  const [othersNames, setOthersNames] = useState(
    (CompanyNames?.filter((name) => name.type === nameTypes.OTHER)?.map((name) => name.name) as string[]) || ['']
  );
  const [previousNames, setPreviousNames] = useState(
    CompanyNames?.filter((name) => name.type === nameTypes.PREVIOUS)?.map((name) => name.name) as string[]
  ) || [''];

  const setState = (
    field: CompanyFormFields.OTHER_COMPANY_NAME | CompanyFormFields.PREVIOUS_COMPANY_NAME,
    value: string[]
  ) => {
    if (field === CompanyFormFields.OTHER_COMPANY_NAME) setOthersNames(value);
    if (field === CompanyFormFields.PREVIOUS_COMPANY_NAME) setPreviousNames(value);
  };

  useEffect(() => {
    othersNames && dispatch(setOtherBusinessNames(othersNames));
    previousNames && dispatch(setPreviusBusinessName(previousNames));

    if (!othersNames || othersNames.length === 0) setOthersNames(['']);
    if (!previousNames || previousNames.length === 0) setPreviousNames(['']);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue, trigger, clearErrors } = formMethods;
  useEffect(() => {
    legalBusinessName && setValue(CompanyFormFields.LEGAL_BUSINESS_NAME, legalBusinessName, { shouldValidate: true });
    doingBusinessAs && setValue(CompanyFormFields.DOING_BUSINESS_AS, doingBusinessAs, { shouldValidate: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const listOfEvents = {
    [CompanyFormFields.LEGAL_BUSINESS_NAME]: setLegalBusinessName,
    [CompanyFormFields.DOING_BUSINESS_AS]: setDoingBusinessAs,
    [CompanyFormFields.OTHER_COMPANY_NAME]: setOtherBusinessNames,
    [CompanyFormFields.PREVIOUS_COMPANY_NAME]: setPreviusBusinessName,
  };

  const handleOnRemove = async (
    index: number,
    field: CompanyFormFields.OTHER_COMPANY_NAME | CompanyFormFields.PREVIOUS_COMPANY_NAME
  ) => {
    if (index === 0) return;
    const arrayTarget = field === CompanyFormFields.OTHER_COMPANY_NAME ? othersNames : previousNames;
    const NewValues = arrayTarget.filter((_, i) => i !== index);
    const event = listOfEvents[field as keyof typeof listOfEvents];
    setState(field, NewValues);
    dispatch(event(NewValues as never));
    setValue(`${field}[${index}]`, undefined, { shouldValidate: true });
    clearErrors(`${field}[${index}]`);
    await trigger(field);
  };

  const handleOnAdd = async (field: CompanyFormFields.OTHER_COMPANY_NAME | CompanyFormFields.PREVIOUS_COMPANY_NAME) => {
    const arrayTarget = field === CompanyFormFields.OTHER_COMPANY_NAME ? othersNames : previousNames;
    setState(field, [...arrayTarget, '']);
    setValue(field, [...arrayTarget, ''], { shouldValidate: true });
    await trigger(field);
  };

  const handleOnChangeOthersAndPrevious = async (
    index: number,
    field: CompanyFormFields.OTHER_COMPANY_NAME | CompanyFormFields.PREVIOUS_COMPANY_NAME,
    value: string
  ) => {
    const arrayTarget = field === CompanyFormFields.OTHER_COMPANY_NAME ? othersNames : previousNames;
    const NewValues = arrayTarget.map((name, i) => (i === index ? value : name));
    const event = listOfEvents[field as keyof typeof listOfEvents];
    setState(field, NewValues);
    dispatch(event(NewValues as never));
    setValue(`${field}[${index}]`, value, { shouldValidate: true });
    await trigger(field);
  };

  const handleFielChange = (field: string, value: string) => {
    const event = listOfEvents[field as keyof typeof listOfEvents];
    dispatch(event(value as never));
    setValue(field, value, { shouldValidate: true });
  };

  return (
    <Stack sx={stackHighlights} spacing={3}>
      <EditCompanyTextField
        {...register(CompanyFormFields.LEGAL_BUSINESS_NAME)}
        w="369px"
        type="text"
        label={t(CompanyFormFields.LEGAL_BUSINESS_NAME)}
        locked={false}
        value={legalBusinessName as string}
        onChange={(val) => handleFielChange(CompanyFormFields.LEGAL_BUSINESS_NAME, cleanAndFormatString(val as string))}
        error={errors?.[CompanyFormFields.LEGAL_BUSINESS_NAME]}
      />
      <FormErrorsMessage errorMessage={errors[CompanyFormFields.LEGAL_BUSINESS_NAME]?.message} />
      <EditCompanyTextField
        {...register(CompanyFormFields.DOING_BUSINESS_AS)}
        w="369px"
        type="text"
        label={t(CompanyFormFields.DOING_BUSINESS_AS)}
        locked={false}
        value={doingBusinessAs as string}
        onChange={(val) => handleFielChange(CompanyFormFields.DOING_BUSINESS_AS, cleanAndFormatString(val as string))}
        error={errors?.[CompanyFormFields.DOING_BUSINESS_AS]}
      />
      <FormErrorsMessage errorMessage={errors[CompanyFormFields.DOING_BUSINESS_AS]?.message} />
      {othersNames?.map((name, index) => (
        <Box key={`other-${index}`}>
          {index !== 0 && index === othersNames?.length - 1 ? (
            <Box display="flex" justifyContent="flex-end" w="369px" marginBottom={'-1.1rem'}>
              <Text
                fontSize={'11px'}
                textDecoration={'underline'}
                zIndex={999}
                textStyle="filterFieldHeading"
                onClick={() => handleOnRemove(index, CompanyFormFields.OTHER_COMPANY_NAME)}
                cursor={'pointer'}
                color={'#666666'}
              >
                {'Remove'}
              </Text>
            </Box>
          ) : null}
          <EditCompanyTextField
            {...register(`${CompanyFormFields.OTHER_COMPANY_NAME}[${index}]`)}
            w="369px"
            type="text"
            label={t(CompanyFormFields.OTHER_COMPANY_NAME)}
            locked={false}
            value={name as string}
            onChange={(val) =>
              handleOnChangeOthersAndPrevious(
                index,
                CompanyFormFields.OTHER_COMPANY_NAME,
                cleanAndFormatString(val as string)
              )
            }
            error={errors?.[CompanyFormFields.OTHER_COMPANY_NAME]?.[index]}
          />
          <FormErrorsMessage errorMessage={errors[CompanyFormFields.OTHER_COMPANY_NAME]?.[index]?.message} />
          {index === othersNames?.length - 1 ? (
            <Box display="flex" justifyContent="flex-start" w="369px" marginTop={'0.3rem'}>
              <Text
                marginInline={'0.2rem'}
                fontSize={'15px'}
                zIndex={999}
                textStyle="filterFieldHeading"
                onClick={() => handleOnAdd(CompanyFormFields.OTHER_COMPANY_NAME)}
                cursor={'pointer'}
                color={'#666666'}
              >
                {' + '}
              </Text>
              <Text
                fontSize={'11px'}
                textDecoration={'underline'}
                zIndex={999}
                textStyle="filterFieldHeading"
                onClick={() => handleOnAdd(CompanyFormFields.OTHER_COMPANY_NAME)}
                cursor={'pointer'}
                color={'#666666'}
              >
                {' Add Other Business Name'}
              </Text>
            </Box>
          ) : null}
        </Box>
      ))}
      {previousNames?.map((name, index) => (
        <Box key={`previous-${index}`}>
          {index !== 0 && index === previousNames?.length - 1 ? (
            <Box display="flex" justifyContent="flex-end" w="369px" marginBottom={'-1.1rem'}>
              <Text
                fontSize={'11px'}
                textDecoration={'underline'}
                zIndex={999}
                textStyle="filterFieldHeading"
                onClick={() => handleOnRemove(index, CompanyFormFields.PREVIOUS_COMPANY_NAME)}
                cursor={'pointer'}
                color={'#666666'}
              >
                {'Remove'}
              </Text>
            </Box>
          ) : null}
          <EditCompanyTextField
            {...register(`${CompanyFormFields.PREVIOUS_COMPANY_NAME}[${index}]`)}
            w="369px"
            type="text"
            label={t(CompanyFormFields.PREVIOUS_COMPANY_NAME)}
            locked={false}
            value={name as string}
            onChange={(val) =>
              handleOnChangeOthersAndPrevious(
                index,
                CompanyFormFields.PREVIOUS_COMPANY_NAME,
                cleanAndFormatString(val as string)
              )
            }
            error={errors?.[CompanyFormFields.PREVIOUS_COMPANY_NAME]?.[index]}
          />
          <FormErrorsMessage errorMessage={errors[CompanyFormFields.PREVIOUS_COMPANY_NAME]?.[index]?.message} />
          {index === previousNames?.length - 1 ? (
            <Box display="flex" justifyContent="flex-start" w="369px" marginTop={'0.3rem'}>
              <Text
                marginInline={'0.2rem'}
                fontSize={'15px'}
                zIndex={999}
                textStyle="filterFieldHeading"
                onClick={() => handleOnAdd(CompanyFormFields.PREVIOUS_COMPANY_NAME)}
                cursor={'pointer'}
                color={'#666666'}
              >
                {' + '}
              </Text>
              <Text
                fontSize={'11px'}
                textDecoration={'underline'}
                zIndex={999}
                textStyle="filterFieldHeading"
                onClick={() => handleOnAdd(CompanyFormFields.PREVIOUS_COMPANY_NAME)}
                cursor={'pointer'}
                color={'#666666'}
              >
                {'Add Previous Business Name'}
              </Text>
            </Box>
          ) : null}
        </Box>
      ))}
    </Stack>
  );
};
