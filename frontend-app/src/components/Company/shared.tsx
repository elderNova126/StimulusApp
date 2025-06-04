import { Accordion, AccordionItemProps, AccordionProps } from '@chakra-ui/accordion';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSolidLock } from 'react-icons/bi';
import { CustomDatePicker } from '../GenericComponents';
import ActivityLog from './ActivityLog/ActivityLog';
import CertificationsPanel from './CertificationPanel/CertificationsPanel';
import ContactsPanel from './ContactsPanel/ContactsPanel';
import ContingenciesPanel from './ContingenciesPanel/ContingenciesPanel';
import CustomersPanel from './CustomersPanel/CustomersPanel';
import DiversityAndEmployeesPanel from './DiversityAndEmployees/DiversityAndEmployeesPanel';
import FeedPanel from './FeedPanel/FeedPanel';
import FinancialsPanel from './FinancialsPanel/FinancialsPanel';
import InsurancePanel from './InsurancePanel/InsurancePanel';
import LocationsPanel from './LocationsPanel/LocationsPanel';
import OverviewPanel from './OverviewPanel/OverViewPanel';
import ProductsPanel from './ProductsPanel/ProductsPanel';
import ProjectsPanel from './ProjectPanel/ProjectsPanel';
import { setCounterColor } from './RelationShipPanel/Comments/stylesComments';
import RelationshipPanel from './RelationShipPanel/RelationShipPanel';
import ScorePanel from './ScorePanel/ScorePanel';
import { Company, Section } from './company.types';
import AttachmentsPanel from './AttachmentsPanel/AttachmentsPanel';

interface EditCompanyRowAccordionProps {
  name: string | FC;
  setLowerName?: boolean;
  locked?: boolean;
}
interface EditCompanyTextFieldProps {
  w?: string;
  h?: string;
  locked: boolean;
  label?: string | FC;
  type: 'text' | 'number' | 'textarea';
  placeholder?: string;
  id?: string;
  'data-testid'?: string;
  value: number | string;
  max?: number;
  min?: number;
  iconLeft?: React.ReactElement;
  iconRight?: React.ReactElement;
  step?: number;
  onChange?: (val: number | string) => void;
  onClick?: (data: any) => void;
  onBlur?: (val: number | string) => void;
  required?: boolean;
  error?: string;
}
interface EditCompanyTextFieldPropsUrls {
  locked: boolean;
  label?: string | FC;
  placeholder?: string;
  id?: string;
  value: number | string;
  max?: number;
  min?: number;
  iconLeft?: any;
  iconRight?: any;
  step?: number;
  onChange: (val: string) => void;
  onBlur?: () => void;
  required?: boolean;
  error?: string;
}
interface EditCompanySelectFieldProps {
  value: string;
  label?: string | FC;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
  onRemove?: (val: string) => void;
  id?: string;
}
const CompanyAccordion: FC<AccordionProps> = (props) => (
  <Accordion {...props} allowMultiple w="100%" borderColor="#D5D5D5">
    {props.children}
  </Accordion>
);

const EditCompanyRowAccordion: FC<EditCompanyRowAccordionProps & AccordionItemProps> = (props) => {
  const { name, locked, children, setLowerName, ...itemProps } = props;

  return (
    <AccordionItem {...itemProps}>
      {({ isExpanded }) => (
        <>
          <Box>
            <AccordionButton p="0px">
              <Stack direction="row" spacing="20px" alignItems="center">
                <Box p="10px" transform={isExpanded ? 'rotate(90deg)' : 'none'}>
                  {locked ? (
                    <BiSolidLock color={name === 'Tax Identification Number' ? '#949493' : ''} />
                  ) : isExpanded ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </Box>
                <Box h="44px" position="relative">
                  <FakeRightBorder />
                </Box>

                <Box
                  flex="1"
                  textAlign="left"
                  aria-expanded={itemProps['aria-expanded']}
                  {...(setLowerName && isExpanded && { mt: '15px !important' })}
                >
                  <Text as="h4" textStyle="h4">
                    {name}
                  </Text>
                </Box>
              </Stack>
            </AccordionButton>
          </Box>
          <AccordionPanel pb={4} w="60%">
            <Stack spacing={3} pl="40px">
              {children}
            </Stack>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

const EditCompanyTextField: FC<EditCompanyTextFieldProps> = (props) => {
  const {
    label,
    type,
    placeholder,
    value,
    onChange,
    onClick,
    max,
    min,
    iconLeft,
    iconRight,
    onBlur,
    step,
    id,
    'data-testid': dataTestId,
    error,
    h,
    w,
  } = props;
  const { t } = useTranslation();
  const isTextArea = type === 'textarea';
  const isNumber = type === 'number';
  const handleChange = (e: { target: { value: string } }) => {
    if (onChange) onChange(type === 'number' ? parseInt(e.target.value, 10) : e.target.value);
  };
  const handleChangeNumber = (valueAsString: string, valueAsNumber: number) => {
    if (onChange) onChange(valueAsNumber);
  };
  const handleOnBlur = (e: { target: { value: string } }) => {
    if (onBlur) onBlur(type === 'number' ? parseInt(e.target.value, 10) : e.target.value);
  };

  return (
    <Stack spacing={1} w={w ? w : '445px'} h={h} onClick={onClick}>
      <Text textStyle="filterFieldHeading">{label}</Text>
      {isTextArea ? (
        <Box>
          <Textarea
            id={id}
            data-testid={dataTestId}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={handleChange}
            maxLength={max}
            minLength={min}
            errorBorderColor="alert.red"
            isInvalid={error ? true : false}
          />
          <Flex justifyContent={error ? 'space-between' : 'flex-end'} width="100%" alignItems="end">
            {error && (
              <Text textStyle="h6" color="secondary">
                {t(error)}
              </Text>
            )}
            {max && (
              <Text textStyle="filterFieldHeading" color={setCounterColor(value.toString(), max)}>
                {' '}
                {value.toString().length}/{max}
              </Text>
            )}
          </Flex>
        </Box>
      ) : isNumber ? (
        <NumberInput
          id={id}
          data-testid={dataTestId}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(valueAsString, valueAsNumber) => handleChangeNumber(valueAsString, valueAsNumber)}
          max={Number(max)}
          min={Number(min)}
          step={step}
          isInvalid={error ? true : false}
          errorBorderColor="alert.red"
        >
          <NumberInputField id={id} max={max} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      ) : (
        <InputGroup>
          {iconLeft && <InputLeftElement>{iconLeft}</InputLeftElement>}
          <Input
            id={id}
            data-testid={dataTestId}
            placeholder={placeholder}
            value={value ?? ''}
            _placeholder={{ opacity: 0.6 }}
            onChange={handleChange}
            onBlur={handleOnBlur}
            max={max}
            maxLength={max}
            min={min}
            isInvalid={error ? true : false}
            errorBorderColor="alert.red"
          />
          {iconRight && <InputRightElement>{iconRight}</InputRightElement>}
        </InputGroup>
      )}
    </Stack>
  );
};
const EditCompanyTextFieldUrl: FC<EditCompanyTextFieldPropsUrls> = (props) => {
  const { label, placeholder, value, onChange, onBlur, max, min, error } = props;
  const { t } = useTranslation();
  return (
    <Stack spacing={1} w="369px">
      <Text textStyle="filterFieldHeading">{label}</Text>
      <InputGroup size="sm">
        <Input
          borderRadius="5px"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value.toString())}
          onBlur={(event) => onBlur && onBlur()}
          max={max}
          maxLength={max}
          min={min}
          placeholder={placeholder}
          _placeholder={{ opacity: 0.6, fontSize: '12px' }}
          isInvalid={error ? true : false}
          errorBorderColor="alert.red"
        />
      </InputGroup>
      {error && (
        <Text textStyle="h6" color="secondary">
          {t(`${error}`)}
        </Text>
      )}
    </Stack>
  );
};

const EditCompanySelectField: FC<EditCompanySelectFieldProps> = (props) => {
  const { value, label, options, placeholder, id, onChange, onRemove, disabled } = props;
  const { t } = useTranslation();

  return (
    <Stack spacing={0} w="369px">
      <Text textStyle="filterFieldHeading">{label}</Text>
      <Select
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        fontSize="13px"
        color="grey"
        disabled={disabled}
        id={id ?? 'EditCompanySelectField'}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      {typeof onRemove === 'function' && (
        <Flex justify={'end'}>
          <Button onClick={() => onRemove(value)} variant="simple" size="xs">
            <Text textStyle="miniTextLink">{t('Remove')}</Text>
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

const CompanyDateEditField: FC<{
  date: Date;
  setDate: (date: Date) => void;
  required?: boolean;
  disabled?: boolean;
}> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { date, setDate, required, disabled } = props;

  return (
    <Flex
      _focus={{ border: '1px solid blue', borderRadius: '4px' }}
      position="relative"
      onClick={() => (open ? null : setOpen(true))}
      flexDirection="row"
    >
      <CustomDatePicker
        required={required}
        open={open}
        setDate={(date) => {
          setDate(date);
          setOpen(false);
        }}
        date={date}
        placeholder="MM/DD/YYY"
        disabled={disabled}
      />
    </Flex>
  );
};

const FakeRightBorder: FC<BoxProps> = (props) => (
  <Box
    {...props}
    position="absolute"
    right="0"
    h="100%"
    w="5px"
    bg="linear-gradient(90deg, #F4F4F4 0%, rgba(249, 249, 249, 0) 95%);"
  />
);
const CompanyProfileDivider: FC<BoxProps> = (props) => (
  <Box {...props} bg="linear-gradient(180deg, #F4F4F4 0%, rgba(249, 249, 249, 0) 95%)" w="100%" h="7px" />
);

const CreateTableItemButton: FC<{ label: string; onClick: () => void }> = (props) => {
  const { label, onClick } = props;

  return (
    <Stack direction="row" spacing="20px" alignItems="center" cursor="pointer" onClick={onClick}>
      <Box p="10px" pl="14px">
        <AiOutlinePlus color="green.600" />
      </Box>
      <Box h="44px" position="relative">
        <FakeRightBorder />
      </Box>

      <Box flex="1" textAlign="left">
        <Text as="h4" textStyle="h4" color="green.600">
          {label}
        </Text>
      </Box>
    </Stack>
  );
};

const SECTIONS = {
  Score: 'Stimulus Score',
  Relationships: 'Relationships',
  Overview: 'Overview',
  Feed: 'Feed',
  Financials: 'Financials',
  DiversityAndEmployees: 'Ownership and Employees',
  Customers: 'Customers & Brand',
  Contacts: 'Contacts',
  Locations: 'Locations',
  Products: 'Products',
  Insurance: 'Insurance',
  Certifications: 'Certifications',
  Contingencies: 'Contingencies',
  Projects: 'Projects',
  Attachment: 'Attachment',
  ActivityLog: 'Activity Log',
};
const defaultSections = [
  { name: SECTIONS.Score, show: true, href: '#score' },
  { name: SECTIONS.Relationships, show: true, href: '#relationships' },
  { name: SECTIONS.Overview, show: true, href: '#overview' },
  { name: SECTIONS.Feed, show: true, href: '#feed' },
  { name: SECTIONS.Financials, show: true, href: '#financials' },
  { name: SECTIONS.DiversityAndEmployees, show: true, href: '#diversityEmployees' },
  { name: SECTIONS.Contacts, show: true, href: '#contacts' },
  { name: SECTIONS.Locations, show: true, href: '#locations' },
  { name: SECTIONS.Products, show: true, href: '#products' },
  { name: SECTIONS.Insurance, show: true, href: '#insurance' },
  { name: SECTIONS.Certifications, show: true, href: '#certifications' },
  { name: SECTIONS.Contingencies, show: true, href: '#contingencies' },
  { name: SECTIONS.Projects, show: true, href: '#projects' },
  { name: SECTIONS.Attachment, show: true, href: '#attachment' },
  { name: SECTIONS.ActivityLog, show: true, href: '#activityLog' },
];

const SectionComponents = {
  [SECTIONS.Score]: ScorePanel,
  [SECTIONS.Relationships]: RelationshipPanel,
  [SECTIONS.Overview]: OverviewPanel,
  [SECTIONS.Feed]: FeedPanel,
  [SECTIONS.Financials]: FinancialsPanel,
  [SECTIONS.DiversityAndEmployees]: DiversityAndEmployeesPanel,
  [SECTIONS.Customers]: CustomersPanel,
  [SECTIONS.Contacts]: ContactsPanel,
  [SECTIONS.Locations]: LocationsPanel,
  [SECTIONS.Products]: ProductsPanel,
  [SECTIONS.Insurance]: InsurancePanel,
  [SECTIONS.Certifications]: CertificationsPanel,
  [SECTIONS.Contingencies]: ContingenciesPanel,
  [SECTIONS.Projects]: ProjectsPanel,
  [SECTIONS.Attachment]: AttachmentsPanel,
  [SECTIONS.ActivityLog]: ActivityLog,
};

const checkIsDataExists = (...values: any[]): boolean => {
  return values.some((value) => Boolean(value));
};
const FilteredDefaultSection = (company: Company): Section[] => {
  return defaultSections.map((section) => {
    if (section.name === SECTIONS.Feed) {
      company?.news.length > 0 ? (section.show = true) : (section.show = false);
    }

    if (section.name === SECTIONS.Financials) {
      const isFinancialData = checkIsDataExists(
        company?.revenue,
        company?.revenueGrowthCAGR,
        company?.netProfit,
        company?.netProfitGrowthCAGR,
        company?.totalAssets,
        company?.assetsRevenueRatio,
        company?.totalLiabilities,
        company?.liabilitiesRevenueRatio
      );
      return isFinancialData ? section : { ...section, show: false };
    }

    if (section.name === SECTIONS.DiversityAndEmployees) {
      const isDiverisityAndEmployesData = checkIsDataExists(
        company?.employeesDiverse,
        company?.employeesTotal,
        company?.employeesTotalGrowthCAGR,
        company?.revenuePerEmployee,
        company?.leadershipTeamDiverse,
        company?.leadershipTeamTotal,
        company?.diverseOwnership.length,
        company?.boardDiverse,
        company?.boardTotal
      );
      return isDiverisityAndEmployesData ? section : { ...section, show: false };
    }

    if (section.name === SECTIONS.Insurance) {
      const isInsuranceData = company?.insuranceCoverage?.results?.length;
      return isInsuranceData ? section : { ...section, show: false };
    }

    if (section.name === SECTIONS.Contingencies) {
      const isContingenciesData = company?.contingencies?.results?.length;
      return isContingenciesData ? section : { ...section, show: false };
    }
    return section;
  });
};

export {
  EditCompanyRowAccordion,
  EditCompanyTextFieldUrl,
  EditCompanyTextField,
  EditCompanySelectField,
  FakeRightBorder,
  CompanyProfileDivider,
  CompanyAccordion,
  defaultSections,
  SectionComponents,
  CompanyDateEditField,
  CreateTableItemButton,
  FilteredDefaultSection,
};
