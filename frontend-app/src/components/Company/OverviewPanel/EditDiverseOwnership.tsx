import { useQuery } from '@apollo/client';
import { Switch, Text } from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import {
  CompanyUpdateState,
  setDiverseOwnership,
  setEmployeesDiverse,
  setIsSmallBusiness,
  setMinorityOwnership,
  setOwnershipDescription,
} from '../../../stores/features/company';

import { EditCompanyTextField } from '../shared';
import SelectDiversityTag from './SelectDiversityTag';

import { FormCompanyContext } from '../../../hooks/companyForms/companyForm.provider';
import { CompanyFormFields } from '../../../hooks/companyForms/FormValidations';
import { MinorityOwnership } from '../../../stores/features';
const { GET_COMPANY_DIVERSE_OWNERSHIP, GET_MINORITY_OWNERSHIP_DETAIL } = CompanyQueries;

const EditDiverseOwnership = ({ company }: { company: any }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const employeesDiverse = useSelector((state: { company: CompanyUpdateState }) => state.company.employeesDiverse);
  const placeholderDiversity = 'Select Diversity Tag';
  const placeholderMinority = 'Select Minority Tag';
  const [smallBusiness, setSmallBusiness] = useState<boolean>(company.smallBusiness ? company.smallBusiness : false);
  const [description, setdescription] = useState<string>(
    company.ownershipDescription ? company.ownershipDescription : ''
  );

  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue } = formMethods;

  const { data: cachedDiverseOwnership } = useQuery(GET_COMPANY_DIVERSE_OWNERSHIP, {
    fetchPolicy: 'cache-first',
  });
  const availableDiverseOwnership =
    cachedDiverseOwnership?.getCompanyDistinctDiverseOwnership?.diverseOwnership?.filter(
      (ownership: string) => ownership !== 'Immigrant'
    ) ?? [];

  const { data: cachedMinoryOwnership } = useQuery(GET_MINORITY_OWNERSHIP_DETAIL, {
    fetchPolicy: 'cache-first',
  });
  const minorityOwnershipDetails = cachedMinoryOwnership?.getMinorityOwnership ?? [];
  const availableMinorityOwnership = minorityOwnershipDetails.map((item: MinorityOwnership) => item.displayName);

  const handleSwitch = (isSmall: boolean) => {
    dispatch(setIsSmallBusiness(isSmall));
    setSmallBusiness(isSmall);
  };

  const handleDescription = (description: string) => {
    setdescription(description);
    dispatch(setOwnershipDescription(description));
    setValue(CompanyFormFields.OWNERSHIP_DESCRIPTION, description, { shouldValidate: true });
  };

  return (
    <>
      <EditCompanyTextField
        w="369px"
        id={'Edit-number-EmployeesDiverse'}
        data-testid="Edit-number-EmployeesDiverse"
        type="number"
        label={t('% Diverse')}
        locked={false}
        value={employeesDiverse as number}
        min={0}
        max={100}
        onChange={(val) => dispatch(setEmployeesDiverse(val as number))}
      />
      <SelectDiversityTag
        label={'Diversity Tag'}
        ownerships={company.diverseOwnership ? company.diverseOwnership : []}
        options={[placeholderDiversity, ...availableDiverseOwnership]}
        setReduxMethod={setDiverseOwnership}
      />
      <SelectDiversityTag
        label={'Minority Tag'}
        ownerships={company.minorityOwnership ? company.minorityOwnership : []}
        options={[placeholderMinority, ...availableMinorityOwnership]}
        setReduxMethod={setMinorityOwnership}
        minorityOwnershipDetails={minorityOwnershipDetails}
      />
      <Text textStyle="filterFieldHeading">{'Small Business'}</Text>
      <Switch
        id="Edit-Switch-smallBusiness"
        data-testid="Edit-Switch-smallBusiness"
        isChecked={smallBusiness}
        size="md"
        colorScheme={smallBusiness ? 'green' : 'gray.700'}
        onChange={(e) => {
          handleSwitch(e.target.checked);
        }}
      />
      <EditCompanyTextField
        id={'Edit-OwnershipDescription'}
        data-testid="Edit-OwnershipDescription"
        type="textarea"
        label={t('Description')}
        locked={false}
        value={description}
        max={1500}
        error={errors?.[CompanyFormFields.OWNERSHIP_DESCRIPTION]?.message}
        onChange={(e: any) => {
          handleDescription(e);
        }}
        {...register(CompanyFormFields.OWNERSHIP_DESCRIPTION)}
      />
    </>
  );
};

export default EditDiverseOwnership;
