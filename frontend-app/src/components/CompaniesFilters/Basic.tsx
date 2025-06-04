import { Box, Divider, Flex, NumberInput, NumberInputField, Select, Stack, Text, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiscoveryState,
  FilterInterval,
  setIndustries,
  setRelationships,
  setStatus,
  setStimulusScoreFrom,
  setStimulusScoreTo,
  setType,
  setTypeOfLegalEntity,
  setRelationshipLengthFrom,
  setRelationshipLengthTo,
  setProjectsCountFrom,
  setProjectsCountTo,
  setTeamCountFrom,
  setTeamCountTo,
  setAmountSpentFrom,
  setAmountSpentTo,
  setDegreeOfSeparation,
} from '../../stores/features';
import { Checkbox } from '../GenericComponents';
import NaicsCodeSelectWrapper from '../NaicsCodeSelect';
import LocationFilter from './BasicFilters/LocationFilters';

const BasicFilters = () => {
  const { t } = useTranslation();
  return (
    <Box p="1.5rem" maxWidth="60vw">
      <Text as="h2" textStyle="h2">
        {t('Basic')}
      </Text>
      <Divider m="12px 0" />
      <Flex>
        <Box flex="38%">
          <StimulusScoreFilter />
          <IndustryFilter />
          <LocationFilter />
          <LegalEntityType />
        </Box>
        <Box flex="33%" pl="10">
          <RelationshipFilter />
        </Box>
        <Box flex="29%" pl="10">
          <StatusFilter />
        </Box>
      </Flex>
    </Box>
  );
};

export const StimulusScoreFilter = () => {
  const stimulusScore: FilterInterval = useSelector(
    (state: { discovery: DiscoveryState }) => state.discovery?.stimulusScore
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <>
      <Text as="h4" textStyle="h4">
        {t('Stimulus Score')}
      </Text>
      <Flex alignItems="center" marginTop="1rem" marginBottom="1.2rem">
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(stimulusScore.from)) ? stimulusScore?.from : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setStimulusScoreFrom(valueAsNumber));
          }}
          max={stimulusScore?.to}
          min={Number(0)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Min')} />
        </NumberInput>
        <Divider w="3" m="1" />
        <NumberInput
          bg="#fff"
          size="sm"
          flex="1"
          value={!isNaN(Number(stimulusScore?.to)) ? stimulusScore?.to : ''}
          onChange={(valueAsString, valueAsNumber) => {
            dispatch(setStimulusScoreTo(valueAsNumber));
          }}
          min={Number(stimulusScore?.from)}
        >
          <NumberInputField borderRadius="4px" placeholder={t('Max')} />
        </NumberInput>
      </Flex>
    </>
  );
};

export const IndustryFilter = () => {
  const industries = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.industries);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <>
      <Text as="h4" textStyle="h4" mb="0.15rem">
        {t('Industry')}
      </Text>
      <NaicsCodeSelectWrapper
        multiSelect
        selectedNaics={industries.map((industry, i) => ({
          id: industry.id,
          code: industry.code,
          title: industry.title,
          value: `${industry.code ?? industry.title}`,
          label: `${industry.code} ${industry.title}`,
        }))}
        setSelectedNaics={(industry: any) => {
          const isCustom = industry[0].code ? false : true;
          if (industry[0]) {
            const exist = industries.find((i) => i.id === industry[0].id);
            let newIndustries: any = [...industries];
            if (exist) {
              newIndustries = industries.filter((i) => i.id !== industry[0].id);
              dispatch(setIndustries(newIndustries));
            } else {
              if (isCustom) {
                const customIndustry = { ...industry[0], children: [] };
                newIndustries = [...industries, customIndustry];
                dispatch(setIndustries(newIndustries));
              } else {
                newIndustries = [...newIndustries, industry[0]];
                dispatch(setIndustries(newIndustries));
              }
            }
          } else {
            dispatch(setIndustries([]));
          }
        }}
        setDeleteNaics={(industry: any) => {
          const isCustom = industry.code ? false : true;
          if (isCustom) {
            const newIndustries = industries.filter((i) => i.id !== industry.id);
            dispatch(setIndustries(newIndustries));
          } else {
            const newIndustries = industries.filter((i) => i.code !== industry.code);
            dispatch(setIndustries(newIndustries));
          }
        }}
      />
    </>
  );
};

export const LegalEntityType = () => {
  const legalEntity = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.typeOfLegalEntity);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <>
      <Text as="h4" textStyle="h4" marginY="1rem">
        {t('Legal Entity Type')}
      </Text>
      <Select
        iconSize="18px"
        placeholder="Select a legal entity"
        size="sm"
        borderRadius="4px"
        bg="#fff"
        value={legalEntity}
        onChange={(e) => dispatch(setTypeOfLegalEntity(e.target.value))}
      >
        <option value="Corporation">Corporation</option>
        <option value="Not for Profit">Not for Profit</option>
        <option value="Limited Liability Company">Limited Liability Company</option>
        <option value="Government">Government</option>
        <option value="Individual Proprietorship">Individual Proprietorship</option>
        <option value="Partnership">Partnership</option>
      </Select>
    </>
  );
};

export const RelationshipFilter = () => {
  type RootState = { discovery: DiscoveryState };
  const relationships = useSelector((state: RootState) => state.discovery?.relationships);
  const relationshipLength: FilterInterval = useSelector((state: RootState) => state.discovery?.relationshipLength);
  const projectsCount = useSelector((state: RootState) => state.discovery?.projectsCount);
  const teamCount = useSelector((state: RootState) => state.discovery?.teamCount);
  const amountSpent = useSelector((state: RootState) => state.discovery?.amountSpent);
  const degreeOfSeparation = useSelector((state: RootState) => state.discovery?.degreeOfSeparation);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <>
      <Text as="h4" textStyle="h4" pb="20px">
        {t('Relationship')}
      </Text>
      <Stack spacing={3} direction="column">
        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={(e: any) => {
            if (relationships.indexOf('considered') > -1) {
              dispatch(setRelationships(relationships.filter((i) => i !== 'considered')));
            } else {
              dispatch(setRelationships([...relationships, 'considered']));
            }
          }}
        >
          <Checkbox checked={relationships.indexOf('considered') > -1} />
          <Text textStyle="body">{t('Considered')}</Text>
        </Stack>
        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={(e: any) => {
            if (relationships.indexOf('qualified') > -1) {
              dispatch(setRelationships(relationships.filter((i) => i !== 'qualified')));
            } else {
              dispatch(setRelationships([...relationships, 'qualified']));
            }
          }}
        >
          <Checkbox checked={relationships.indexOf('qualified') > -1} />
          <Text textStyle="body">{t('Qualified')}</Text>
        </Stack>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={(e: any) => {
            if (relationships.indexOf('shortlisted') > -1) {
              dispatch(setRelationships(relationships.filter((i) => i !== 'shortlisted')));
            } else {
              dispatch(setRelationships([...relationships, 'shortlisted']));
            }
          }}
        >
          <Checkbox checked={relationships.indexOf('shortlisted') > -1} />
          <Text textStyle="body">{t('Short Listed')}</Text>
        </Stack>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={(e: any) => {
            if (relationships.indexOf('awarded') > -1) {
              dispatch(setRelationships(relationships.filter((i) => i !== 'awarded')));
            } else {
              dispatch(setRelationships([...relationships, 'awarded']));
            }
          }}
        >
          <Checkbox checked={relationships.indexOf('awarded') > -1} />
          <Text textStyle="body">{t('Awarded')}</Text>
        </Stack>
        {/* length of relationshiop */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Relationship Length')}
        </Text>
        <Flex alignItems="center">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(relationshipLength.from)) ? relationshipLength?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setRelationshipLengthFrom(valueAsNumber));
            }}
            max={relationshipLength?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(relationshipLength.to)) ? relationshipLength.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setRelationshipLengthTo(valueAsNumber));
            }}
            min={relationshipLength?.from}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
        {/* degree of separation */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Degree of Separation')}
        </Text>
        <Select
          iconSize="18px"
          placeholder="Select a Separation"
          size="sm"
          borderRadius="4px"
          bg="#fff"
          value={degreeOfSeparation}
          onChange={(e) => dispatch(setDegreeOfSeparation(e.target.value))}
        >
          <option value="Tier 1">Tier 1</option>
          <option value="Tier 2">Tier 2</option>
          <option value="Tier 3">Tier 3</option>
        </Select>
        {/* # of projects */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Number of projects')}
        </Text>
        <Flex alignItems="center">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(projectsCount?.from)) ? projectsCount?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setProjectsCountFrom(valueAsNumber > 0 ? valueAsNumber : undefined));
            }}
            max={projectsCount?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(projectsCount?.to)) ? projectsCount?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setProjectsCountTo(valueAsNumber > 0 ? valueAsNumber : undefined));
            }}
            min={projectsCount?.from}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
        {/* # of Teams */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Number of Teams')}
        </Text>
        <Flex alignItems="center">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(teamCount?.from)) ? teamCount?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setTeamCountFrom(valueAsNumber > 0 ? valueAsNumber : undefined));
            }}
            max={teamCount?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(teamCount?.to)) ? teamCount?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setTeamCountTo(valueAsNumber > 0 ? valueAsNumber : undefined));
            }}
            min={teamCount?.from}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
        {/* $ spent */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Amount spent')}
        </Text>
        <Flex alignItems="center">
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(amountSpent?.from)) ? amountSpent?.from : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setAmountSpentFrom(valueAsNumber > 0 ? valueAsNumber : undefined));
            }}
            max={amountSpent?.to}
            min={Number(0)}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Min')} />
          </NumberInput>
          <Divider w="3" m="1" />
          <NumberInput
            bg="#fff"
            size="sm"
            flex="1"
            value={!isNaN(Number(amountSpent?.to)) ? amountSpent?.to : ''}
            onChange={(valueAsString, valueAsNumber) => {
              dispatch(setAmountSpentTo(valueAsNumber > 0 ? valueAsNumber : undefined));
            }}
            min={amountSpent?.from}
          >
            <NumberInputField borderRadius="4px" placeholder={t('Max')} />
          </NumberInput>
        </Flex>
        {/* Internal Certifications */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Internal Certifications')}
        </Text>
        <Stack spacing={3} direction="column">
          <HStack spacing={3} direction="row" alignItems="center" cursor="pointer">
            <Checkbox checked={false} />
            <Text textStyle="body">{t('Certification 1')}</Text>
          </HStack>
          <HStack spacing={3} direction="row" alignItems="center" cursor="pointer">
            <Checkbox checked={false} />
            <Text textStyle="body">{t('Certification 2')}</Text>
          </HStack>
        </Stack>
        {/* badges */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Badges')}
        </Text>
        <Stack spacing={3} direction="column">
          <HStack spacing={3} direction="row" alignItems="center" cursor="pointer">
            <Checkbox checked={false} />
            <Text textStyle="body">{t('Badge 1')}</Text>
          </HStack>
          <HStack spacing={3} direction="row" alignItems="center" cursor="pointer">
            <Checkbox checked={false} />
            <Text textStyle="body">{t('Badge 2')}</Text>
          </HStack>
        </Stack>
        {/* milestones */}
        <Text as="h4" textStyle="h4" mt="20px">
          {t('Milestones')}
        </Text>
        <Stack spacing={3} direction="column">
          <HStack spacing={3} direction="row" alignItems="center" cursor="pointer">
            <Checkbox checked={false} />
            <Text textStyle="body">{t('Milestone 1')}</Text>
          </HStack>
          <HStack spacing={3} direction="row" alignItems="center" cursor="pointer">
            <Checkbox checked={false} />
            <Text textStyle="body">{t('Milestone 2')}</Text>
          </HStack>
        </Stack>
      </Stack>
    </>
  );
};

export const StatusFilter = () => {
  const dispatch = useDispatch();
  const status = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.status);
  const type = useSelector((state: { discovery: DiscoveryState }) => state.discovery?.type);
  const titleList = window.location.pathname.split('/').slice(2, 3)[0];
  const { t } = useTranslation();

  const handleToggleItem = (target: string) => {
    const newItems = status.indexOf(target) > -1 ? status.filter((item) => item !== target) : [...status, target];

    if (!type.includes('internal')) {
      dispatch(setType([...type, 'internal']));
    } else if (newItems.length === 0) {
      dispatch(setType([...type].filter((item) => item !== 'internal')));
    }
    dispatch(setStatus(newItems));
  };

  return (
    <>
      <Text as="h4" textStyle="h4" pb="20px">
        {t('Status')}
      </Text>

      <Stack direction="column">
        {titleList !== 'internal' && (
          <Stack
            spacing={3}
            direction="row"
            alignItems="center"
            cursor="pointer"
            onClick={(e: any) => {
              if (type.indexOf('external') > -1) {
                dispatch(setType(type.filter((i) => i !== 'external')));
              } else {
                dispatch(setType([...type, 'external']));
              }
            }}
          >
            <Checkbox data-testid="external" checked={type.indexOf('external') > -1} />
            <Text textStyle="body">{t('External')}</Text>
          </Stack>
        )}
        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={() => handleToggleItem('active')}
        >
          <Checkbox data-testid="internal-active" checked={status.indexOf('active') > -1} />
          <Text textStyle="body">{t('Internal - Active')}</Text>
        </Stack>
        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={() => handleToggleItem('inactive')}
        >
          <Checkbox data-testid="internal-inactive" checked={status.indexOf('inactive') > -1} />
          <Text textStyle="body">{t('Internal - Inactive')}</Text>
        </Stack>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          cursor="pointer"
          onClick={() => handleToggleItem('archived')}
        >
          <Checkbox data-testid="internal-archive" checked={status.indexOf('archived') > -1} />
          <Text textStyle="body">{t('Internal - Archive')}</Text>
        </Stack>
      </Stack>
    </>
  );
};

export default BasicFilters;
