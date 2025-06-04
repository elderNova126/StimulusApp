import { useLazyQuery } from '@apollo/client';
import { LockIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineLink } from 'react-icons/ai';
import { BiSolidLock } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import CompanyQueries from '../../../graphql/Queries/CompanyQueries';
import { useJurisdictionOfIncorporationParts } from '../../../hooks';
import { FormCompanyContext } from '../../../hooks/companyForms/companyForm.provider';
import { CompanyFormFields } from '../../../hooks/companyForms/FormValidations';
import { useGetCountries } from '../../../hooks/ISO3166/ISO3166';
import { useTags } from '../../../hooks/TagsHook';
import {
  CompanyUpdateState,
  setCreditScoreBusinessNo,
  setFacebook,
  setJurisdictionOfIncorporation,
  setLinkedIn,
  setOperatingStatus,
  setParentCompanyTaxId,
  setTwitter,
  setTypeOfLegalEntity,
  setWebsite,
  setYearFounded,
  Tag,
} from '../../../stores/features/company';
import { LegalEntityType, OperatingStatus } from '../../../utils/constants';
import { localeNumberFormat } from '../../../utils/number';
import AutoSuggestion, { IItem } from '../AutoSuggestion/AutoSuggestion';
import {
  CompanyAccordion,
  EditCompanyRowAccordion,
  EditCompanySelectField,
  EditCompanyTextField,
  EditCompanyTextFieldUrl,
} from '../shared';
import EditDescription from './EditDescription';
import EditDiverseOwnership from './EditDiverseOwnership';
import IndustriesForm from './IndustriesForm';
import {
  flexHighlightProjectOverview,
  flexTaxIdInput,
  lockIconHighlightEdit,
  popoverBodyTaxId,
  stackHighlights,
  styleIconLock,
  taxIdLink,
  textHighlightBoxEdit,
  textTaxId,
} from './Styles';
import { UpdateBusinessNamas } from './UpdateBusinessName/UpdateBusinessName';
import FormErrorsMessage from '../../GenericComponents/FormErrorsMessage';

const { COMPANY_TAX_ID_SEARCH_PROFILE } = CompanyQueries;

const UpdatePanel = (props: { company: any }) => {
  const { company } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchTags, setSearchTags] = useState('');
  const { addTag, removeTag, tags: availableTags, loading: loadingTagsSearch } = useTags(searchTags);

  const yearFounded = useSelector((state: { company: CompanyUpdateState }) => state.company.yearFounded);
  const tags = useSelector((state: { company: CompanyUpdateState }) => state.company.tags ?? []);

  const industries = useSelector((state: { company: CompanyUpdateState }) => state.company.industries ?? []);
  const description = useSelector((state: { company: CompanyUpdateState }) => state.company.description);
  const website = useSelector((state: { company: CompanyUpdateState }) => state.company.website);
  const facebook = useSelector((state: { company: CompanyUpdateState }) => state.company.facebook);
  const twitter = useSelector((state: { company: CompanyUpdateState }) => state.company.twitter);
  const linkedin = useSelector((state: { company: CompanyUpdateState }) => state.company.linkedin);

  const typeOfLegalEntity = useSelector((state: { company: CompanyUpdateState }) => state.company.typeOfLegalEntity);
  const operatingStatus = useSelector((state: { company: CompanyUpdateState }) => state.company.operatingStatus);
  const creditScoreBusinessNo = useSelector(
    (state: { company: CompanyUpdateState }) => state.company.creditScoreBusinessNo
  );
  const taxIdNo = useSelector((state: { company: CompanyUpdateState }) => state.company.taxIdNo);
  const { country, countrySub, setJurisdiction } = useJurisdictionOfIncorporationParts();
  const parentCompanyTaxId = useSelector((state: { company: CompanyUpdateState }) => state.company.parentCompanyTaxId);
  const [selectedParentCompany, setSelectedParentCompany] = useState<string | null>(company?.parentCompany?.id ?? '');
  const [errorParent, setErrorParent] = useState(false);
  const [highlightEditMode, setHighlightEditMode] = useState(false);

  const { formMethods } = useContext(FormCompanyContext)!;
  const { register, errors, setValue } = formMethods;

  const { country: CountryCodes, listOfCountries } = useGetCountries(country);

  const [searchCompanies, { loading: loadingCompanies }] = useLazyQuery(COMPANY_TAX_ID_SEARCH_PROFILE, {
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      if (data?.searchCompanies?.results) {
        setSelectedParentCompany(data?.searchCompanies?.results[0]?.id);
      }
    },
  });

  useEffect(() => {
    company?.taxIdNo && setValue(CompanyFormFields.COMPANY_TAX_ID, company?.taxIdNo, { shouldValidate: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!errorParent) {
      if (parentCompanyTaxId?.length === 13) {
        searchCompanies({ variables: { taxIdNo: parentCompanyTaxId } });
      } else {
        setSelectedParentCompany('');
      }
    }
  }, [parentCompanyTaxId, company]);

  const handleParentTaxId = (e: any) => {
    setValue(CompanyFormFields.PARENT_COMPANY_TAX_ID, e?.target?.value, { shouldValidate: true });
    dispatch(setParentCompanyTaxId(e?.target?.value as string));
    if (e?.target?.value === company.taxIdNo) {
      setErrorParent(true);
    } else {
      setErrorParent(false);
    }
  };

  const addTagToCompany = (tags: Tag[], item: IItem) => {
    setSearchTags('');
    addTag(tags, item);
  };

  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const linkRef: any = useRef();

  const handlePopoverOpen = () => {
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setTimeout(() => {
      if (!linkRef.current) {
        setPopoverOpen(false);
      }
    }, 200);
  };

  useEffect(() => {
    if (
      company?.customers > 0 ||
      company.projectsOverview?.totalProjects > 0 ||
      company.projectsOverview?.totalEvaluations > 0 ||
      company?.projectsOverview?.globalSpent > 0
    ) {
      setHighlightEditMode(true);
    }
  }, [company]);

  const listOfEvents = {
    [CompanyFormFields.WEBSITE]: setWebsite,
    [CompanyFormFields.FACEBOOK]: setFacebook,
    [CompanyFormFields.TWITTER]: setTwitter,
    [CompanyFormFields.LINKEDIN]: setLinkedIn,
    [CompanyFormFields.PARENT_COMPANY_TAX_ID]: setParentCompanyTaxId,
    operatingStatus: setOperatingStatus,
    typeOfLegalEntity: setTypeOfLegalEntity,
    [CompanyFormFields.YEAR_FOUNDED]: setYearFounded,
    [CompanyFormFields.JURISDICTION_OF_INCORPORATION]: setJurisdictionOfIncorporation,
  };

  const handleValueChange = (field: string, value: any) => {
    const event = listOfEvents[field as keyof typeof listOfEvents];
    dispatch(event(value as never));
    setValue(field, value, { shouldValidate: true });
  };

  const handleSetJurisdictionOfIncorporation = (value: { country: string; countrySub: string }) => {
    const { country, countrySub } = value;
    setJurisdiction(country, countrySub);
  };

  return (
    <CompanyAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Highlights')} borderTopWidth="0px">
        <Stack sx={stackHighlights}>
          {highlightEditMode && (
            <Flex sx={flexHighlightProjectOverview}>
              <Stack ml="13px">
                {company?.customers > 0 && (
                  <Text data-testid="customer-update" id="customer-update" sx={textHighlightBoxEdit}>
                    Customers: {company.customers}
                  </Text>
                )}
                {company.projectsOverview?.totalProjects > 0 && (
                  <Text data-testid="total-projects-update" id="total-projects-update" sx={textHighlightBoxEdit}>
                    Projects: {company.projectsOverview?.totalProjects}
                  </Text>
                )}
                {company.projectsOverview?.totalEvaluations > 0 && (
                  <Text data-testid="global-spent-update" id="global-spent-update" sx={textHighlightBoxEdit}>
                    Evaluations: {company.projectsOverview?.totalEvaluations}
                  </Text>
                )}
                {company?.projectsOverview?.globalSpent > 0 && (
                  <Text data-testid="evaluations-update" id="evaluations-update" sx={textHighlightBoxEdit}>
                    Total Spent: ${localeNumberFormat(company.projectsOverview?.globalSpent ?? 0)}
                  </Text>
                )}
              </Stack>
              <Box sx={lockIconHighlightEdit}>
                <LockIcon sx={styleIconLock} />
              </Box>
            </Flex>
          )}
          <EditCompanyTextField
            {...register(CompanyFormFields.YEAR_FOUNDED)}
            w="369px"
            type="text"
            label={t('Year Founded')}
            locked={false}
            value={yearFounded as number}
            min={0}
            max={new Date().getFullYear()}
            error={errors?.[CompanyFormFields.YEAR_FOUNDED]?.message}
            onChange={(val) => handleValueChange(CompanyFormFields.YEAR_FOUNDED, val)}
          />
          <FormErrorsMessage errorMessage={errors?.[CompanyFormFields.YEAR_FOUNDED]?.message} />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Industry')}>
        <Stack sx={stackHighlights} w="369px">
          <IndustriesForm industries={industries} />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Ownership')}>
        <Stack sx={stackHighlights} w="369px">
          <EditDiverseOwnership company={company} />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Tags')}>
        <Stack sx={stackHighlights}>
          <Stack w="369px">
            <AutoSuggestion
              loading={loadingTagsSearch}
              availableItems={availableTags}
              selectedItems={tags.map((tag) => ({ value: tag.tag, exists: true }))}
              onAddItem={(item: IItem) => addTagToCompany(tags, item)}
              onRemoveItem={(item: IItem) => removeTag(tags, item)}
              onChangeSearch={(search: string) => {
                setSearchTags(search);
              }}
            />
          </Stack>
        </Stack>
      </EditCompanyRowAccordion>
      <EditDescription description={description} />
      <EditCompanyRowAccordion setLowerName={true} name={t('URLs')}>
        <Stack sx={stackHighlights}>
          <EditCompanyTextFieldUrl
            {...register(CompanyFormFields.WEBSITE)}
            error={website && errors?.[CompanyFormFields.WEBSITE]?.message}
            label={t(CompanyFormFields.WEBSITE)}
            locked={false}
            value={website}
            onChange={(val: string) => handleValueChange(CompanyFormFields.WEBSITE, val)}
            placeholder={'https://www.company_name.com'}
          />
          <EditCompanyTextFieldUrl
            {...register(CompanyFormFields.FACEBOOK)}
            error={errors?.[CompanyFormFields.FACEBOOK]?.message}
            label={t(CompanyFormFields.FACEBOOK)}
            locked={false}
            value={facebook}
            onChange={(val: string) => handleValueChange(CompanyFormFields.FACEBOOK, val)}
            placeholder={'https://www.facebook.com/company_name'}
          />
          <EditCompanyTextFieldUrl
            {...register(CompanyFormFields.LINKEDIN)}
            error={errors?.[CompanyFormFields.LINKEDIN]?.message}
            label={t('LinkedIn')}
            locked={false}
            value={linkedin}
            onChange={(val: string) => handleValueChange(CompanyFormFields.LINKEDIN, val)}
            placeholder={'https://www.linkedin.com/company/company_name'}
          />
          <EditCompanyTextFieldUrl
            {...register(CompanyFormFields.TWITTER)}
            error={errors?.[CompanyFormFields.TWITTER]?.message}
            label={t(CompanyFormFields.TWITTER)}
            locked={false}
            value={twitter}
            onChange={(val: string) => handleValueChange(CompanyFormFields.TWITTER, val)}
            placeholder={'https://www.twitter.com/company_user_name'}
          />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Credit Score Business Number')}>
        <Stack sx={stackHighlights}>
          <EditCompanyTextField
            w="369px"
            type="number"
            min={0}
            max={Number.MAX_SAFE_INTEGER}
            locked={false}
            value={Number(creditScoreBusinessNo)}
            onChange={(val) => dispatch(setCreditScoreBusinessNo(val ? val.toString() : ''))}
          />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion locked={true} name={t('Tax Identification Number')}>
        <Flex onMouseLeave={() => setPopoverOpen(false)} sx={flexTaxIdInput}>
          <Text sx={textTaxId} data-testid="tax-id-no" {...register(CompanyFormFields.COMPANY_TAX_ID)}>
            {taxIdNo}
          </Text>
          <Box mt="-2px">
            <Popover placement="top" isOpen={isPopoverOpen} onOpen={handlePopoverOpen} onClose={handlePopoverClose}>
              <PopoverTrigger data-testid="popover-trigger">
                <span onMouseEnter={handlePopoverOpen}>
                  <BiSolidLock color="#b7b7b7" />
                </span>
              </PopoverTrigger>
              <PopoverContent onMouseEnter={handlePopoverOpen} border="none">
                <PopoverBody onMouseLeave={() => setPopoverOpen(false)} sx={popoverBodyTaxId}>
                  <Stack>
                    <Text fontSize="14px" fontWeight="bold">
                      Tax Identification Number Locked
                    </Text>
                    <Text fontSize="12px">
                      Any changes to a tax identification number will need to be reviewed by our team. If you need to
                      update your tax identification number please{' '}
                      <Link
                        ref={linkRef}
                        target="_blank"
                        href="https://getstimulus.freshdesk.com/support/tickets/new"
                        sx={taxIdLink}
                      >
                        request a change.
                      </Link>
                    </Text>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Flex>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Operating Status')}>
        <Stack sx={stackHighlights}>
          <EditCompanySelectField
            options={OperatingStatus}
            key={`operatingStatus`}
            onChange={(val) => {
              dispatch(setOperatingStatus(val as string));
            }}
            value={operatingStatus}
          />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t(CompanyFormFields.JURISDICTION_OF_INCORPORATION)}>
        <Stack sx={stackHighlights}>
          <EditCompanySelectField
            label={CompanyFormFields.JURISDICTION_OF_INCORPORATION_COUNTRY}
            options={listOfCountries}
            key={`jurisdictionOfIncorporationCountry`}
            onChange={(val) => {
              handleSetJurisdictionOfIncorporation({
                country: val as string,
                countrySub: '',
              });
            }}
            value={country}
          />
          {CountryCodes?.length > 0 && (
            <EditCompanySelectField
              disabled={CountryCodes.length === 0}
              label={t(CompanyFormFields.JURISDICTION_OF_INCORPORATION_COUNTRY_SUB_DIDBISION)}
              options={CountryCodes}
              key={`jurisdictionOfIncorporationCountrySubdivision`}
              onChange={(val) => {
                handleSetJurisdictionOfIncorporation({ country, countrySub: val as string });
              }}
              value={countrySub}
            />
          )}
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Legal Entity Type')}>
        <Stack sx={stackHighlights}>
          <EditCompanySelectField
            options={LegalEntityType}
            key={`typeOfLegalEntitySelect`}
            onChange={(val) => {
              dispatch(setTypeOfLegalEntity(val === 'Select Legal Entity Type' ? '' : (val as string)));
            }}
            value={typeOfLegalEntity}
            id="typeOfLegalEntitySelect"
          />
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Parent Company Tax ID')}>
        <Stack sx={stackHighlights}>
          <Stack>
            <Stack w="369px">
              <InputGroup>
                <Input
                  id="parent-taxIdNo-input"
                  data-testid="parent-taxIdNo-input"
                  placeholder={'Tax ID'}
                  value={parentCompanyTaxId}
                  onChange={handleParentTaxId}
                  {...register(CompanyFormFields.PARENT_COMPANY_TAX_ID)}
                  isInvalid={errors?.[CompanyFormFields.PARENT_COMPANY_TAX_ID] ? true : false}
                />
                <InputRightElement
                  {...(loadingCompanies
                    ? { children: <Spinner /> }
                    : {
                        children: selectedParentCompany ? (
                          <Link target="_blank" href={`/company/${selectedParentCompany}`}>
                            <AiOutlineLink cursor="pointer" />
                          </Link>
                        ) : null,
                      })}
                />
              </InputGroup>
              {errors?.[CompanyFormFields.PARENT_COMPANY_TAX_ID] && (
                <Text textStyle="h6" color="secondary">
                  {t(errors[CompanyFormFields.PARENT_COMPANY_TAX_ID]?.message)}
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>
      </EditCompanyRowAccordion>
      <EditCompanyRowAccordion setLowerName={true} name={t('Business Name(s)')}>
        <UpdateBusinessNamas />
      </EditCompanyRowAccordion>
    </CompanyAccordion>
  );
};

export default UpdatePanel;
